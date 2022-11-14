require('dotenv').config();
const puppeteer = require('puppeteer');
const constants = require('../constants')
const Profiles = require("../models/linkedin-profiles");
const { getNameAndLastName, getProfilePicture, sendConnectionRequest  } = require('../helpers/linkedin-helpers')

// const FULL_NAME_SELECTOR = 'div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div:nth-child(1) > h1'
// const IMAGE_SELECTOR = 'div.ph5 > div:nth-child(1) > div.pv-top-card--photo.text-align-left.pv-top-card--photo-resize > div > button img'
// const CONNECT_SELECTOR = 'div.ph5 > div.pv-top-card-v2-ctas.display-flex.pt3 > div > div.pvs-profile-actions__action';
//
// const accounts = ['https://www.linkedin.com/in/rajiaabdelaziz',
//     'https://www.linkedin.com/in/darian-bhathena/',
//     'https://www.linkedin.com/in/danilolucari/',
//     'https://www.linkedin.com/in/ngellner/',
//     'https://www.linkedin.com/in/sixped/',
//     'https://www.linkedin.com/in/davidezequielgranados/',
//     'https://www.linkedin.com/in/andrejvajagic/',
//     'https://www.linkedin.com/in/sahilbhatiya/',
//     'https://www.linkedin.com/in/stenrs/',
//     'https://www.linkedin.com/in/alexghattas/'
// ];

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