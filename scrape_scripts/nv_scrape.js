fetch("https://www.nvroads.com/Camera/GetUserCameras?_=1725298287392", {
  "headers": {
    "__requestverificationtoken": "7AKH8qKBj_-6WtPpS9jViOnDHujHRm-lMbg-PLWlQ5QtVwuW-CWdTN8t2gwz1GC_NBJJ7H5a2Nt_1qvvMtF-X3F4v8c1",
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "session-id=60F8DD216A9E22FBFE908FBBDF6378EF0A3C22A9AF9C3C1055F36B562DBE8FC017085FD193A1D27EEDAE8230087FF719E650BA7D7923C470C83F427C8F2E13FD1948F78B17AF2DEFA492064F362DE1D5BD0D346D21B3C3981E59CA967744316C55059CF5C60841BDF3C87E482D618779784BB8AEF1846CE76894DF120CAEC787; _culture=en-US; session=session; __RequestVerificationToken=ueUZBr1bOhULR4WQhgu-V2LoYVNpc524P9s4vzKV45mzbKfpeYlEcdoUkpuYMsgpinjZph-af6JaWSH1ZDONvBmxIEQ1; FeatureSlideModalVersion=1; _gid=GA1.2.96079209.1725298010; map={%22selectedLayers%22:[%22TrafficSpeeds%22%2C%22Incidents%22%2C%22Construction%22%2C%22Closures%22%2C%22Cameras%22]%2C%22prevZoom%22:14%2C%22prevLatLng%22:[36.16075279868821%2C-115.1478144819169]%2C%22mapView%22:%222024-09-02T17:28:32.649Z%22}; _gat=1; _gat_gtag_UA_7345015_42=1; _ga_FMGM2F0ZXB=GS1.1.1725298010.2.1.1725298266.0.0.0; _ga_FLY6HVR68T=GS1.1.1725298010.3.1.1725298287.0.0.0; _ga=GA1.2.620205228.1724377824",
    "Referer": "https://www.nvroads.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});


const puppeteer = require('puppeteer');
const cameras = require('../camera_sources/pa_cams.json');
const testIfStreamReturnsImage = require('../test_scripts/testIfStreamReturnsImage.js')
const fs = require('fs');
const tesseract = require("node-tesseract-ocr")



const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

const area = 'pa'

async function getCameraInfo() {

    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to hold camera information
    let camerasData = [];
    // const previousServerObj = require(`./${area}_server.json`)
    // const previousClientArr = require(`./${area}_client.json`)
    // const previousClientArr = 
    // console.log(previousClientArr.length)
    // let serverObj = previousServerObj
    // let clientArr = previousClientArr 
    let serverObj = {}
    let clientArr = []
    console.log(cameras.length)
    //486
    for (let i = 737; i < cameras.length; i++) {
        let camera = cameras[i];
        // console.log(camera)
        if (!camera.videoUrl) continue
        let url = `https://511pa.com/tooltip/Cameras/${camera.DT_RowId}`;

        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
            let title = camera.displayName;
            let videoURL = false;
            let isAvailable = false;
            let videoWorks = false


            // try {
            //     // Grab the Inner HTML of the <td> with the ID `CameraTooltipDescriptionColumn`
            //     title = await page.$eval('#CameraTooltipDescriptionColumn', el => el.innerText);
            // } catch (err) {
            //     console.log("Error in title grab", camera.itemId, err);
            // }


            try {
                // Grab the Inner HTML of the <td> with the ID `CameraTooltipDescriptionColumn`
                title = await page.$eval('#CameraTooltipDescriptionColumn', el => el.innerText);
            } catch (err) {
                console.log("Error in title grab", camera.itemId, err);
            }

            
            try {
                // Grab the `data-videourl` attribute from the <div>
                videoURL = await page.$eval('div[id$="-videoContainer"]', el => el.getAttribute('data-videourl')).catch(() => false);
                console.log("videoURL", videoURL)
                if (videoURL) {
                    videoWorks = await testIfStreamReturnsImage(videoURL, 5000)
                    console.log("videoWorks: ", videoWorks)
                }
                
            } catch (err) {
                console.log("Error in url grab", camera.itemId, err, url);
            }

            // If stream is available, prepare data objects
            if (videoWorks) {
                console.log("STREAM AVAIL @", `https://511ga.org/tooltip/Cameras/${camera.itemId}?lang=en-US`);
                let objForServerArr = {
                    id: camera.itemId,
                    latitude: camera.latitude,
                    longitude: camera.longitude,
                    area,
                    name: title,
                    isAvailable,
                    originalUrl: url,
                    liveCameraUrl: videoURL,
                    siteUrl: `/${area}/${camera.DT_RowId}`
                };

                let objForClientArr = {
                    id: camera.itemId,
                    name: title,
                    area,
                    latitude: camera.latitude,
                    longitude: camera.longitude,
                    imageUrl: `/${area}/${camera.DT_RowId}`
                };

                serverObj[camera.itemId] = objForServerArr;
                clientArr.push(objForClientArr);

                console.log(`sObj:\n${JSON.stringify(objForServerArr, null, 2)}\n\ncObj:\n${JSON.stringify(objForClientArr, null, 2)}`);

                // Write to JSON files
                let stringifiedServerObjData = JSON.stringify(serverObj, null, 2);
                fs.writeFileSync(`./${area}_server.json`, stringifiedServerObjData);

                let stringifiedClientArrData = JSON.stringify(clientArr, null, 2);
                fs.writeFileSync(`./${area}_client.json`, stringifiedClientArrData);
            } 
        } catch (err) {
            console.log("Error in page load, probably hit timeout", camera.itemId, err);
        }

        console.log(`${i + 1} / ${cameras.length} || ${url}`);
    }

    // Close the browser
    await browser.close();
}

getCameraInfo();
