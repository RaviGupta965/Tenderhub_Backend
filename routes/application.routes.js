import express from "express";
import jwt from "jsonwebtoken";
import db from "../db/knex.js";

const router = express.Router();

// Create Tender Application
router.post("/:tenderId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { tenderId } = req.params;
    const { proposal, quote, applicationDeadline } = req.body;

    if (!proposal || !quote || !applicationDeadline) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [application] = await db("tender_applications")
      .insert({
        user_id: userId,
        tender_id: tenderId,
        proposal,
        quote,
        application_deadline: applicationDeadline,
      })
      .returning("*");

    res.status(201).json(application);
  } catch (err) {
    console.error("Application Error:", err);
    res.status(500).json({ error: "Failed to apply for tender" });
  }
});

// Deleteing the tender
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete applications related to this tender
    // const deleted=await db("applications")
    //   .where({ tender_id: id })
    //   .del();

    // Then delete the tender itself
    const deleted = await db("tenders")
      .where({ id })
      .del();

    if (deleted === 0) {
      return res.status(404).json({ error: "Tender not found" });
    }

    res.json({ message: "Tender and related applications deleted successfully" });
  } catch (err) {
    console.error("Error deleting tender:", err);
    res.status(500).json({ error: "Failed to delete tender" });
  }
});


// get application for a tender
router.get("/tender/:tenderId", async (req, res) => {
  const { tenderId } = req.params;
  try {
    const apps = await db("tender_applications").where({ tender_id: tenderId });
    res.json(apps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});


// Get tenders by any user's ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const tenders = await db("tenders")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    res.json(tenders);
  } catch (err) {
    console.error("Error fetching tenders for user:", err);
    res.status(500).json({ error: "Failed to fetch tenders for user" });
  }
});
export default router;
