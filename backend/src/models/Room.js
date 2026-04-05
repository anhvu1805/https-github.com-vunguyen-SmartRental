const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' },
    areaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
});

module.exports = mongoose.model('Room', RoomSchema);