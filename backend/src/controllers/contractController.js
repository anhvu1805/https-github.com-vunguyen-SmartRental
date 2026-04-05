const Contract = require('../models/Contract');
const Room = require('../models/Room');

exports.index = async (req, res) => {
    try {
        const contracts = await Contract.find().populate('roomID');
        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.store = async (req, res) => {
    try {
        const contract = await Contract.create(req.body);
        if (req.body.roomID) {
            await Room.findByIdAndUpdate(req.body.roomID, { status: 'Occupied' });
        }
        res.status(201).json(contract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.show = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).populate('roomID');
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        res.json(contract);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.returnRoom = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        if (contract.roomID) {
            await Room.findByIdAndUpdate(contract.roomID, { status: 'Available' });
        }
        await Contract.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trả phòng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        res.json({ message: 'Xóa hợp đồng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};