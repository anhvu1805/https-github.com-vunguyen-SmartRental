const Contract = require('../models/Contract');

exports.getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().populate('user').populate('room');
        res.json(contracts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.createContract = async (req, res) => {
    try {
        const newContract = new Contract(req.body);
        await newContract.save();
        res.status(201).json(newContract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};