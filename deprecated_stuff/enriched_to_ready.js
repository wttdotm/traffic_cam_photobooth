const fs = require('fs')
const city = "atl"
const enriched_data_path = `./${city}_enriched.json`
const enriched_data = require('./atl_enriched.json')


let finalCity = {}

class Camera {
    constructor(camera){
        this.id = camera.id
        this.area = city
        this.isAvailable = camera.videoURL && camera.isAvailable ? true : false
        this.name = camera.title || false
        this.latitude = camera.location[0]
        this.longitude = camera.location[1]
        this.liveCameraUrl = camera.videoURL || false
        this.siteURL = `/${city}/${this.id}`
    }
}

for (let camera of enriched_data) {
    console.log(camera)
    finalCity[camera.id] = new Camera(camera)

}

console.log(finalCity)

const atl_ready = JSON.stringify(finalCity)

fs.writeFile(`./${city}_ready.json`, atl_ready, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfull
      console.log("file written successfully")
    }
  });