const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    invoiceID: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['cash', 'transfer'], required: true },
    date: { type: Date, default: Date.now },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String
});

module.exports = mongoose.model('Payment', PaymentSchema);