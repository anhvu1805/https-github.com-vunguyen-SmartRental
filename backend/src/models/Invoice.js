const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    month: Number,
    year: Number,
    totalAmount: Number,
    isPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);