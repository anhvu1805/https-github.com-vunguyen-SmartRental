const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const Room = require('../models/Room');
const verifyToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', async (req, res) => {
    try {
        const contracts = await Contract.find().populate('roomID');
        res.json(contracts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).populate('roomID');
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        res.json(contract);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const contract = await Contract.create(req.body);
        if (req.body.roomID) await Room.findByIdAndUpdate(req.body.roomID, { status: 'Occupied' });
        res.status(201).json(contract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const existingContract = await Contract.findById(req.params.id);
        if (!existingContract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });

        const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.roomID && String(req.body.roomID) !== String(existingContract.roomID)) {
            await Room.findByIdAndUpdate(existingContract.roomID, { status: 'Available' });
            await Room.findByIdAndUpdate(req.body.roomID, { status: 'Occupied' });
        }
        res.json(updatedContract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id/return', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        if (contract.roomID) await Room.findByIdAndUpdate(contract.roomID, { status: 'Available' });
        await Contract.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trả phòng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        res.json({ message: 'Xóa hợp đồng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;