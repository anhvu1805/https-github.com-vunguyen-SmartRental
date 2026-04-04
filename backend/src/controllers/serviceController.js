const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    const services = await Service.find();
    res.json(services);
};

exports.createService = async (req, res) => {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
};