const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);