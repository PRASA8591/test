// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer for handling temporary video uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Video Schema for MongoDB
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    filePath: String,
    scheduledTime: Date,
    status: { type: String, default: 'Pending' } // Pending, Uploading, Published
});
const Video = mongoose.model('Video', videoSchema);

// API Route: Handle form submission from the frontend
app.post('/api/schedule', upload.single('videoFile'), async (req, res) => {
    try {
        const { summary, scheduledTime } = req.body;
        
        // TODO: Call Gemini/OpenAI here to generate Title, Description, and Tags based on 'summary'
        const generatedTitle = "Generated Title - " + summary.substring(0, 10);
        const generatedDescription = "Auto-generated description...";
        const generatedTags = ["PRASA", "Tech", "Auto"];

        // Save to MongoDB
        const newVideo = new Video({
            title: generatedTitle,
            description: generatedDescription,
            tags: generatedTags,
            filePath: req.file.path,
            scheduledTime: new Date(scheduledTime)
        });

        await newVideo.save();
        res.status(200).json({ message: 'Video scheduled successfully!', data: newVideo });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// The Scheduler: Runs every minute to check for pending videos
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const pendingVideos = await Video.find({ 
        scheduledTime: { $lte: now }, 
        status: 'Pending' 
    });

    for (let video of pendingVideos) {
        console.log(`Starting upload for: ${video.title}`);
        video.status = 'Uploading';
        await video.save();

        // TODO: Execute YouTube Data API v3 upload here using video.filePath
        
        video.status = 'Published';
        await video.save();
        console.log(`Successfully published: ${video.title}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PRASA Backend running on http://localhost:${PORT}`);
});