# AI-Powered Multilingual Handwriting Practice

An interactive web application for learning and practicing handwriting in multiple languages with real-time AI feedback.

## 🌟 Features

- **Multiple Language Support**
  - English (Print & Cursive)
  - Telugu (తెలుగు)
  - Hindi (हिंदी)
  - Japanese (日本語)
    - Hiragana
    - Katakana
    - Basic Kanji

- **Real-time AI Analysis**
  - Stroke order verification
  - Character formation feedback
  - Quality assessment
  - Immediate suggestions for improvement

- **Progressive Learning**
  - Beginner to advanced levels
  - Language-specific guidance
  - Customized feedback based on proficiency
  - Structured learning path

- **Interactive Drawing Board**
  - Pressure-sensitive drawing
  - Stroke history
  - Undo/Redo functionality
  - Clear canvas option

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- An API key for Claude or Google Gemini

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/handwriting-practice.git
cd handwriting-practice
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:

```env
REACT_APP_AI_PROVIDER=claude
REACT_APP_CLAUDE_API_KEY=your_claude_api_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server

```bash
npm start
```

### Production Build

```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend Framework**
  - React.js
  - Tailwind CSS
  - shadcn/ui components

- **AI Integration**
  - Anthropic's Claude API
  - Google's Gemini API

- **Drawing Features**
  - HTML5 Canvas
  - Touch events support
  - Pressure sensitivity

## 📁 Project Structure

```plaintext
handwriting-practice/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/           # UI components
│   │   ├── DrawingBoard.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── LanguageGuidance.jsx
│   │   ├── RealTimeFeedback.jsx
│   │   └── App.jsx
│   ├── services/         # AI and analysis services
│   ├── constants/        # Language data and constants
│   ├── styles/           # Global styles
│   └── utils/           # Utility functions
├── .env
└── README.md
```

## 🔧 Configuration

### AI Provider Configuration
You can configure the AI provider in the `.env` file:
```env
REACT_APP_AI_PROVIDER=claude  # or 'gemini'
```

### Language Settings
Language configurations are stored in `src/constants/languageData.js`:

- Character sets
- Learning levels
- Writing guidelines
- Script-specific features

## 📱 Supported Devices

- Desktop browsers (Chrome, Firefox, Safari)
- Tablets with stylus support
- Touch-screen devices
- Drawing tablets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m 'Add some AmazingFeature'
```

4. Push to the branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

## 📝 Usage Guide

1. **Select Language and Level**
   - Choose your target language
   - Select appropriate difficulty level
   - Navigate through characters

2. **Practice Writing**
   - Follow stroke order guidance
   - Draw characters on the canvas
   - Receive real-time feedback

3. **Review and Improve**
   - Check accuracy score
   - Review suggestions
   - Practice areas needing improvement

## ⚙️ Advanced Configuration

### Tailwind Configuration
Modify `tailwind.config.js` for custom styling:
```javascript
module.exports = {
  // Custom theme configuration
  theme: {
    extend: {
      // Add custom colors, fonts, etc.
    }
  }
}
```

### AI Settings
Adjust AI analysis parameters in `src/config/aiConfig.js`:

```javascript
export const AI_ANALYSIS_CONFIG = {
  strokeAnalysis: {
    minStrokeLength: 10,
    samplingRate: 5,
    // ...
  }
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Google's Gemini](https://deepmind.google/technologies/gemini/) for AI analysis
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
