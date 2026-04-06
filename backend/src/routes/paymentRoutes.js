const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const verifyToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find().populate('invoiceID').populate('userID', 'username fullName');
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:id', verifyToken, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('invoiceID').populate('userID', 'username fullName');
        if (!payment) return res.status(404).json({ error: 'Không tìm thấy thanh toán' });
        // Allow if admin or own payment
        if (req.user.role !== 'admin' && req.user.id !== payment.userID.toString()) {
            return res.status(403).json({ error: 'Không có quyền xem thanh toán này' });
        }
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/payments - Create new payment
router.post('/', verifyToken, async (req, res) => {
    try {
        const { invoiceID, amount, method, notes } = req.body;
        if (!invoiceID || !amount || !method) {
            return res.status(400).json({ error: 'invoiceID, amount, method là bắt buộc' });
        }
        if (!['cash', 'transfer'].includes(method)) {
            return res.status(400).json({ error: 'Method phải là cash hoặc transfer' });
        }
        const newPayment = new Payment({
            invoiceID,
            amount,
            method,
            userID: req.user.id,
            notes
        });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/:id', verifyToken, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Không tìm thấy thanh toán' });
        if (req.user.role !== 'admin' && req.user.id !== payment.userID.toString()) {
            return res.status(403).json({ error: 'Không có quyền cập nhật thanh toán này' });
        }
        const { amount, method, notes } = req.body;
        if (method && !['cash', 'transfer'].includes(method)) {
            return res.status(400).json({ error: 'Method phải là cash hoặc transfer' });
        }
        payment.amount = amount || payment.amount;
        payment.method = method || payment.method;
        payment.notes = notes !== undefined ? notes : payment.notes;
        await payment.save();
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Không tìm thấy thanh toán' });
        if (req.user.role !== 'admin' && req.user.id !== payment.userID.toString()) {
            return res.status(403).json({ error: 'Không có quyền xóa thanh toán này' });
        }
        await Payment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Thanh toán đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;