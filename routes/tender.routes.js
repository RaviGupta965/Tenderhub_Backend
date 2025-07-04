import express from "express";
import db from "../db/knex.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Create a tender
router.post("/create", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { title, description, category, budget, deadline, location } =
      req.body;
    console.log(req.body);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const [tender] = await db("tenders")
      .insert({
        user_id: userId,
        title,
        description,
        category,
        budget,
        deadline,
        location,
      })
      .returning("*");

    res.status(201).json(tender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create tender" });
  }
});

// Get all tenders
router.get("/", async (req, res) => {
  try {
    const tenders = await db("tenders")
      .join("users", "tenders.user_id", "users.id")
      .select(
        "tenders.id",
        "tenders.title",
        "tenders.description",
        "tenders.category",
        "tenders.budget",
        db.raw("TO_CHAR(tenders.deadline, 'YYYY-MM-DD') AS deadline"),
        "tenders.location",
        "users.company_name as company"
      )
      .orderBy("tenders.created_at", "desc");

    res.json(tenders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});


router.get('/latest', async (req, res) => {
  try {
    const tenders = await db("tenders")
      .join("users", "tenders.user_id", "users.id")
      .select(
        "tenders.id",
        "tenders.title",
        "tenders.description",
        "tenders.category",
        "tenders.budget",
        db.raw("TO_CHAR(tenders.deadline, 'YYYY-MM-DD') AS deadline"),
        "tenders.location",
        "tenders.status",
        "users.company_name as company"
      )
      .orderBy("tenders.created_at", "desc")
      .limit(4);

    res.json(tenders);
  } catch (err) {
    console.error("Error fetching latest tenders:", err);
    res.status(500).json({ error: "Failed to fetch latest tenders" });
  }
});
export default router;
