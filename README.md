# Korean Movie Translator to English

Convert Korean movies and videos to English-dubbed versions using AI translation and speech synthesis.

## Features
- Upload Korean movies (MP4, MKV, WebM)
- Automatic speech recognition for Korean audio
- AI-powered Korean to English translation
- Text-to-speech synthesis for English audio
- Real-time progress tracking
- Download translated video

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- FormData API for file uploads
- XMLHttpRequest for async requests

### Backend
- Node.js
- Express.js
- FFmpeg (video processing)
- Multer (file uploads)
- MyMemory API (translation)

## Installation

### Frontend
1. Open `index.html` in a web browser
2. Or serve it with a local server:
```bash
python -m http.server 8000
```

### Backend
1. Install Node.js (v14+)
2. Clone this repository
3. Install dependencies:
```bash
cd backend
npm install
```

4. Install FFmpeg:
   - Windows: `choco install ffmpeg`
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`

5. Start the server:
```bash
npm start
```
Server will run on `http://localhost:5000`

## Usage

1. Start the backend server
2. Open the frontend in your browser
3. Upload a Korean movie file
4. Click "Translate Korean Audio to English"
5. Wait for processing to complete
6. Download and play the translated video

## API Endpoints

### POST /api/translate-korean-to-english
- **Body**: FormData with `video` file
- **Response**: 
```json
{
  "success": true,
  "videoUrl": "url_to_translated_video",
  "translation": {
    "korean": "Original Korean text",
    "english": "Translated English text"
  }
}
```

## Project Structure
```
korean-movie-translator/
├─ index.html                 # Frontend HTML
├─ backend/
│  ├─ server.js              # Express server
│  ├─ package.json           # Dependencies
│  ├─ uploads/               # Temp & output videos
│  └─ .env                   # Environment variables
└─ README.md
```

## Configuration

Create a `.env` file in the backend folder:
```
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=500000000
```

## Supported APIs

### Translation
- MyMemory (free, no key required)
- Google Translate API (requires API key)
- AWS Translate (requires AWS credentials)

### Speech Recognition
- Google Cloud Speech-to-Text
- AWS Transcribe
- AssemblyAI

### Text-to-Speech
- Google Cloud Text-to-Speech
- AWS Polly
- ElevenLabs

## Limitations

- File size limit: 500MB
- Processing time depends on video length
- Internet connection required for API calls
- Accuracy depends on audio quality and Korean speech clarity

## Future Enhancements

- [ ] Support for more languages
- [ ] Batch processing
- [ ] Custom voice selection
- [ ] Subtitle generation
- [ ] Video preview
- [ ] Cloud storage integration
- [ ] User authentication
- [ ] Progress notifications via WebSocket

## License

MIT License - feel free to use this for personal or commercial projects

## Author

Muhilan M24

## Support

For issues and feature requests, please create an issue on GitHub.
