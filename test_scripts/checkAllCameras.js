const puppeteer = require('puppeteer');
const fs = require('fs')

// Example array of arrays - replace this with your actual data
const mn_cameras = require('./mn_client_testing.json')
const atl_cameras = require('./atl_client_tested.json')
const md_cameras = require('./md_client_testing.json')
// const az_cameras = require('./az_client_tested.json')
const sea_cameras = require('../client_lists/sea_client.json')
console.log(sea_cameras)
const arrayOfArrays = [ sea_cameras]


let totalWorks = 0
let totalChecked = 0
let problemArr = []
async function checkImages(urls) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const item of urls) {
    console.log(item)
    try {
        let checkUrl = `http://localhost:6969/api${item.imageUrl}`
        console.log(checkUrl)
        const response = await page.goto(checkUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
        if (response.ok() && response.headers()['content-type'].startsWith('image/')) {
            // console.log(`${item.imageUrl}: WORKS`);
            totalWorks++
        } else {
            // console.log(`${item.imageUrl}: BROKEN`);
            problemArr.push(item)
        }
    } catch (error) {
        // console.log(`${item.imageUrl}: BROKEN (${error.message})`);
        problemArr.push(item)
    }
    totalChecked++
    console.log(`Work: ${totalWorks} | Checked: ${totalChecked} | Total: ${urls.length}`)
  }

  await browser.close();
  let problemsStringified = JSON.stringify(problemArr)
  fs.writeFileSync('./latestProblems.json', problemsStringified)
}

// Spread the array of arrays into one big array
const allUrls = arrayOfArrays.flat();

// Run the check
checkImages(allUrls).then(() => console.log('All checks complete'));

