const fetch = require("node-fetch")
let allPACameras = []
const fs = require('fs')

async function fetchCams () {
    for (let i = 0; i < 14; i++) {
        
        let cams = await fetch(`https://www.511pa.com/List/GetData/Cameras?query=%7B%22columns%22%3A%5B%7B%22data%22%3Anull%2C%22name%22%3A%22%22%7D%2C%7B%22name%22%3A%22sortId%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22county%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadway%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22turnpikeOnly%22%2C%22search%22%3A%7B%22value%22%3A%22No%22%7D%7D%2C%7B%22name%22%3A%22name%22%7D%2C%7B%22name%22%3A%22description%22%7D%2C%7B%22data%22%3A7%2C%22name%22%3A%22%22%7D%5D%2C%22order%22%3A%5B%7B%22column%22%3A1%2C%22dir%22%3A%22asc%22%7D%2C%7B%22column%22%3A3%2C%22dir%22%3A%22asc%22%7D%5D%2C%22start%22%3A${i * 100}%2C%22length%22%3A100%2C%22search%22%3A%7B%22value%22%3A%22%22%7D%7D&lang=en-US`)
        .then(res => res.json())
    
        allPACameras.push(...cams.data)
        let stringified_pa_cams = JSON.stringify(allPACameras,  null, 2)
        fs.writeFileSync('./pa_cams.json', stringified_pa_cams)
    }
    console.log(allPACameras.length)
}

fetchCams()

// fs.writeFileSync('./pa_cams.json', stringified_pa_cams)