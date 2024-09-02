const puppeteer = require('puppeteer');
const cameras = require('./deprecated_stuff/atl_cameras.json');
const fs = require('fs');
const tesseract = require("node-tesseract-ocr")
const testIfStreamReturnsImage = require ('./test_scripts/testIfStreamReturnsImage.js')


const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

const area = 'atl'

async function getCameraInfo() {

    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to hold camera information
    let camerasData = [];
    const previousServerObj = require(`./test_scripts/${area}_server.json`)
    const previousClientArr = require(`./test_scripts/${area}_client.json`)
    // const previousClientArr = 
    console.log(previousClientArr.length)
    let serverObj = previousServerObj
    let clientArr = previousClientArr
    // let serverObj = {}
    // let clientArr = []
    //486
    for (let i = 3190; i < cameras.length; i++) {
        let camera = cameras[i];
        let url = `https://511ga.org/tooltip/Cameras/${camera.itemId}?lang=en-US`;

        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
            let title = '';
            let videoURL = false;
            let isAvailable = false;
            let videoWorks = false

            try {
                // Grab the Inner HTML of the <td> with the ID `CameraTooltipDescriptionColumn`
                title = await page.$eval('#CameraTooltipDescriptionColumn', el => el.innerText);
            } catch (err) {
                console.log("Error in title grab", camera.itemId, err);
            }

            
            try {
                // Grab the `data-videourl` attribute from the <div>
                videoURL = await page.$eval('div[id$="-videoContainer"]', el => el.getAttribute('data-videourl')).catch(() => false);
                // console.log("videoURL", videoURL)
                if (videoURL) {
                    videoWorks = await testIfStreamReturnsImage(videoURL, 5000)
                    // console.log("videoWorks: ", videoWorks)
                }
                
            } catch (err) {
                console.log("Error in url grab", camera.itemId, err, url);
            }

            // If stream is available, prepare data objects
            if (videoWorks) {
                console.log("STREAM AVAIL @", `https://511ga.org/tooltip/Cameras/${camera.itemId}?lang=en-US`);
                let objForServerArr = {
                    id: camera.itemId,
                    latitude: camera.location[0],
                    longitude: camera.location[1],
                    area,
                    name: title,
                    isAvailable,
                    originalUrl: url,
                    liveCameraUrl: videoURL,
                    siteUrl: `/${area}/${camera.itemId}`
                };

                let objForClientArr = {
                    id: camera.itemId,
                    name: title,
                    area,
                    latitude: camera.location[0],
                    longitude: camera.location[1],
                    imageUrl: `/${area}/${camera.itemId}`
                };

                serverObj[camera.itemId] = objForServerArr;
                clientArr.push(objForClientArr);

                console.log(`sObj:\n${JSON.stringify(objForServerArr, null, 2)}\n\ncObj:\n${JSON.stringify(objForClientArr, null, 2)}`);

                // Write to JSON files
                let stringifiedServerObjData = JSON.stringify(serverObj, null, 2);
                fs.writeFileSync(`./${area}_server.json`, stringifiedServerObjData);

                let stringifiedClientArrData = JSON.stringify(clientArr, null, 2);
                fs.writeFileSync(`./${area}_client.json`, stringifiedClientArrData);
            } else {
                // console.log("STREAM NOT AVAILABLE @", `https://511ga.org/tooltip/Cameras/${camera.itemId}?lang=en-US`);
            }
        } catch (err) {
            console.log("Error in page load, probably hit timeout", camera.itemId, err);
        }

        console.log(`${i + 1} / ${cameras.length} | https://511ga.org/tooltip/Cameras/${camera.itemId}?lang=en-US}`);
    }

    // Close the browser
    await browser.close();
}

getCameraInfo();
