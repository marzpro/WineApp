const puppeteer = require('puppeteer');

async function scrapeWineData(url) {
    console.log('Starting scrape for URL:', url);
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false, 
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080',
                '--start-maximized'
            ],
            executablePath: '/Applications/Arc.app/Contents/MacOS/Arc'
        });

        console.log('Creating new page...');
        const page = await browser.newPage();
        console.log('Page created successfully');
        
        try {
            console.log('Setting viewport...');
            await page.setViewport({ width: 1920, height: 1080 });
            
            console.log('Setting user agent...');
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

            console.log('Navigating to page:', url);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increased timeout and adjusted wait condition
            console.log('Navigation complete');

            // Wait for specific elements we know should be on the page
            const selectors = ['div[class*="taste__flavors"]', 'div[class*="rating"]'];
            for (const selector of selectors) {
                try {
                    console.log(`Waiting for selector: ${selector}`);
                    await page.waitForSelector(selector, { timeout: 15000 }); // Increased timeout for each selector
                } catch (error) {
                    console.warn(`Selector not found: ${selector}`);
                }
            }

            // 1. Extract Wine Overall Rating
            const rating = await page.evaluate(() => {
                const ratingElement = document.querySelector('span[class*="vivinoRating"]');
                return ratingElement ? parseFloat(ratingElement.textContent.trim()) : null;
            });
            console.log('Wine Overall Rating:', rating);

            // 2. Extract Flavour Notes
            const flavourNotes = await page.evaluate(() => {
                const notesElement = document.querySelector('div[class*="taste__flavors"]');
                return notesElement ? notesElement.textContent.split(',').map(note => note.trim()) : [];
            });
            console.log('Flavour Notes:', flavourNotes);

            // 3. Extract Taste Characteristic Sliders
            const characteristics = await page.evaluate(() => {
                const sliders = document.querySelectorAll('.indicatorBar__progress--3aXLX');
                const results = {};

                sliders.forEach(slider => {
                    const style = slider.style.left || '0%';
                    const percentage = parseFloat(style.replace('%', ''));
                    const category = slider.closest('.tasteCharacteristic__label')?.textContent.trim();

                    let rating;
                    if (percentage <= 5) rating = 1;
                    else if (percentage <= 15) rating = 1.5;
                    else if (percentage <= 25) rating = 2;
                    else if (percentage <= 35) rating = 2.5;
                    else if (percentage <= 45) rating = 3;
                    else if (percentage <= 55) rating = 3.5;
                    else if (percentage <= 65) rating = 4;
                    else if (percentage <= 75) rating = 4.5;
                    else rating = 5;

                    if (category) {
                        results[category] = `${rating} (${percentage}%)`;
                    }
                });

                return results;
            });
            console.log('Taste Characteristics:', characteristics);

            const result = {
                'Wine Overall Rating': rating,
                'Flavour Notes': flavourNotes,
                'Taste Characteristics': characteristics
            };
            
            console.log('Final data:', result);
            return result;

        } catch (error) {
            console.error('Error during page operations:', error);
            throw error;
        } finally {
            try {
                console.log('Taking final screenshot...');
                await page.screenshot({ path: 'final-page.png', fullPage: true });
            } catch (screenshotError) {
                console.error('Screenshot error:', screenshotError);
            }
        }
    } catch (error) {
        console.error('Browser error:', error);
        throw error;
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
            console.log('Browser closed');
        }
    }
}

module.exports = { scrapeWineData };