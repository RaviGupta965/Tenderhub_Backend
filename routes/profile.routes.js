import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/knex.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();


// routes/auth.js or directly in index.js
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db("users").where({ email : decoded.email}).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      email: user.email,
      company: user.company_name,
      industry: user.industry,
      description: user.description,
      location: user.location,
      website: user.website,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.patch("/edit-profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const {
      company,
      industry,
      description,
      location,
      website,
    } = req.body;
    await db("users")
      .where({ email: email })
      .update({
        company_name: company,
        industry,
        description,
        location,
        website,
        created_at: new Date(), // optional if you track timestamps
      });

    const updatedUser = await db("users").where({ email: email }).first();

    res.json({
      id: updatedUser.id,
      company: updatedUser.company_name,
      industry: updatedUser.industry,
      description: updatedUser.description,
      location: updatedUser.location,
      website: updatedUser.website,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
export default router;