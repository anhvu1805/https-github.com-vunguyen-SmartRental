const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Room = require('./src/models/Room');
const Service = require('./src/models/Service');

const seedData = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/SmartRental");
        await User.deleteMany({});
        await Room.deleteMany({});
        await Service.deleteMany({});

        const hashedPassword = await bcrypt.hash('123', 10);
        await User.create({ username: "admin", password: hashedPassword, fullName: "Admin", role: 'admin' });
        await Room.create([
            { roomNumber: "101", price: 2500000, status: "Available" },
            { roomNumber: "102", price: 3000000, status: "Occupied" }
        ]);
        await Service.create([
            { name: "Điện", price: 3500, unit: "kWh" },
            { name: "Nước", price: 15000, unit: "m3" }
        ]);

        console.log("✅ Seed Success");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
seedData();