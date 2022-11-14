require('dotenv').config();
const puppeteer = require('puppeteer');
const constants = require('../constants')
const Profiles = require("../models/linkedin-profiles");
const { getNameAndLastName, getProfilePicture, sendConnectionRequest  } = require('../helpers/linkedin-helpers')

async function openBrowserAndSetCookies() {
    try {
        const browser = await puppeteer.launch(
            {
                headless: false,
                args: ["--start-maximized", "--no-sandbox", "--disable-gpu"]
            }
        );
        const page = await browser.newPage();
        await page.setCookie({
            name: 'li_at',
            value: process.env.LINKEDIN_SESSION,
            domain: 'www.linkedin.com'
        })
        await page.setViewport({ width: 1366, height: 768 });
        return { page, browser };
    } catch (e) {
        console.log(e);
    }
}

async function closeBrowser(browser) {
    return browser.close();
}

async function scrapper() {
    try {
        const { page, browser } = await openBrowserAndSetCookies();
        for (let account of constants.accounts) {
            page.goto(account);
            const {name, lastname} = await getNameAndLastName(page, constants.FULL_NAME_SELECTOR)
            console.log('name', name);
            const image = await getProfilePicture(page, constants.IMAGE_SELECTOR);
            console.log('image', image);
            await Profiles.create({ name, lastname, image })
            await sendConnectionRequest(page, constants.CONNECT_SELECTOR);
        }
        await closeBrowser(browser)
    } catch (err) {
        console.log(err);
    }
}

module.exports = scrapper;
