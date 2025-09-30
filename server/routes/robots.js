const express = require('express');
const router = express.Router();
const Robot = require('../models/Robot');
const authJwt = require('../middleware/authJwt');

// GET /api/robots?page=1&limit=20&status=active&search=alpha
router.get('/', authJwt, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { type: { $regex: search, $options: 'i' } }];
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Robot.find(filter).skip(skip).limit(Number(limit)).sort({ updatedAt: -1 }),
            Robot.countDocuments(filter)
        ]);
        res.json({ data, page: Number(page), total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/robots/:id/config
router.put('/:id/config', authJwt, async (req, res) => {
    try {
        const { id } = req.params;
        const configUpdate = req.body;
        const robot = await Robot.findByIdAndUpdate(id, { $set: { config: configUpdate } }, { new: true });
        if (!robot) return res.status(404).json({ message: 'Robot not found' });
        res.json({ data: robot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
