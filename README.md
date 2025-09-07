# English Vocabulary Trainer for Finnish Students

A modern, mobile-optimized React web application designed to help Finnish students learn English vocabulary through interactive fill-in-the-blank exercises.

## Features

🇫🇮 **Finnish Interface** - All instructions and UI in Finnish for comfortable learning  
📱 **Mobile Optimized** - Perfect for Samsung A26 and similar Android phones  
🎯 **Fill-in-the-Blank Format** - Educational sentence completion exercises  
💡 **Hint System** - Optional English explanations with score penalties  
📊 **Progress Tracking** - Score, streak, and accuracy statistics  
🎮 **Game Mechanics** - Point system with streak bonuses for motivation  

## Game Logic

Students see:
1. **English sentence** with a blank: "Finland is _______ for its beautiful forests."
2. **Finnish translation**: "kuuluisa" 
3. **Word category**: adjective/noun/verb/phrase
4. **Optional hint**: English explanation of the word

Students must type the correct English word to complete the sentence.

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Playwright** for end-to-end testing
- **Mobile-first responsive design**
- **No external dependencies** for game logic

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wordtrainer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Testing

Run Playwright tests to verify functionality:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm run test
```

## Vocabulary Data

The vocabulary is stored in `src/gameTypes.ts` as `VOCABULARY_PAIRS`. Each entry includes:

- `english`: The target English word/phrase
- `finnish`: Finnish translation
- `contextSentence`: English sentence with blank to fill
- `contextClue`: Optional English explanation
- `category`: Word type (adjective, noun, verb, phrase)
- `difficultyLevel`: 1 (easy), 2 (medium), 3 (hard)

## Mobile Optimization

Specifically optimized for:
- Samsung A26 (360x640px viewport)
- Touch-friendly button sizes
- Compact layout that fits without scrolling
- Readable fonts and proper contrast

## Project Structure

```
src/
├── App.tsx              # Main game component
├── gameTypes.ts         # Type definitions and vocabulary data
├── main.tsx            # React app entry point
└── index.css           # Global styles

tests/
└── word-trainer.spec.ts # Playwright end-to-end tests
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if needed
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Designed for Finnish students learning English
- Built with modern React and TypeScript best practices
- Tested with Playwright for reliability
