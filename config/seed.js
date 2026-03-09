const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedUsers = async () => {
    try {

        // hash password for all default users
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // DEFAULT USERS
        const defaultUsers = [
            {
                name: "System Director",
                email: "director@karibu.com",
                password: hashedPassword,
                role: "Director",
                branch: ""
            },
            {
                name: "Matugga Manager",
                email: "manager.matugga@karibu.com",
                password: hashedPassword,
                role: "Manager",
                branch: "Matugga"
            },
            {
                name: "Maganjo Manager",
                email: "manager.maganjo@karibu.com",
                password: hashedPassword,
                role: "Manager",
                branch: "Maganjo"
            }
        ];

        for (let userData of defaultUsers) {

            const exists = await User.findOne({ email: userData.email });

            if (!exists) {
                const user = new User(userData);
                await user.save();
                console.log(`${userData.role} created: ${userData.email}`);
            } else {
                console.log(`${userData.email} already exists`);
            }

        }

        console.log("Seeding completed");

    } catch (error) {
        console.error("Seeding error:", error);
    }
};

module.exports = seedUsers;