const express = require('express')
const app = express()
const port = 6969
const ffmpeg = require('fluent-ffmpeg');
const { Writable } = require('stream');
const command = ffmpeg();
const fs = require('fs')
// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');

const atl_cameras = require('./atl_ready.json');

let atl_cameras_checked = [];

async function processCamera(camera) {
    return new Promise((resolve) => {
        if (!camera.liveCameraUrl) {
            camera.liveFeedWorks = false;
            atl_cameras_checked.push(camera);
            console.log(camera.id, "has no liveFeed")
            resolve(); // Resolve immediately if there's no URL
        } else {
            ffmpeg(camera.liveCameraUrl)
                .frames(1)
                .outputOptions('-q:v 2')
                .format('image2pipe')
                .on('error', (err) => {
                    camera.liveFeedWorks = false;
                    atl_cameras_checked.push(camera);
                    console.error('Error:', err);
                    resolve(); // Resolve the promise on error
                })
                .on('end', () => {
                    camera.liveFeedWorks = true;
                    atl_cameras_checked.push(camera);
                    console.log('Image captured successfully');
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
        if (totalCameras < 1000) {
            const camera = cameras[thiscamera];
            console.log(`new seq camera (${totalCameras} / 1000)`, thiscamera)
            await processCamera(camera); // Wait for the camera to be processed before moving to the next
        }
    }

    let checkedCameras = JSON.stringify(atl_cameras_checked, null, 2);
    fs.writeFile('./atl_checked_2.json', checkedCameras, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("file written successfully");
        }
    });
}

processCamerasSequentially(atl_cameras);
