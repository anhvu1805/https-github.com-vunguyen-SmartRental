const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);