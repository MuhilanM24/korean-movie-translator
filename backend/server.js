const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/temp';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }
});

function extractAudio(videoPath, audioPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .output(audioPath)
            .audioCodec('libmp3lame')
            .audioFrequency(16000)
            .on('end', () => resolve(audioPath))
            .on('error', (err) => reject(err))
            .run();
    });
}

async function translateText(text, sourceLang = 'ko', targetLang = 'en') {
    try {
        const response = await axios.get(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
        );
        if (response.data.responseStatus === 200) {
            return response.data.responseData.translatedText;
        }
        return `[Translated: ${text}]`;
    } catch (error) {
        console.log('Translation API error:', error.message);
        return `[Mock Translation: ${text}]`;
    }
}

app.post('/api/translate-korean-to-english', upload.single('video'), async (req, res) => {
    let tempAudioPath = null;
    let outputVideoPath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const videoPath = req.file.path;
        const videoId = uuidv4();
        const outputDir = 'uploads/output';

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Extract audio
        tempAudioPath = `uploads/temp/${videoId}_audio.mp3`;
        console.log('Extracting audio...');
        await extractAudio(videoPath, tempAudioPath);

        // Mock translation
        const koreanText = 'Korean dialogue detected';
        const englishText = await translateText(koreanText);

        // Create output video
        outputVideoPath = `uploads/output/${videoId}_translated.mp4`;
        console.log('Creating output video...');
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .output(outputVideoPath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // Cleanup
        if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

        res.json({
            success: true,
            videoUrl: `http://localhost:${PORT}/output/${videoId}_translated.mp4`,
            translation: { korean: koreanText, english: englishText }
        });
    } catch (error) {
        console.error('Translation error:', error);
        if (tempAudioPath && fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
        if (outputVideoPath && fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message || 'Translation failed' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('Make sure FFmpeg is installed on your system!');
});
