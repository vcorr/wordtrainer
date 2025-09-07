import { test, expect } from '@playwright/test';

test.describe('Finnish-English Vocabulary Trainer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game title and initial state', async ({ page }) => {
    // Check game title
    await expect(page.locator('h1')).toHaveText('Englannin Lause Harjoittelu');
    
    // Check initial score and streak
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
    await expect(page.getByTestId('progress')).toHaveText('Sana 1 / 15');
    
    // Check that first word context sentence is displayed
    const contextSentence = page.getByTestId('context-sentence');
    await expect(contextSentence).toBeVisible();
    await expect(contextSentence).toContainText('Finland is _______ for its beautiful forests.');
    
    // Check Finnish word is displayed
    await expect(page.locator('text=kuuluisa')).toBeVisible();
    await expect(page.locator('text=adjective')).toBeVisible();
    
    // Check answer input is visible
    await expect(page.getByTestId('answer-input')).toBeVisible();
    await expect(page.getByTestId('submit-btn')).toBeVisible();
  });

  test('should submit correct answer and update score', async ({ page }) => {
    // Type the correct answer "famous"
    await page.getByTestId('answer-input').fill('famous');
    await page.getByTestId('submit-btn').click();
    
    // Check feedback shows correct in Finnish
    await expect(page.getByTestId('feedback')).toHaveText('✅ Oikein! (Correct!)');
    await expect(page.getByTestId('feedback')).toHaveCSS('color', 'rgb(0, 128, 0)');
    
    // Check score updated
    await expect(page.getByTestId('score')).toHaveText('Score: 10');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 1');
    
    // Check next button appears
    await expect(page.getByTestId('next-btn')).toBeVisible();
    await expect(page.getByTestId('next-btn')).toBeEnabled();
  });

  test('should handle incorrect answer', async ({ page }) => {
    // Type an incorrect answer
    await page.getByTestId('answer-input').fill('wrong');
    await page.getByTestId('submit-btn').click();
    
    // Check feedback shows incorrect with correct answer in Finnish
    await expect(page.getByTestId('feedback')).toContainText('❌ Väärin. Oikea vastaus oli: famous');
    await expect(page.getByTestId('feedback')).toHaveCSS('color', 'rgb(255, 0, 0)');
    
    // Check score stays 0, streak resets
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
  });

  test('should allow Enter key to submit answer', async ({ page }) => {
    await page.getByTestId('answer-input').fill('famous');
    await page.getByTestId('answer-input').press('Enter');
    
    await expect(page.getByTestId('feedback')).toHaveText('✅ Oikein! (Correct!)');
  });

  test('should handle case insensitive answers', async ({ page }) => {
    // Test uppercase
    await page.getByTestId('answer-input').fill('FAMOUS');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('feedback')).toHaveText('✅ Oikein! (Correct!)');
    
    // Move to next word and test mixed case
    await page.getByTestId('next-btn').click();
    await page.getByTestId('answer-input').fill('A RoCk');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('feedback')).toHaveText('✅ Oikein! (Correct!)');
  });

  test('should show and hide hints with score penalty', async ({ page }) => {
    // Initially hint is not visible
    await expect(page.getByTestId('hint')).not.toBeVisible();
    
    // Click hint button
    await page.getByTestId('hint-btn').click();
    
    // Hint should be visible with Finnish interface
    await expect(page.getByTestId('hint')).toBeVisible();
    await expect(page.getByTestId('hint')).toContainText('Well-known, recognized by many people');
    
    // Button text should change to Finnish
    await expect(page.getByTestId('hint-btn')).toHaveText('🙈 Piilota');
    
    // Score should not be penalized yet (penalty applies when answering)
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    
    // Hide hint
    await page.getByTestId('hint-btn').click();
    await expect(page.getByTestId('hint')).not.toBeVisible();
    await expect(page.getByTestId('hint-btn')).toHaveText('💡 Selitys');
  });

  test('should progress through multiple words', async ({ page }) => {
    // Answer first word correctly
    await page.getByTestId('answer-input').fill('famous');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('score')).toHaveText('Score: 10');
    
    // Go to next word
    await page.getByTestId('next-btn').click();
    await expect(page.getByTestId('progress')).toHaveText('Sana 2 / 15');
    
    // Check second word context sentence appears (kallio -> a rock)
    await expect(page.getByTestId('context-sentence')).toContainText('There is a large _______ in the garden.');
    
    // Answer input should be cleared
    await expect(page.getByTestId('answer-input')).toHaveValue('');
    
    // Feedback should be cleared
    await expect(page.getByTestId('feedback')).not.toBeVisible();
    
    // Answer second word
    await page.getByTestId('answer-input').fill('a rock');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('score')).toHaveText('Score: 20');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 2');
  });

  test('should reset game correctly', async ({ page }) => {
    // Make some progress
    await page.getByTestId('answer-input').fill('famous');
    await page.getByTestId('submit-btn').click();
    await page.getByTestId('next-btn').click();
    
    // Verify game state has changed
    await expect(page.getByTestId('score')).toHaveText('Score: 10');
    await expect(page.getByTestId('progress')).toHaveText('Sana 2 / 15');
    
    // Reset game
    await page.getByTestId('reset-btn').click();
    
    // Check everything is reset
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
    await expect(page.getByTestId('progress')).toHaveText('Sana 1 / 15');
    await expect(page.getByTestId('answer-input')).toHaveValue('');
    await expect(page.getByTestId('feedback')).not.toBeVisible();
    
    // First word should be back
    await expect(page.getByTestId('context-sentence')).toContainText('Finland is _______ for its beautiful forests.');
  });

  test('should complete game and show summary', async ({ page }) => {
    // Fast forward to the last word (word 15)
    // This is a bit of a hack for testing - in a real scenario we'd answer all words
    for (let i = 0; i < 14; i++) {
      await page.getByTestId('answer-input').fill('test');
      await page.getByTestId('submit-btn').click();
      if (i < 13) { // Don't click next on the last iteration
        await page.getByTestId('next-btn').click();
      }
    }
    
    // Now we're on word 15, answer it
    await page.getByTestId('answer-input').fill('flexible');
    await page.getByTestId('submit-btn').click();
    
    // Check game completion with Finnish interface
    await expect(page.getByTestId('game-complete')).toBeVisible();
    await expect(page.getByTestId('game-complete')).toContainText('🎉 Peli Päättynyt!');
    await expect(page.getByTestId('game-complete')).toContainText('Loppupisteet:');
    await expect(page.getByTestId('game-complete')).toContainText('Opittuja Sanoja:');
    await expect(page.getByTestId('game-complete')).toContainText('Tarkkuus:');
    
    // Next button should be disabled
    await expect(page.getByTestId('next-btn')).toBeDisabled();
  });

  test('should handle streak correctly on wrong answers', async ({ page }) => {
    // Get a streak going
    await page.getByTestId('answer-input').fill('famous');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('streak')).toHaveText('Streak: 1');
    
    await page.getByTestId('next-btn').click();
    await page.getByTestId('answer-input').fill('a rock');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('streak')).toHaveText('Streak: 2');
    
    // Wrong answer should reset streak
    await page.getByTestId('next-btn').click();
    await page.getByTestId('answer-input').fill('wrong');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
  });

  test('should display different difficulty words', async ({ page }) => {
    // Check that we have words of different difficulties
    // Start with first word (famous - difficulty 1)
    await expect(page.getByTestId('context-sentence')).toContainText('Finland is _______ for its beautiful forests.');
    
    // Move through a few words to find different difficulties
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('answer-input').fill('test');
      await page.getByTestId('submit-btn').click();
      if (i < 2) {
        await page.getByTestId('next-btn').click();
      }
    }
    
    // Should have seen different word types by now
    // This test mainly ensures the word progression works
    await expect(page.getByTestId('progress')).toHaveText('Sana 3 / 15');
  });
});
