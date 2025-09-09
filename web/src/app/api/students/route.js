import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      full_name,
      university,
      major,
      graduation_year,
      gpa,
      skills,
      interests,
      experience_level,
      preferred_location,
      bio
    } = body;

    // Create user first
    const user = await sql`
      INSERT INTO users (email, full_name, user_type)
      VALUES (${email}, ${full_name}, 'student')
      RETURNING *
    `;

    // Create student profile
    const profile = await sql`
      INSERT INTO student_profiles (
        user_id, university, major, graduation_year, gpa,
        skills, interests, experience_level, preferred_location, bio
      ) VALUES (
        ${user[0].id}, ${university}, ${major}, ${graduation_year}, ${gpa},
        ${skills || []}, ${interests || []}, ${experience_level}, ${preferred_location}, ${bio}
      ) RETURNING *
    `;

    return Response.json({ 
      user: user[0], 
      profile: profile[0] 
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return Response.json({ error: 'Failed to create student profile' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (user_id) {
      const student = await sql`
        SELECT 
          u.*,
          sp.university, sp.major, sp.graduation_year, sp.gpa,
          sp.skills, sp.interests, sp.experience_level, sp.preferred_location,
          sp.resume_url, sp.portfolio_url, sp.linkedin_url, sp.github_url, sp.bio
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE u.id = ${user_id} AND u.user_type = 'student'
      `;

      if (student.length === 0) {
        return Response.json({ error: 'Student not found' }, { status: 404 });
      }

      return Response.json({ student: student[0] });
    }

    // List all students
    const students = await sql`
      SELECT 
        u.*,
        sp.university, sp.major, sp.graduation_year, sp.gpa,
        sp.skills, sp.interests, sp.experience_level, sp.preferred_location
      FROM users u
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.user_type = 'student'
      ORDER BY u.created_at DESC
    `;

    return Response.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}