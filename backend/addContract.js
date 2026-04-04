const mongoose = require('mongoose');
const Contract = require('./models/Contract');
const User = require('./models/User');
const Room = require('./models/Room');

async function add() {
    await mongoose.connect("mongodb://localhost:27017/SmartRental");
    const u = await User.findOne();
    const r = await Room.findOne();
    if (u && r) {
        await Contract.create({ user: u._id, room: r._id, deposit: 500000 });
        console.log("✅ Đã tạo hợp đồng mẫu!");
    }
    process.exit();
}
add();