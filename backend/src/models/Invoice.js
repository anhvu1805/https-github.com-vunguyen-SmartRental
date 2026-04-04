const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    month: { type: Number },
    year: { type: Number },
    totalAmount: { type: Number },
    isPaid: { type: Boolean, default: false }
});
module.exports = mongoose.model('Invoice', InvoiceSchema);