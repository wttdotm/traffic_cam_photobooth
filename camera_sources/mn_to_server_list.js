

const puppeteer = require('puppeteer');
let cameras = require('./mn_camera_list.json');
const testIfStreamReturnsImage = require('../test_scripts/testIfStreamReturnsImage.js')
const fs = require('fs');
const tesseract = require("node-tesseract-ocr")



const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

const area = 'mn'

async function getCameraInfo() {
    let totalWork = 0
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to hold camera information
    let camerasData = [];
    const previousServerObj = require(`./${area}_server_initial.json`)
    // const previousClientArr = require(`./${area}_client.json`)
    // const previousClientArr = 
    // console.log(previousClientArr.length)
    let serverObj = previousServerObj
    // let clientArr = previousClientArr 
    // let serverObj = {}
    // let clientArr = []
    //486
    for (let i = 946; i < cameras.length; i++) {
    // for (let i = 0; i < cameras.length; i++) {
        let camera = cameras[i];
        let id = camera.parentCollection.uri.slice(camera.parentCollection.uri.indexOf('/')+1)
        const m3u8URL = camera.sources[0].src
        let lat = camera.parentCollection.bbox[1]
        let lon = camera.parentCollection.bbox[0]
        let name = camera.title
        let originalUrl = camera.url
        let publicVideoURL = `https://511mn.org/#${camera.uri}`
        // console.log(camera)
        // const {name, lat, lon, id, publicVideoURL, cctvIp, commMode } = camera
        // console.log(camera)
        // if (!camera.videoUrl) continue
        // let url = `https://511pa.com/tooltip/Cameras/${camera.DT_RowId}`;

        try {
            await page.goto(publicVideoURL, { waitUntil: 'networkidle2', timeout: 10000 });
            // console.log("in publci vid url")
            let title = name;
            let videoURL = m3u8URL;
            let isAvailable = false;
            let videoWorks = false


            // try {
            //     // Grab the Inner HTML of the <td> with the ID `CameraTooltipDescriptionColumn`
            //     title = await page.$eval('#CameraTooltipDescriptionColumn', el => el.innerText);
            // } catch (err) {
            //     console.log("Error in title grab", camera.itemId, err);
            // }

            
            try {
                // Grab the `data-videourl` attribute from the <div>
                if (videoURL) {
                    // console.log('videoURL is ', videoURL)
                    videoWorks = await testIfStreamReturnsImage(videoURL, 5000)
                    console.log("videoWorks: ", videoWorks)
                    isAvailable = true
                }
                
            } catch (err) {
                console.log("Error in url grab", id, err, url);
            }

            // If stream is available, prepare data objects
            if (videoWorks) {
                totalWork++
                console.log("STREAM AVAIL @", publicVideoURL);
                let objForServerArr = {
                    id,
                    latitude: lat,
                    longitude: lon,
                    area,
                    name,
                    isAvailable,
                    originalUrl: publicVideoURL,
                    liveCameraUrl: m3u8URL,
                    siteUrl: `/${area}/${id}`
                };

                // let objForClientArr = {
                //     id,
                //     name,
                //     area,
                //     latitude: lat,
                //     longitude: lon,
                //     imageUrl: `/${area}/${id}`
                // };

                serverObj[id] = objForServerArr;
                // clientArr.push(objForClientArr);

                // console.log(`sObj:\n${JSON.stringify(objForServerArr, null, 2)}\n\ncObj:\n${JSON.stringify(objForClientArr, null, 2)}`);
                console.log(`sObj:\n${JSON.stringify(objForServerArr, null, 2)}`);

                // Write to JSON files
                let stringifiedServerObjData = JSON.stringify(serverObj, null, 2);
                fs.writeFileSync(`./${area}_server_initial.json`, stringifiedServerObjData);

                // let stringifiedClientArrData = JSON.stringify(clientArr, null, 2);
                // fs.writeFileSync(`./${area}_client.json`, stringifiedClientArrData);
            } 
        } catch (err) {
            console.log("Error in page load, probably hit timeout", camera.itemId, err);
        }

        console.log(`${totalWork} / ${i + 1} / ${cameras.length} || ${publicVideoURL}`);
    }

    // Close the browser
    await browser.close();
}

getCameraInfo();
