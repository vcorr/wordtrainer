import { useState } from 'react'
import { VOCABULARY_PAIRS, INITIAL_GAME_STATE, VocabularyPair, GameState } from './gameTypes'

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)

  const currentPair = VOCABULARY_PAIRS[currentWordIndex]

  const handleSubmitAnswer = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === currentPair.english.toLowerCase()
    
    if (isCorrect) {
      setFeedback('✅ Oikein! (Correct!)')
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + 10,
        streak: prev.streak + 1,
        correctAnswers: prev.correctAnswers + 1,
        totalWordsAnswered: prev.totalWordsAnswered + 1,
        wordsLearned: [...prev.wordsLearned, currentPair.english]
      }))
    } else {
      setFeedback(`❌ Väärin. Oikea vastaus oli: ${currentPair.english}`)
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
        hintPenalty: prev.hintPenalty + 2
      }))
    }
  }

  return (
    <div style={{ 
      padding: window.innerWidth <= 480 ? '0.5rem' : '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.5rem' }}>
        <h1 style={{ 
          fontSize: window.innerWidth <= 480 ? '1.4rem' : '2.5rem',
          marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1rem',
          color: '#2c3e50',
          margin: '0 0 0.5rem 0'
        }}>Englannin Lause Harjoittelu</h1>
        <div style={{ 
          display: 'flex', 
          gap: window.innerWidth <= 480 ? '0.4rem' : '2rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginTop: window.innerWidth <= 480 ? '0.5rem' : '1rem',
          fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem'
        }}>
          <span data-testid="score" style={{ 
            background: '#e8f4fd', 
            padding: window.innerWidth <= 480 ? '0.3rem 0.6rem' : '0.4rem 0.8rem', 
            borderRadius: '12px',
            fontWeight: '600',
            color: '#2980b9'
          }}>Score: {gameState.currentScore}</span>
          <span data-testid="streak" style={{ 
            background: '#f0f9ff', 
            padding: window.innerWidth <= 480 ? '0.3rem 0.6rem' : '0.4rem 0.8rem', 
            borderRadius: '12px',
            fontWeight: '600',
            color: '#3498db'
          }}>Streak: {gameState.streak}</span>
          <span data-testid="progress" style={{ 
            background: '#f8f9fa', 
            padding: window.innerWidth <= 480 ? '0.3rem 0.6rem' : '0.4rem 0.8rem', 
            borderRadius: '12px',
            fontWeight: '600',
            color: '#6c757d'
          }}>Sana {currentWordIndex + 1} / {VOCABULARY_PAIRS.length}</span>
        </div>
      </header>

      <main style={{ textAlign: 'center' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
          padding: window.innerWidth <= 480 ? '0.8rem' : '2rem', 
          borderRadius: '12px', 
          marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ 
            fontSize: window.innerWidth <= 480 ? '1rem' : '1.5rem',
            marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1rem',
            color: '#495057',
            margin: '0 0 0.5rem 0'
          }}>Täydennä lause:</h2>
          
          <div data-testid="context-sentence" style={{ 
            fontSize: window.innerWidth <= 480 ? '1.1rem' : '1.6rem', 
            margin: window.innerWidth <= 480 ? '0.8rem 0' : '1.5rem 0',
            lineHeight: '1.3',
            color: '#212529',
            fontWeight: '500',
            background: '#ffffff',
            padding: window.innerWidth <= 480 ? '0.8rem' : '1rem',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            "{currentPair.contextSentence}"
          </div>
          
          <div style={{ marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1rem' }}>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '0.9rem' : '1.1rem',
              marginBottom: '0.3rem',
              color: '#495057'
            }}>
              <strong>Suomeksi:</strong>
            </div>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '1.2rem' : '1.6rem', 
              color: '#007acc',
              fontWeight: 'bold',
              marginBottom: '0.3rem'
            }}>
              {currentPair.finnish}
            </div>
            <span style={{ 
              background: '#e3f2fd', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '8px',
              fontSize: '0.7rem',
              color: '#1976d2'
            }}>
              {currentPair.category}
            </span>
          </div>
          
          {showHint && currentPair.contextClue && (
            <div data-testid="hint" style={{ 
              marginTop: window.innerWidth <= 480 ? '0.5rem' : '1rem', 
              marginBottom: window.innerWidth <= 480 ? '0.5rem' : '1rem',
              color: '#007acc',
              background: '#e3f2fd',
              padding: window.innerWidth <= 480 ? '0.6rem' : '1rem',
              borderRadius: '8px',
              border: '1px solid #bbdefb',
              fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem'
            }}>
              <strong>💡 Selitys:</strong> {currentPair.contextClue}
            </div>
          )}
        </div>

        <div style={{ 
          marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1.5rem',
          display: 'flex',
          flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
          gap: window.innerWidth <= 480 ? '0.6rem' : '1rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <input
            data-testid="answer-input"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Täydennä lause englanniksi..."
            style={{
              padding: window.innerWidth <= 480 ? '0.8rem' : '1rem',
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
              width: window.innerWidth <= 480 ? '100%' : '300px',
              maxWidth: '100%',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            onFocus={(e) => e.target.style.borderColor = '#007acc'}
            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
          />
          <button
            data-testid="submit-btn"
            onClick={handleSubmitAnswer}
            style={{
              padding: window.innerWidth <= 480 ? '0.8rem 1.5rem' : '1rem 2rem',
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              minWidth: window.innerWidth <= 480 ? '100%' : 'auto',
              boxShadow: '0 2px 6px rgba(0,122,204,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007acc'}
          >
            Vastaa
          </button>
        </div>

        {feedback && (
          <div data-testid="feedback" style={{ 
            fontSize: window.innerWidth <= 480 ? '1rem' : '1.2rem', 
            fontWeight: 'bold',
            marginBottom: window.innerWidth <= 480 ? '0.6rem' : '1rem',
            color: feedback.includes('✅') ? 'green' : 'red'
          }}>
            {feedback}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: window.innerWidth <= 480 ? '0.5rem' : '1rem', 
          justifyContent: 'center', 
          marginTop: window.innerWidth <= 480 ? '0.8rem' : '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            data-testid="hint-btn"
            onClick={toggleHint}
            style={{
              padding: window.innerWidth <= 480 ? '0.6rem 0.8rem' : '0.8rem 1.2rem',
              backgroundColor: showHint ? '#ff9500' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              minWidth: window.innerWidth <= 480 ? '48%' : 'auto'
            }}
          >
            {showHint ? '🙈 Piilota' : '💡 Selitys'}
          </button>
          
          {feedback && (
            <button
              data-testid="next-btn"
              onClick={nextWord}
              disabled={currentWordIndex >= VOCABULARY_PAIRS.length - 1}
              style={{
                padding: window.innerWidth <= 480 ? '0.6rem 0.8rem' : '0.8rem 1.2rem',
                backgroundColor: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
                boxShadow: currentWordIndex >= VOCABULARY_PAIRS.length - 1 ? 'none' : '0 1px 4px rgba(40,167,69,0.3)',
                transition: 'all 0.2s ease',
                minWidth: window.innerWidth <= 480 ? '48%' : 'auto'
              }}
            >
              ➡️ Seuraava
            </button>
          )}
          
          <button
            data-testid="reset-btn"
            onClick={resetGame}
            style={{
              padding: window.innerWidth <= 480 ? '0.6rem 0.8rem' : '0.8rem 1.2rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: window.innerWidth <= 480 ? '0.8rem' : '1rem',
              boxShadow: '0 1px 4px rgba(220,53,69,0.3)',
              transition: 'all 0.2s ease',
              minWidth: window.innerWidth <= 480 ? '48%' : 'auto'
            }}
          >
            🔄 Nollaa
          </button>
        </div>

        {currentWordIndex >= VOCABULARY_PAIRS.length - 1 && feedback && (
          <div data-testid="game-complete" style={{ 
            marginTop: '2rem', 
            padding: window.innerWidth <= 480 ? '1.5rem' : '2rem', 
            background: 'linear-gradient(135deg, #e7f3ff 0%, #d1ecf1 100%)', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #bee5eb'
          }}>
            <h2 style={{ 
              fontSize: window.innerWidth <= 480 ? '1.4rem' : '1.8rem',
              marginBottom: '1rem',
              color: '#0c5460'
            }}>🎉 Peli Päättynyt!</h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
              gap: window.innerWidth <= 480 ? '0.5rem' : '1.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem'
            }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#0c5460' }}>
                🏆 Loppupisteet: {gameState.currentScore}
              </p>
              <p style={{ margin: 0, fontWeight: '600', color: '#0c5460' }}>
                📚 Opittuja Sanoja: {gameState.wordsLearned.length}
              </p>
              <p style={{ margin: 0, fontWeight: '600', color: '#0c5460' }}>
                🎯 Tarkkuus: {Math.round((gameState.correctAnswers / gameState.totalWordsAnswered) * 100)}%
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
