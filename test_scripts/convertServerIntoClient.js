const express = require('express');
const app = express();
const port = 6969;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const testIfStreamReturnsImage = require('./testIfStreamReturnsImage.js')
console.log(testIfStreamReturnsImage)
const cors = require('cors');
// const atl_cameras = require('../server_lists/atl_server.json');
// const sea_cameras = require('../server_lists/sea_server.json');
// const mn_cameras = require('../camera_sources/mn_server_initial.json');
const md_cameras = require('../camera_sources/md_server_initial.json');

const testedClientArr = []

let area = 'md'

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

function checkCameras (cameraObj) {
    for (let camera in cameraObj) {
            let thisCam = cameraObj[camera]
            testedClientArr.push(convertServerObjToClientObj(thisCam))

        } 
    }


checkCameras(md_cameras)

let stringifiedClientArrData = JSON.stringify(testedClientArr, null, 2);
fs.writeFileSync(`./${area}_client_testing.json`, stringifiedClientArrData);