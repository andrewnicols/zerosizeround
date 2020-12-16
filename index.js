const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function run() {
    const builder = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .usingServer('http://localhost:4444');

    const driver = await builder.build();
    await driver.manage().window().setRect({ width: 1024, height: 768 });

    driver.get('http://localhost:8000/index.html');

    const link = await driver.wait(until.elementLocated(By.id('checkmeout')), 10000);

    console.log("Expectation: Link clickable");
    await clickOnThings();
    console.log("");

    console.log("Expectation: Can not click on element now");
    const offsetTop = await driver.executeScript(`return document.getElementById('checkmeout').offsetTop`);
    const windowHeight =  await driver.executeScript(`return window.innerHeight;`);
    const targetScrollTop = offsetTop - windowHeight + 1;

    console.log(`\tLink has offsetTop: ${offsetTop}; windowHeight ${windowHeight}: ${offsetTop} - ${windowHeight} + 1 = ${targetScrollTop}`);

    console.log(`\tMoving viewport to top of link (${targetScrollTop})`);
    await driver.executeScript(`window.scrollTo(0, ${targetScrollTop});`);
    await clickOnThings();
    console.log("");

    await driver.quit();

    async function clickOnThings() {
        const scrollY = await driver.executeScript(`return window.scrollY;`);
        console.log(`\tClicking on link with scrollY set to ${scrollY}... `);
        link.click().catch(console.log);
        console.log("\tClicked on link :)");
        console.log("");
    }

}

run();
