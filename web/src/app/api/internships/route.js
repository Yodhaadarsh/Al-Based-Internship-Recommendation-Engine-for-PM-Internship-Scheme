import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const skills = searchParams.get('skills');
    const remote = searchParams.get('remote');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT 
        i.*,
        c.name as company_name,
        c.industry,
        c.logo_url,
        c.location as company_location
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.is_active = true
      AND i.application_deadline >= CURRENT_DATE
    `;
    
    const params = [];
    let paramCount = 0;

    if (location) {
      paramCount++;
      query += ` AND (LOWER(i.location) LIKE LOWER($${paramCount}) OR LOWER(c.location) LIKE LOWER($${paramCount}))`;
      params.push(`%${location}%`);
    }

    if (skills) {
      paramCount++;
      query += ` AND (i.preferred_skills && $${paramCount} OR i.requirements && $${paramCount})`;
      params.push(skills.split(','));
    }

    if (remote === 'true') {
      query += ` AND i.is_remote = true`;
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const internships = await sql(query, params);

    return Response.json({ internships });
  } catch (error) {
    console.error('Error fetching internships:', error);
    return Response.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company_id,
      posted_by,
      title,
      description,
      requirements,
      preferred_skills,
      location,
      duration_months,
      stipend_amount,
      stipend_currency,
      application_deadline,
      start_date,
      is_remote
    } = body;

    const internship = await sql`
      INSERT INTO internships (
        company_id, posted_by, title, description, requirements, 
        preferred_skills, location, duration_months, stipend_amount, 
        stipend_currency, application_deadline, start_date, is_remote
      ) VALUES (
        ${company_id}, ${posted_by}, ${title}, ${description}, ${requirements},
        ${preferred_skills}, ${location}, ${duration_months}, ${stipend_amount},
        ${stipend_currency || 'USD'}, ${application_deadline}, ${start_date}, ${is_remote || false}
      ) RETURNING *
    `;

    return Response.json({ internship: internship[0] });
  } catch (error) {
    console.error('Error creating internship:', error);
    return Response.json({ error: 'Failed to create internship' }, { status: 500 });
  }
}