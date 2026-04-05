const mongoose = require('mongoose');

const RoomServiceSchema = new mongoose.Schema({
    roomID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    serviceID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    }
}, { timestamps: true });

module.exports = mongoose.model('RoomService', RoomServiceSchema);