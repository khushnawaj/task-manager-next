import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log("No users found.");
            process.exit(1);
        }

        user.role = "admin";
        await user.save();

        console.log(`Successfully promoted user '${user.name}' (${user.email}) to ADMIN.`);
        process.exit(0);
    } catch (error) {
        console.error("Error promoting user:", error);
        process.exit(1);
    }
};

makeAdmin();
