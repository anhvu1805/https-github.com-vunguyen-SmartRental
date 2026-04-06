const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const verifyToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        res.json({ message: 'Xóa dịch vụ thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;