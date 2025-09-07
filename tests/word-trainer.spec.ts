import { test, expect } from '@playwright/test';

test.describe('English Word Trainer Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game title and initial state', async ({ page }) => {
    // Check game title
    await expect(page.locator('h1')).toHaveText('English Word Trainer');
    
    // Check initial score and streak
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
    await expect(page.getByTestId('progress')).toHaveText('Word 1 of 15');
    
    // Check that first word is displayed
    const definition = page.getByTestId('definition');
    await expect(definition).toBeVisible();
    await expect(definition).toContainText('Having a strong desire to succeed');
    
    // Check answer input is visible
    await expect(page.getByTestId('answer-input')).toBeVisible();
    await expect(page.getByTestId('submit-btn')).toBeVisible();
  });

  test('should submit correct answer and update score', async ({ page }) => {
    // Type the correct answer "ambitious"
    await page.getByTestId('answer-input').fill('ambitious');
    await page.getByTestId('submit-btn').click();
    
    // Check feedback shows correct
    await expect(page.getByTestId('feedback')).toHaveText('✅ Correct!');
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
    
    // Check feedback shows incorrect with correct answer
    await expect(page.getByTestId('feedback')).toContainText('❌ Incorrect. The answer was: ambitious');
    await expect(page.getByTestId('feedback')).toHaveCSS('color', 'rgb(255, 0, 0)');
    
    // Check score stays 0, streak resets
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
  });

  test('should allow Enter key to submit answer', async ({ page }) => {
    await page.getByTestId('answer-input').fill('ambitious');
    await page.getByTestId('answer-input').press('Enter');
    
    await expect(page.getByTestId('feedback')).toHaveText('✅ Correct!');
  });

  test('should handle case insensitive answers', async ({ page }) => {
    // Test uppercase
    await page.getByTestId('answer-input').fill('AMBITIOUS');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('feedback')).toHaveText('✅ Correct!');
    
    // Move to next word and test mixed case
    await page.getByTestId('next-btn').click();
    await page.getByTestId('answer-input').fill('CuRiOsItY');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('feedback')).toHaveText('✅ Correct!');
  });

  test('should show and hide hints with score penalty', async ({ page }) => {
    // Initially hint is not visible
    await expect(page.getByTestId('hint')).not.toBeVisible();
    
    // Click hint button
    await page.getByTestId('hint-btn').click();
    
    // Hint should be visible
    await expect(page.getByTestId('hint')).toBeVisible();
    await expect(page.getByTestId('hint')).toContainText('Someone who has big dreams');
    
    // Button text should change
    await expect(page.getByTestId('hint-btn')).toHaveText('Hide Hint');
    
    // Score should not be penalized yet (penalty applies when answering)
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    
    // Hide hint
    await page.getByTestId('hint-btn').click();
    await expect(page.getByTestId('hint')).not.toBeVisible();
    await expect(page.getByTestId('hint-btn')).toHaveText('Show Hint (-2 pts)');
  });

  test('should progress through multiple words', async ({ page }) => {
    // Answer first word correctly
    await page.getByTestId('answer-input').fill('ambitious');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('score')).toHaveText('Score: 10');
    
    // Go to next word
    await page.getByTestId('next-btn').click();
    await expect(page.getByTestId('progress')).toHaveText('Word 2 of 15');
    
    // Check second word definition appears
    await expect(page.getByTestId('definition')).toContainText('A strong desire to know or learn something');
    
    // Answer input should be cleared
    await expect(page.getByTestId('answer-input')).toHaveValue('');
    
    // Feedback should be cleared
    await expect(page.getByTestId('feedback')).not.toBeVisible();
    
    // Answer second word
    await page.getByTestId('answer-input').fill('curiosity');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('score')).toHaveText('Score: 20');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 2');
  });

  test('should reset game correctly', async ({ page }) => {
    // Make some progress
    await page.getByTestId('answer-input').fill('ambitious');
    await page.getByTestId('submit-btn').click();
    await page.getByTestId('next-btn').click();
    
    // Verify game state has changed
    await expect(page.getByTestId('score')).toHaveText('Score: 10');
    await expect(page.getByTestId('progress')).toHaveText('Word 2 of 15');
    
    // Reset game
    await page.getByTestId('reset-btn').click();
    
    // Check everything is reset
    await expect(page.getByTestId('score')).toHaveText('Score: 0');
    await expect(page.getByTestId('streak')).toHaveText('Streak: 0');
    await expect(page.getByTestId('progress')).toHaveText('Word 1 of 15');
    await expect(page.getByTestId('answer-input')).toHaveValue('');
    await expect(page.getByTestId('feedback')).not.toBeVisible();
    
    // First word should be back
    await expect(page.getByTestId('definition')).toContainText('Having a strong desire to succeed');
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
    
    // Check game completion
    await expect(page.getByTestId('game-complete')).toBeVisible();
    await expect(page.getByTestId('game-complete')).toContainText('Game Complete!');
    await expect(page.getByTestId('game-complete')).toContainText('Final Score:');
    await expect(page.getByTestId('game-complete')).toContainText('Words Learned:');
    await expect(page.getByTestId('game-complete')).toContainText('Accuracy:');
    
    // Next button should be disabled
    await expect(page.getByTestId('next-btn')).toBeDisabled();
  });

  test('should handle streak correctly on wrong answers', async ({ page }) => {
    // Get a streak going
    await page.getByTestId('answer-input').fill('ambitious');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('streak')).toHaveText('Streak: 1');
    
    await page.getByTestId('next-btn').click();
    await page.getByTestId('answer-input').fill('curiosity');
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
    // Start with first word (ambitious - difficulty 2)
    await expect(page.getByTestId('definition')).toContainText('Having a strong desire to succeed');
    
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
    await expect(page.getByTestId('progress')).toHaveText('Word 3 of 15');
  });
});
