// Step 1: Core Data Structures & Types
// This step establishes the fundamental data structures for the word learning game,
// including TypeScript interfaces and a sample word dataset for testing

// Type definitions for Finnish-English vocabulary training
export interface VocabularyPair {
  english: string;                 // The English word/phrase to learn
  finnish: string;                 // Finnish translation
  difficultyLevel: 1 | 2 | 3;      // 1=easy, 2=medium, 3=hard  
  category: string;                // Word type: "adjective", "noun", "phrase", etc.
  contextSentence: string;         // English sentence with blank to fill
  // Note: hints are now generated dynamically using progressive letter system
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

// Vocabulary data is now stored in src/data/vocabulary.json
// This keeps interfaces separate from data for better maintainability

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
