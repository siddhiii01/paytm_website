import { test, expect } from '@playwright/test';

test.describe('P2P Transfer Flow (No Login/Signup)', () => {
  test('successful P2P transfer redirects to payment status', async ({ page }) => {
    console.log('Starting P2P success test (no login)');

    // 1. Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'liz@gmail.com');
    await page.fill('input[name="password"]', 'liz');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/dashboard', { timeout: 30000 });
    console.log('✓ Logged in');

   // 1. Go directly to P2P transfer page
    await page.goto('http://localhost:5173/p2ptransfer', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Navigated to /p2ptransfer');

    // Wait for form inputs
    await page.waitForSelector('input[placeholder="9876543210"]', { timeout: 15000 });
    console.log('Form visible');

    // 2. Fill form
    await page.fill('input[placeholder="9876543210"]', '9876543210'); // real receiver phone in DB
    await page.fill('input[placeholder="0.00"]', '100');
    console.log('Form filled');

    // 3. Submit and wait for the POST request + response
    console.log('Waiting for API call and response...');

    const [request, response] = await Promise.all([
      // Wait for the POST request to be sent
      page.waitForRequest(
        req => req.method() === 'POST' && req.url().includes('/p2ptransfer'),
        { timeout: 30000 }
      ),
      // Wait for the 200 response
      page.waitForResponse(
        res => res.url().includes('/p2ptransfer') && res.status() === 200,
        { timeout: 90000 }
      ),
      // Click submit
      page.click('button:has-text("Send Money")'),
    ]);

    console.log('POST request sent to:', request.url());
    console.log('API responded:', response.status(), response.statusText());
    
    const responseBody = await response.json();
    console.log('Response body:', JSON.stringify(responseBody, null, 2));

    // 4. Wait for loading to disappear (critical!)
    // Replace with YOUR actual loading selector (inspect when submitting form)
    // Examples: text=Sending..., .animate-spin, div.bg-opacity-50, div.fixed.inset-0
    try {
      await page.waitForSelector('text=Sending... or .animate-spin or div.fixed.inset-0', {
        state: 'detached',
        timeout: 60000,
      });
      console.log('Loading state disappeared');
    } catch (e) {
      console.log('No loading indicator found or timeout — proceeding');
    }

    // 5. Wait for network to settle
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    console.log('Network idle');

    // 6. Wait for redirect (very generous timeout)
    await expect(page).toHaveURL('http://localhost:5173/payment-status', { timeout: 90000 });
    console.log('Redirected to /payment-status');

    // 7. Verify success message
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/Money Sent|Transfer Successful|Success/i);
    console.log('Success message found');

    // 8. Verify amount (flexible)
    await expect(page.locator(/₹\s*100/)).toBeVisible({ timeout: 10000 });
    console.log('Amount visible');

    console.log('✅ Test passed!');
  });
});

//  npx playwright test --ui