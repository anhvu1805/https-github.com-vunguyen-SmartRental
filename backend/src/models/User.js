const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);