const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    customerName: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    deposit: Number
});

module.exports = mongoose.model('Contract', ContractSchema);