const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const { randomUUID } = require('crypto');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'remotehq_super_secret_key', {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  try {
    const { email, name, password, role = 'Client' } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    try {
      const { rows: existingRows } = await db.query('SELECT id FROM "User" WHERE email = $1', [email]);
      if (existingRows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = randomUUID();
      const { rows: createdRows } = await db.query(
        'INSERT INTO "User" (id, email, name, password, role, "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email, name, role',
        [id, email, name, hashedPassword, role]
      );
      const user = createdRows[0];

      const token = generateToken(user);

      res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(503).json({ message: 'Database connection failed. Please ensure PostgreSQL is running.' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let user;
    try {
      const { rows } = await db.query('SELECT id, email, name, password, role FROM "User" WHERE email = $1', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      user = rows[0];
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(503).json({ message: 'Database connection failed. Please ensure PostgreSQL is running.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    let user;
    try {
      const { rows } = await db.query('SELECT id, email, name, role, "createdAt" FROM "User" WHERE id = $1', [req.user.id]);
      user = rows[0];
    } catch (dbError) {
      return res.status(503).json({ message: 'Database connection failed.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
