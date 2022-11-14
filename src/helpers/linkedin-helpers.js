async function getNameAndLastName(page, fullNameSelector) {
    await page.waitForSelector(fullNameSelector)
    let element = await page.$(fullNameSelector)
    let fullName = await page.evaluate(el => el.textContent, element);
    const [name, lastname] = fullName.split(' ');
    return { name, lastname }
}

async function getProfilePicture(page, imageSelector) {
    await page.waitForSelector(imageSelector)
    return page.$eval(imageSelector, element => element.getAttribute('src'));
}

async function sendConnectionRequest(page, connectSelector) {
    await page.waitForSelector(connectSelector);
    return page.click(connectSelector);
}

module.exports = { sendConnectionRequest, getProfilePicture, getNameAndLastName }