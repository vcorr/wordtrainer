// Step 1: Core Data Structures & Types
// This step establishes the fundamental data structures for the word learning game,
// including TypeScript interfaces and a sample word dataset for testing

// Type definitions for Finnish-English vocabulary training
export interface VocabularyPair {
  english: string;                 // The English word/phrase to learn
  finnish: string;                 // Finnish translation
  difficultyLevel: 1 | 2 | 3;      // 1=easy, 2=medium, 3=hard  
  category: string;                // Word type: "adjective", "noun", "phrase", etc.
  hint?: string;                   // Optional hint in Finnish
  contextSentence: string;         // English sentence with blank to fill
  contextClue?: string;            // Additional context clue if needed
}

export interface RoundData {
  words: VocabularyPair[];         // Vocabulary pairs selected for current round
  currentWordIndex: number;        // Index of word being answered
  roundScore: number;              // Points earned this round
  roundStartTime: number;          // Timestamp when round started
}

export interface GameState {
  // Core scoring and progress
  currentScore: number;            // Total points accumulated
  streak: number;                  // Consecutive correct answers
  longestStreak: number;           // Best streak achieved this session
  
  // Learning progress tracking
  wordsLearned: string[];          // English words answered correctly at least once
  roundNumber: number;             // Current round number (starts at 1)
  incorrectWords: VocabularyPair[]; // Words missed this session for review
  
  // Current round state
  currentRound: RoundData | null;  // null when not in active round
  
  // Game flow control
  gamePhase: 'setup' | 'playing' | 'round-summary' | 'review' | 'game-over';
  
  // Hint system tracking
  hintsUsed: number;               // Total hints used this session
  hintPenalty: number;             // Score penalty for using hints
  
  // Performance metrics
  totalWordsAnswered: number;      // Total attempts made
  correctAnswers: number;          // Total correct answers
  averageTimePerWord: number;      // Response time tracking
}

// Finnish-English vocabulary pairs for test preparation (Fill-in-the-blank format)
export const VOCABULARY_PAIRS: VocabularyPair[] = [
  // From examples.txt + expanded vocabulary
  {
    english: "famous",
    finnish: "kuuluisa",
    difficultyLevel: 1,
    category: "adjective",
    contextSentence: "Finland is _______ for its beautiful forests.",
    contextClue: "Well-known, recognized by many people"
  },
  {
    english: "a rock",
    finnish: "kallio",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "There is a large _______ in the garden.",
    contextClue: "A hard natural substance, stone"
  },
  {
    english: "sacred",
    finnish: "pyhä",
    difficultyLevel: 2,
    category: "adjective",
    contextSentence: "The church is a _______ place.",
    contextClue: "Holy, connected with religion"
  },
  {
    english: "a continent",
    finnish: "maanosa",
    difficultyLevel: 2,
    category: "noun",
    contextSentence: "Europe is _______ with many countries.",
    contextClue: "A large land mass like Asia, Africa, etc."
  },
  {
    english: "by area",
    finnish: "pinta-alaltaan",
    difficultyLevel: 3,
    category: "phrase",
    contextSentence: "Russia is the largest country _______.",
    contextClue: "Measured by size or surface space"
  },
  {
    english: "a capital",
    finnish: "pääkaupunki",
    difficultyLevel: 2,
    category: "noun",
    contextSentence: "Helsinki is _______ of Finland.",
    contextClue: "The main city of a country"
  },
  // Additional common vocabulary for Finnish students
  {
    english: "beautiful",
    finnish: "kaunis",
    difficultyLevel: 1,
    category: "adjective",
    contextSentence: "The sunset was _______.",
    contextClue: "Very pretty, nice to look at"
  },
  {
    english: "important",
    finnish: "tärkeä",
    difficultyLevel: 1,
    category: "adjective",
    contextSentence: "Education is very _______.",
    contextClue: "Something that matters a lot"
  },
  {
    english: "difficult",
    finnish: "vaikea",
    difficultyLevel: 1,
    category: "adjective",
    contextSentence: "The math problem was _______.",
    contextClue: "Hard to do, not easy"
  },
  {
    english: "a forest",
    finnish: "metsä",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "We walked through the dark _______.",
    contextClue: "A large area with many trees"
  },
  {
    english: "a lake",
    finnish: "järvi",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "Finland has thousands of _______.",
    contextClue: "A large body of fresh water"
  },
  {
    english: "a student",
    finnish: "opiskelija",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "She is _______ at the university.",
    contextClue: "Someone who is learning at school"
  },
  {
    english: "to study",
    finnish: "opiskella",
    difficultyLevel: 1,
    category: "verb",
    contextSentence: "I need _______ for the exam.",
    contextClue: "To learn, to read books and practice"
  },
  {
    english: "a school",
    finnish: "koulu",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "The children go to _______ every day.",
    contextClue: "A place where children learn"
  },
  {
    english: "a family",
    finnish: "perhe",
    difficultyLevel: 1,
    category: "noun",
    contextSentence: "My _______ lives in Tampere.",
    contextClue: "Parents, children, relatives together"
  }
];

// Initial game state object - represents a fresh game start
export const INITIAL_GAME_STATE: GameState = {
  // Scoring and streaks
  currentScore: 0,
  streak: 0,
  longestStreak: 0,
  
  // Learning progress
  wordsLearned: [],
  roundNumber: 0,
  incorrectWords: [],
  
  // Round state
  currentRound: null,
  
  // Game flow
  gamePhase: 'setup',
  
  // Hints
  hintsUsed: 0,
  hintPenalty: 0,
  
  // Performance metrics
  totalWordsAnswered: 0,
  correctAnswers: 0,
  averageTimePerWord: 0
};
