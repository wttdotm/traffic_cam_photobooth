const fs = require('fs')
const atl_data = require('./atl_enriched.json')

let finalATL = {}

class Camera {
    constructor(camera){
        this.id = camera.id
        this.name = camera.title || false
        this.latitude = camera.location[0]
        this.longitude = camera.location[1]
        this.liveCameraUrl = camera.videoURL || false
        this.siteURL = `/atl/${this.id}`
    }
}

for (let camera of atl_data) {
    console.log(camera)
    finalATL[camera.id] = new Camera(camera)
}

console.log(finalATL)

const atl_ready = JSON.stringify(finalATL)

fs.writeFile('./atl_ready.json', atl_ready, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfull
      console.log("file written successfully")
    }
  });