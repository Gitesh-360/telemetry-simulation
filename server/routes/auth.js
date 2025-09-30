const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = process.env.JWT_SECRET || 'changeme';
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

// For simplicity: a single hard-coded demo user. In production, use a users collection.
const demoUser = {
    id: 'user-1',
    email: 'demo@example.com',
    // password: "password123" hashed
    passwordHash: bcrypt.hashSync('password123', 8),
    roles: ['validator']
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    if (email !== demoUser.email) return res.status(401).json({ message: 'Invalid credentials' });
    const match = bcrypt.compareSync(password, demoUser.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: demoUser.id, email: demoUser.email, roles: demoUser.roles }, secret, { expiresIn });
    res.json({ token });
});

module.exports = router;
