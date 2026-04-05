const Service = require('../models/Service');

exports.index = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.store = async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        res.json({ message: 'Xóa dịch vụ thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};