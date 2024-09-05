const fetch = require('node-fetch')
const fs = require('fs')

let totalAz = [];
let fetchThing = async (url) => {
  let i = 0
  while (i < 6) {

    const thing = await fetch(`https://www.az511.com/List/GetData/Cameras?query=%7B%22columns%22%3A%5B%7B%22data%22%3Anull%2C%22name%22%3A%22%22%7D%2C%7B%22name%22%3A%22sortId%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22cityName%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadway%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadNumber%22%7D%2C%7B%22data%22%3A5%2C%22name%22%3A%22%22%7D%5D%2C%22order%22%3A%5B%7B%22column%22%3A1%2C%22dir%22%3A%22asc%22%7D%2C%7B%22column%22%3A3%2C%22dir%22%3A%22asc%22%7D%5D%2C%22start%22%3A${i * 100}%2C%22length%22%3A100%2C%22search%22%3A%7B%22value%22%3A%22%22%7D%7D&lang=en-US`, {
      "headers": {
        "__requestverificationtoken": "NbyuTaIdrJLlX_ITWskZJyrSNAQeEpSL0dsqhYk1hMDSHkxCYZg9yyEOhFn-lacSZocKzHw0NxsuM535SaEXZIknn2Q1",
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "x-requested-with": "XMLHttpRequest",
        "Referer": "https://www.az511.com/cctv?start=0&length=10&order%5Bi%5D=1&order%5Bdir%5D=asc",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    })
        .then(res => res.json())
        .then(data => {
          console.log(Object.keys(data))
          console.log(data.data.length)
          console.log(data.data[0])
          totalAz.push(...data.data)

            // console.log(data.data.listCameraViewsQuery.cameraViews)
            // console.log(data.data.listCameraViewsQuery.cameraViews)
            // totalMn.push(...data.data.listCameraViewsQuery.cameraViews)
            i++
        })


  }
  let stringifiedData = JSON.stringify(totalAz, null, 2);
  fs.writeFileSync(`./az_camera_list.json`, stringifiedData);


}

fetchThing()