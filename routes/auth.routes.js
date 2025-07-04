import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/knex.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    companyName,
    email,
    password,
    contactPerson,
    industry,
    description,
    location,
    website
  } = req.body;
  try {
    if (!companyName || !email || !password || !contactPerson || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db('users')
      .insert({
        company_name: companyName,
        email,
        password: hashedPassword,
        contact_person: contactPerson,
        industry,
        description,
        location,
        website
      })
      .returning(['id', 'email', 'company_name']);

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});





// Login route

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        company: user.company_name
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});
export default router;