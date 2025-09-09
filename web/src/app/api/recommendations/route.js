import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { student_id } = body;

    if (!student_id) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Get student profile
    const studentProfile = await sql`
      SELECT 
        u.id, u.full_name, u.email,
        sp.university, sp.major, sp.graduation_year, sp.gpa,
        sp.skills, sp.interests, sp.experience_level, sp.preferred_location,
        sp.bio
      FROM users u
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.id = ${student_id} AND u.user_type = 'student'
    `;

    if (studentProfile.length === 0) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentProfile[0];

    // Get available internships
    const internships = await sql`
      SELECT 
        i.*,
        c.name as company_name,
        c.industry,
        c.description as company_description
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.is_active = true
      AND i.application_deadline >= CURRENT_DATE
      AND i.id NOT IN (
        SELECT internship_id FROM applications WHERE student_id = ${student_id}
      )
    `;

    // Use AI to generate recommendations
    const aiResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an AI internship recommendation engine. Analyze student profiles and internship opportunities to provide personalized recommendations with match scores and reasoning.

Student Profile:
- Name: ${student.full_name}
- Major: ${student.major || 'Not specified'}
- University: ${student.university || 'Not specified'}
- Graduation Year: ${student.graduation_year || 'Not specified'}
- GPA: ${student.gpa || 'Not specified'}
- Skills: ${student.skills ? student.skills.join(', ') : 'Not specified'}
- Interests: ${student.interests ? student.interests.join(', ') : 'Not specified'}
- Experience Level: ${student.experience_level || 'Not specified'}
- Preferred Location: ${student.preferred_location || 'Not specified'}
- Bio: ${student.bio || 'Not specified'}

For each internship, provide a match score (0-100) and detailed reasoning explaining why this internship is or isn't a good fit based on:
1. Skills alignment
2. Academic background relevance
3. Location preferences
4. Experience level match
5. Career interests alignment
6. Company culture fit

Focus on being helpful and specific in your recommendations.`
          },
          {
            role: 'user',
            content: `Please analyze these internship opportunities and provide recommendations:

${internships.map(internship => `
Internship ID: ${internship.id}
Title: ${internship.title}
Company: ${internship.company_name}
Industry: ${internship.industry}
Location: ${internship.location}
Remote: ${internship.is_remote ? 'Yes' : 'No'}
Duration: ${internship.duration_months} months
Stipend: $${internship.stipend_amount}
Description: ${internship.description}
Requirements: ${internship.requirements ? internship.requirements.join(', ') : 'None specified'}
Preferred Skills: ${internship.preferred_skills ? internship.preferred_skills.join(', ') : 'None specified'}
`).join('\n---\n')}`
          }
        ],
        json_schema: {
          name: "internship_recommendations",
          schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    internship_id: { type: "number" },
                    match_score: { type: "number" },
                    reasoning: { type: "string" },
                    key_strengths: {
                      type: "array",
                      items: { type: "string" }
                    },
                    potential_concerns: {
                      type: "array", 
                      items: { type: "string" }
                    }
                  },
                  required: ["internship_id", "match_score", "reasoning", "key_strengths", "potential_concerns"],
                  additionalProperties: false
                }
              }
            },
            required: ["recommendations"],
            additionalProperties: false
          }
        }
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI recommendation failed');
    }

    const aiResult = await aiResponse.json();
    const recommendations = JSON.parse(aiResult.choices[0].message.content);

    // Store recommendations in database
    const storedRecommendations = [];
    for (const rec of recommendations.recommendations) {
      const stored = await sql`
        INSERT INTO recommendations (student_id, internship_id, match_score, reasoning)
        VALUES (${student_id}, ${rec.internship_id}, ${rec.match_score}, ${rec.reasoning})
        ON CONFLICT (student_id, internship_id) 
        DO UPDATE SET 
          match_score = EXCLUDED.match_score,
          reasoning = EXCLUDED.reasoning,
          created_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      // Get full internship details for response
      const internshipDetails = internships.find(i => i.id === rec.internship_id);
      storedRecommendations.push({
        ...stored[0],
        internship: internshipDetails,
        key_strengths: rec.key_strengths,
        potential_concerns: rec.potential_concerns
      });
    }

    // Sort by match score
    storedRecommendations.sort((a, b) => b.match_score - a.match_score);

    return Response.json({ 
      recommendations: storedRecommendations,
      student_profile: student
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return Response.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');

    if (!student_id) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const recommendations = await sql`
      SELECT 
        r.*,
        i.title, i.description, i.location, i.duration_months, i.stipend_amount, i.is_remote,
        c.name as company_name, c.industry, c.logo_url
      FROM recommendations r
      JOIN internships i ON r.internship_id = i.id
      JOIN companies c ON i.company_id = c.id
      WHERE r.student_id = ${student_id}
      AND i.is_active = true
      AND i.application_deadline >= CURRENT_DATE
      ORDER BY r.match_score DESC
    `;

    return Response.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return Response.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}