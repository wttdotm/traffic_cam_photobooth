const puppeteer = require('puppeteer');
const seaCameras = require('./seattle_cams.json');
const fs = require('fs');
// const tesseract = require("node-tesseract-ocr")


const ffmpeg = require('fluent-ffmpeg');
const { Writable } = require('stream');
const command = ffmpeg();
const area = 'sea'
// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');


//DATA MODEL

// //
// {"coord": [47.526783365445, -122.392755787503],    
//     "cams": [
//         {
//             "id": "CMR-0112", 
//             "name": "Fauntleroy Way SW & SW Cloverdale St", 
//             "stream": "https://61e0c5d388c2e.streamlock.net:443/live/Fauntleroy_SW_Cloverdale_NS.stream/playlist.m3u8"}
//         ]
// }


//For camera in sea amss
//Get coord
//get the first camera from cams
//throw the URL at ffmpeg
//if it throws an error, dont do anything
//if it doesn't, make it osmething


const sea_serverObj = {}
const sea_clientArr = []

async function processCamera(camera) {
    return new Promise((resolve) => {
        if (!camera.cams[0].stream) {
            camera.liveFeedWorks = false;
            // atl_cameras_checked.push(camera);
            // console.log(camera.id, "has no liveFeed")
            resolve(); // Resolve immediately if there's no URL
        } else {
            ffmpeg(camera.cams[0].stream)
                .frames(1)
                .outputOptions('-q:v 2')
                .format('image2pipe')
                .on('error', (err) => {
                    camera.liveFeedWorks = false;
                    // atl_cameras_checked.push(camera);
                    console.error(`Err At ${camera.cams[0].id}:`, err);
                    resolve(); // Resolve the promise on error
                })
                .on('end', () => {
                    camera.liveFeedWorks = true;
                    // atl_cameras_checked.push(camera);
                    console.log(`${camera.cams[0].id} Image captured successfully`);

                    //MAKE THE OBJ
                    let objForServerArr = {
                        id: camera.cams[0].id,
                        latitude: camera.coord[0],
                        longitude: camera.coord[1],
                        area,
                        name: camera.cams[0].name,
                        isAvailable : true,
                        originalUrl: "NA",
                        liveCameraUrl: camera.cams[0].stream,
                        siteUrl: `/${area}/${camera.cams[0].id}`
                    };
    
                    let objForClientArr = {
                        id: camera.cams[0].id,
                        name: camera.cams[0].name,
                        area,
                        latitude: camera.coord[0],
                        longitude: camera.coord[1],
                        imageUrl: `/${area}/${camera.cams[0].id}`
                    };


                    //ADD IT TO THE RELEVANT obj and Arr
                    sea_serverObj[camera.cams[0].id] = objForServerArr
                    sea_clientArr.push(objForClientArr)

                    //SAVE THEM
                    let sea_serverObj_string = JSON.stringify(sea_serverObj, null, 2);
                    let sea_clientArr_string = JSON.stringify(sea_clientArr, null, 2);

                    //WRTITE SE 
                    fs.writeFileSync(`./${area}_server.json`, sea_serverObj_string, err => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("file written successfully");
                        }
                    });
                    fs.writeFileSync(`./${area}_client.json`, sea_clientArr_string, err => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("file written successfully");
                        }
                    });




                    resolve(); // Resolve the promise when done
                })
                .pipe(new Writable({
                    write(chunk, encoding, callback) {
                        // Optionally process the chunk here
                        callback();
                    }
                }))
        }
    });
}

let totalCameras = 0
async function processCamerasSequentially(cameras) {
    for (const thiscamera in cameras) {
        totalCameras++
        // if (totalCameras < 1000) {
            const camera = cameras[thiscamera];
            console.log(`new seq camera (${totalCameras} / ${seaCameras.length})`, thiscamera)
            await processCamera(camera); // Wait for the camera to be processed before moving to the next
        // }
    }
}

processCamerasSequentially(seaCameras);


