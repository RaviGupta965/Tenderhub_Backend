import { pool } from "../db/index.js";

export const saveProfile = async (req, res) => {
  const {
    companyName,
    industry,
    description,
    location,
    website,
    employees,
    services,
  } = req.body;
  const email=req.user.email;
  try {
    const result = await pool.query(
      `INSERT INTO companies (
        company_name, email, industry, description,
        location, website, employees, services
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (email) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        industry = EXCLUDED.industry,
        description = EXCLUDED.description,
        location = EXCLUDED.location,
        website = EXCLUDED.website,
        employees = EXCLUDED.employees,
        services = EXCLUDED.services
      RETURNING *`,
      [
        companyName,
        email,
        industry,
        description,
        location,
        website,
        employees,
        services,
      ]
    );

    res.status(200).json({ message: "Profile saved", company: result.rows[0] });
  } catch (err) {
    console.error("Error saving profile", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
};