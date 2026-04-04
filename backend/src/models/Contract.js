const mongoose = require('mongoose');
const ContractSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    deposit: { type: Number }
});
module.exports = mongoose.model('Contract', ContractSchema);