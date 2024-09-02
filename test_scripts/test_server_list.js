const express = require('express');
const app = express();
const port = 6969;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const testIfStreamReturnsImage = require('./testIfStreamReturnsImage.js')
console.log(testIfStreamReturnsImage)
const cors = require('cors');
const atl_cameras = require('../server_lists/atl_server.json');
const sea_cameras = require('../server_lists/sea_server.json');

const testedClientArr = {}
const testedServerObj = []

const convertServerObjToClientObj = (cam) => {
    return {
        id: cam.id,
        name: cam.name,
        area : cam.area,
        latitude: cam.latitude,
        longitude: cam.longitude,
        imageUrl: cam.siteUrl
    };
}

let total = 0
let numThatWork = 0
async function checkCameras (cameraObj) {
    let objLength = Object.values(cameraObj).length
    for (let camera in cameraObj) {
        total++
        let thisCam = cameraObj[camera]
        // console.log(atl_cameras[camera])
        let ffmpegCommand

        const ffmpegPromise = new Promise((resolve, reject) => {
            let foundImage = false;
            ffmpegCommand = ffmpeg(`${thisCam.liveCameraUrl}`)
                .frames(1)
                .outputOptions('-q:v 2')
                .format('image2pipe')
                .on('error', (err) => {
                    let errMessage = `Error: ${err}`
                    if (errMessage.indexOf('SIGKILL') == -1) console.error('Error:', err);
                    foundImage = false;
                    reject(`err: ${err}`);
                })
                .on('data', (chunk) => {
                    foundImage = true;
                })
                .on('end', () => {
                    if (foundImage) {
                        console.log("ffmpeg command found image")
                        numThatWork++
                        resolve('success');
                    } else {
                        resolve('failed');
                    }
                })
                

                setTimeout(function(ffmpegCommand) {
                    // command.on('error', function() {
                    //   console.log('Ffmpeg has been killed');
                    // });
                    // console.log("Attemptint ot kill")
                    ffmpegCommand.kill();
                    // reject('timed out')
                  }, 4000, ffmpegCommand);

                  ffmpegCommand.pipe();
        });
        const works = await ffmpegPromise.catch(() => false)
        if (works === 'success') {
            testedClientArr.push(convertServerObjToClientObj(thisCam))
            testedServerObj[camera] = thisCam

            // Write to JSON files
            let stringifiedServerObjData = JSON.stringify(testedServerObj, null, 2);
            fs.writeFileSync(`./${thisCam.area}_server_tested.json`, stringifiedServerObjData);

            let stringifiedClientArrData = JSON.stringify(testedClientArr, null, 2);
            fs.writeFileSync(`./${thisCam.area}_client_tested.json`, stringifiedClientArrData);
        }
        console.log(`${numThatWork} / ${total} / ${objLength} || ${thisCam.id}, ${works}, ${thisCam.originalUrl}`)      
    }
}

checkCameras(atl_cameras)