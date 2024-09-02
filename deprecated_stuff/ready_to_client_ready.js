const fs = require('fs')

const ready_to_convert = './atl_ready.json'
const ready_to_convert_obj = require(ready_to_convert)

let client_arr = []

// console.log(typeof ready_to_convert_obj)
const convert_ready_to_client = (cam) => {
    if (!cam.isAvailable) {
        return false
    } else {
        let newCam = {}
        newCam.id = cam.id
        newCam.name = cam.name
        newCam.latitude = cam.latitude
        newCam.longitude = cam.longitude
        newCam.area = cam.area
        newCam.imageUrl = cam.siteURL
        return newCam
    }
}

for (let camera in ready_to_convert_obj) {
    // console.log(camera)
    newCam = convert_ready_to_client(ready_to_convert_obj[camera])
    if (newCam) client_arr.push(newCam)
}


console.log(client_arr)
let writable_client_arr = JSON.stringify(client_arr)
fs.writeFile(`./${"atl"}_client_ready.json`, writable_client_arr, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfull
      console.log("file written successfully")
    }
  });