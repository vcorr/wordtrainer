import { useState } from 'react'
import { INITIAL_GAME_STATE, GameState, VocabularyPair } from './gameTypes'
import vocabularyData from './data/vocabulary.json'

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)

  // Cast imported JSON data to the correct TypeScript type
  const VOCABULARY_PAIRS = vocabularyData as VocabularyPair[]
  const currentPair = VOCABULARY_PAIRS[currentWordIndex]

  // Generate progressive letter hint based on word length
  const generateLetterHint = (word: string): string => {
    const length = word.length
    if (length <= 4) {
      return `${word.charAt(0).toUpperCase()}${'_'.repeat(length - 1)}`
    } else if (length <= 6) {
      return `${word.substring(0, 2).toUpperCase()}${'_'.repeat(length - 2)}`
    } else {
      return `${word.substring(0, 3).toUpperCase()}${'_'.repeat(length - 3)}`
    }
  }

  const handleSubmitAnswer = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === currentPair.english.toLowerCase()
    
    // Auto-hide hint after submitting to save mobile space
    setShowHint(false)
    
    if (isCorrect) {
      setFeedback('✅ Correct! Well done!')
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + 10,
        streak: prev.streak + 1,
        correctAnswers: prev.correctAnswers + 1,
        totalWordsAnswered: prev.totalWordsAnswered + 1,
        wordsLearned: [...prev.wordsLearned, currentPair.english]
      }))
    } else {
      setFeedback(`❌ Incorrect. The correct answer was: ${currentPair.english}`)
      setGameState(prev => ({
        ...prev,
        streak: 0,
        totalWordsAnswered: prev.totalWordsAnswered + 1,
        incorrectWords: [...prev.incorrectWords, currentPair]
      }))
    }
  }

  const nextWord = () => {
    if (currentWordIndex < VOCABULARY_PAIRS.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
      setUserAnswer('')
      setFeedback('')
      setShowHint(false)
    }
  }

  const resetGame = () => {
    setGameState(INITIAL_GAME_STATE)
    setCurrentWordIndex(0)
    setUserAnswer('')
    setFeedback('')
    setShowHint(false)
  }

  const toggleHint = () => {
    setShowHint(!showHint)
    if (!showHint) {
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        hintPenalty: prev.hintPenalty + 5
      }))
    }
  }

  return (
    <div style={{ 
      padding: window.innerWidth <= 480 ? '1rem' : '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1.5rem' }}>
        <h1 style={{ 
          fontSize: window.innerWidth <= 480 ? '1.6rem' : '3.2rem',
          marginBottom: window.innerWidth <= 480 ? '0.4rem' : '1.2rem',
          color: 'var(--neutral-800)',
          fontWeight: '800',
          margin: '0 0 0.8rem 0',
          background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-hover) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>Word Trainer</h1>
        <div style={{ 
          display: 'flex', 
          gap: window.innerWidth <= 480 ? '0.4rem' : '2rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginTop: window.innerWidth <= 480 ? '0.5rem' : '1rem',
          fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem'
        }}>
          <span data-testid="score" style={{ 
            background: 'var(--primary-blue-light)', 
            padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
            borderRadius: '16px',
            fontWeight: '600',
            color: 'var(--primary-blue)',
            boxShadow: '0 2px 4px rgba(0, 102, 204, 0.1)',
            border: '1px solid rgba(0, 102, 204, 0.2)'
          }}>Score: {gameState.currentScore}</span>
          <span data-testid="streak" style={{ 
            background: gameState.streak > 0 ? 'var(--warning-orange-light)' : 'var(--neutral-100)', 
            padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
            borderRadius: '16px',
            fontWeight: '600',
            color: gameState.streak > 0 ? 'var(--warning-orange)' : 'var(--neutral-600)',
            boxShadow: gameState.streak > 0 ? '0 2px 4px rgba(245, 158, 11, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
            border: gameState.streak > 0 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--neutral-200)'
          }}>Streak: {gameState.streak}</span>
          <span data-testid="progress" style={{ 
            background: 'var(--neutral-100)', 
            padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
            borderRadius: '16px',
            fontWeight: '600',
            color: 'var(--neutral-600)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--neutral-200)'
          }}>Word {currentWordIndex + 1} / {VOCABULARY_PAIRS.length}</span>
        </div>
      </header>

      <main style={{ textAlign: 'center' }}>
        <div style={{ 
          background: 'white', 
          padding: window.innerWidth <= 480 ? '0.8rem' : '2rem', 
          borderRadius: '16px', 
          marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid var(--neutral-200)'
        }}>
          <h2 style={{ 
            fontSize: window.innerWidth <= 480 ? '1rem' : '1.6rem',
            marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1.2rem',
            color: 'var(--neutral-800)',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>📝 Complete the sentence:</h2>
          
          <div data-testid="context-sentence" style={{ 
            fontSize: window.innerWidth <= 480 ? '1.1rem' : '1.7rem', 
            margin: window.innerWidth <= 480 ? '0.6rem 0' : '1.5rem 0',
            lineHeight: '1.5',
            color: 'var(--neutral-800)',
            fontWeight: '500',
            background: 'var(--neutral-50)',
            padding: window.innerWidth <= 480 ? '0.7rem' : '1.2rem',
            borderRadius: '16px',
            border: '2px solid var(--neutral-200)',
            fontStyle: 'italic'
          }}>
            "{currentPair.contextSentence}"
          </div>
          
          <div style={{ 
            marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.2rem',
            background: 'var(--primary-blue-light)',
            padding: window.innerWidth <= 480 ? '0.6rem' : '1rem',
            borderRadius: '16px',
            border: '2px solid rgba(0, 102, 204, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ 
                fontSize: window.innerWidth <= 480 ? '1.4rem' : '1.8rem', 
                color: 'var(--primary-blue)',
                fontWeight: '700'
              }}>
                🇫🇮 {currentPair.finnish}
              </span>
              <span style={{ 
                background: 'white', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '10px',
                fontSize: '0.7rem',
                color: 'var(--primary-blue)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {currentPair.category}
              </span>
            </div>
          </div>
          
          {showHint && (
            <div data-testid="hint" style={{ 
              marginTop: window.innerWidth <= 480 ? '0.5rem' : '1rem', 
              marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1rem',
              color: 'var(--warning-orange)',
              background: 'var(--warning-orange-light)',
              padding: window.innerWidth <= 480 ? '0.6rem' : '1rem',
              borderRadius: '16px',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              <strong>💡 Letter Hint:</strong>
              <div style={{
                fontSize: window.innerWidth <= 480 ? '1.4rem' : '2.2rem',
                fontFamily: 'monospace',
                fontWeight: '700',
                marginTop: window.innerWidth <= 480 ? '0.3rem' : '0.5rem',
                letterSpacing: '0.2em',
                color: 'var(--primary-blue)'
              }}>
                {generateLetterHint(currentPair.english)}
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          marginBottom: window.innerWidth <= 480 ? '0.6rem' : '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <input
            data-testid="answer-input"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer in English..."
            style={{
              padding: window.innerWidth <= 480 ? '1rem' : '1.2rem',
              fontSize: window.innerWidth <= 480 ? '1.1rem' : '1.2rem',
              width: window.innerWidth <= 480 ? '100%' : '350px',
              maxWidth: '100%',
              border: '2px solid var(--neutral-300)',
              borderRadius: '16px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
              textAlign: 'center',
              background: 'white',
              color: 'var(--neutral-800)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            onFocus={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--primary-blue)'
              ;(e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'
            }}
            onBlur={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--neutral-300)'
              ;(e.target as HTMLElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
          <button
            data-testid="submit-btn"
            onClick={handleSubmitAnswer}
            style={{
              padding: window.innerWidth <= 480 ? '1rem 2rem' : '1.2rem 2.5rem',
              fontSize: window.innerWidth <= 480 ? '1.1rem' : '1.2rem',
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              minWidth: window.innerWidth <= 480 ? '100%' : 'auto',
              boxShadow: '0 4px 8px rgba(0, 102, 204, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--primary-blue-hover)'
              ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 6px 12px rgba(0, 102, 204, 0.4)'
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--primary-blue)'
              ;(e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(0, 102, 204, 0.3)'
            }}
          >
            ✅ Submit
          </button>
        </div>

        {feedback && (
          <div data-testid="feedback" style={{ 
            fontSize: window.innerWidth <= 480 ? '1rem' : '1.4rem', 
            fontWeight: '700',
            marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.5rem',
            padding: window.innerWidth <= 480 ? '0.6rem' : '1rem',
            borderRadius: '16px',
            background: feedback.includes('Correct') 
              ? 'var(--success-green-light)'
              : 'var(--error-red-light)',
            border: feedback.includes('Correct') 
              ? '2px solid var(--success-green)'
              : '2px solid var(--error-red)',
            color: feedback.includes('Correct') ? 'var(--success-green)' : 'var(--error-red)'
          }}>
            {feedback}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: window.innerWidth <= 480 ? '0.4rem' : '1rem', 
          justifyContent: 'center', 
          marginTop: window.innerWidth <= 480 ? '0.4rem' : '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            data-testid="hint-btn"
            onClick={toggleHint}
            style={{
              padding: window.innerWidth <= 480 ? '0.5rem 0.7rem' : '1rem 1.5rem',
              backgroundColor: showHint ? 'var(--warning-orange)' : 'var(--neutral-600)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
              boxShadow: showHint ? '0 3px 6px rgba(245, 158, 11, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              minWidth: window.innerWidth <= 480 ? '45%' : 'auto'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.target as HTMLElement).style.boxShadow = showHint 
                ? '0 4px 8px rgba(245, 158, 11, 0.4)' 
                : '0 3px 6px rgba(0,0,0,0.2)'
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = showHint 
                ? '0 3px 6px rgba(245, 158, 11, 0.3)' 
                : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {showHint ? '🙈' : '💡'}
          </button>
          
          {feedback && (
            <button
              data-testid="next-btn"
              onClick={nextWord}
              disabled={currentWordIndex >= VOCABULARY_PAIRS.length - 1}
              style={{
                padding: window.innerWidth <= 480 ? '0.5rem 0.7rem' : '1rem 1.5rem',
                backgroundColor: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'var(--neutral-300)' : 'var(--success-green)',
                color: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'var(--neutral-600)' : 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
                fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
                boxShadow: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'none' : '0 3px 6px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
                minWidth: window.innerWidth <= 480 ? 'auto' : 'auto',
              width: window.innerWidth <= 480 ? '30%' : 'auto',
                opacity: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (currentWordIndex < VOCABULARY_PAIRS.length - 1) {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                if (currentWordIndex < VOCABULARY_PAIRS.length - 1) {
                  (e.target as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 3px 6px rgba(16, 185, 129, 0.3)'
                }
              }}
            >
              {currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? '🏁' : '➡️'}
            </button>
          )}
          
          <button
            data-testid="reset-btn"
            onClick={resetGame}
            style={{
              padding: window.innerWidth <= 480 ? '0.5rem 0.7rem' : '1rem 1.5rem',
              backgroundColor: 'var(--error-red)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
              boxShadow: '0 3px 6px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s ease',
              minWidth: window.innerWidth <= 480 ? '45%' : 'auto'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)'
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 3px 6px rgba(239, 68, 68, 0.3)'
            }}
          >
            🔄
          </button>
        </div>

        {currentWordIndex >= VOCABULARY_PAIRS.length - 1 && feedback && (
          <div data-testid="game-complete" style={{ 
            marginTop: '2rem', 
            padding: window.innerWidth <= 480 ? '1.5rem' : '2rem', 
            background: 'linear-gradient(135deg, var(--success-green-light) 0%, var(--primary-blue-light) 100%)', 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '2px solid var(--success-green)',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: window.innerWidth <= 480 ? '1.8rem' : '2.2rem',
              marginBottom: '1.5rem',
              color: 'var(--success-green)',
              fontWeight: '700'
            }}>🎉 Excellent! Game Complete! 🎉</h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.2rem',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid var(--primary-blue-light)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-blue)', marginBottom: '0.3rem' }}>
                  {gameState.currentScore}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', fontWeight: '600' }}>Points</div>
              </div>
              
              <div style={{
                background: 'white',
                padding: '1.2rem',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid var(--success-green-light)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--success-green)', marginBottom: '0.3rem' }}>
                  {gameState.wordsLearned.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', fontWeight: '600' }}>Words Learned</div>
              </div>
              
              <div style={{
                background: 'white',
                padding: '1.2rem',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid var(--warning-orange-light)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--warning-orange)', marginBottom: '0.3rem' }}>
                  {Math.round((gameState.correctAnswers / gameState.totalWordsAnswered) * 100)}%
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', fontWeight: '600' }}>Accuracy</div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
  )
}

export default App
