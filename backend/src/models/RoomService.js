const mongoose = require('mongoose');
const RoomServiceSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
});
module.exports = mongoose.model('RoomService', RoomServiceSchema);