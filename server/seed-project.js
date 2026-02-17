import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Organization from './src/models/Organization.js';
import User from './src/models/User.js';
import Project from './src/models/Project.js';
import Task from './src/models/Task.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus';

const seedForgeProject = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // 1. Get the first user and their organization
        const user = await User.findOne();
        if (!user) {
            console.error('❌ No user found. Please create an account first.');
            process.exit(1);
        }

        const org = await Organization.findOne({ "members.userId": user._id });
        if (!org) {
            console.error('❌ No organization found for user.');
            process.exit(1);
        }

        console.log(`👤 Found User: ${user.name}`);
        console.log(`🏢 Found Organization: ${org.name}`);

        // 2. Create the Project
        const projectData = {
            organizationId: org._id,
            name: "Forge Development",
            key: "FRGE",
            description: "Managing the development backlog and roadmap for the Forge platform itself.",
            leadId: user._id,
            members: [user._id],
            status: "active",
            startDate: new Date(),
        };

        let project = await Project.findOne({ key: "FRGE", organizationId: org._id });

        if (project) {
            console.log('⚠️ Project "Forge Development" already exists.');
        } else {
            project = await Project.create(projectData);
            org.projects.push(project._id);
            await org.save();
            console.log('✅ Created Project: Forge Development');
        }

        // 3. Create Tasks
        const tasks = [
            {
                title: "Rebrand Application to Forge",
                description: "Update all UI components, meta tags, and local storage keys from Nexus to Forge.",
                status: "done",
                priority: "critical",
                type: "story", // Changed from feature
                assignees: [user._id],
                dueDate: new Date(Date.now() - 86400000),
            },
            {
                title: "Implement Analytics Dashboard",
                description: "Create backend routes and frontend charts for velocity and heatmaps.",
                status: "done",
                priority: "high",
                type: "story", // Changed from feature
                assignees: [user._id],
                dueDate: new Date(),
            },
            {
                title: "Design System Update (Dark Mode)",
                description: "Apply Forge Dark theme with Coral accents across all pages.",
                status: "done",
                priority: "medium",
                type: "task", // Changed from design
                assignees: [user._id],
            },
            {
                title: "Operative Team Grid",
                description: "Refactor the team page to show roles and invite status clearly.",
                status: "done",
                priority: "medium",
                type: "story", // Changed from feature
                assignees: [user._id],
            },
            {
                title: "AI Insights Integration",
                description: "Integrate predictive analysis for task completion velocity.",
                status: "todo",
                priority: "high",
                type: "story", // Changed from feature
                assignees: [],
                dueDate: new Date(Date.now() + 86400000 * 7),
            },
            {
                title: "Mobile Optimization",
                description: "Ensure the dashboard is fully responsive on mobile devices.",
                status: "inprogress", // Fixed enum value for status
                priority: "medium",
                type: "bug",
                assignees: [user._id],
                dueDate: new Date(Date.now() + 86400000 * 3),
            }
        ];

        for (const t of tasks) {
            const exists = await Task.findOne({ title: t.title, projectId: project._id });
            if (!exists) {
                await Task.create({
                    ...t,
                    projectId: project._id,
                    createdBy: user._id
                });
                console.log(`   - Added Task: ${t.title}`);
            }
        }

        console.log('🚀 Forge Development Project Initialized Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding project:', error);
        process.exit(1);
    }
};

seedForgeProject();
