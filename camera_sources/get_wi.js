const fetch = require('node-fetch')
const fs = require('fs')

let totalWi = [];
let fetchThing = async (url) => {
  console.log('in detch thing')
  let i = 0
  while (i < 5) {
    console.log("i", i)
    const thing = await fetch(`https://511wi.gov/List/GetData/Cameras?query=%7B%22columns%22%3A%5B%7B%22data%22%3Anull%2C%22name%22%3A%22%22%7D%2C%7B%22name%22%3A%22sortId%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22region%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22county%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadway%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22description1%22%7D%2C%7B%22data%22%3A6%2C%22name%22%3A%22%22%7D%5D%2C%22order%22%3A%5B%7B%22column%22%3A1%2C%22dir%22%3A%22asc%22%7D%2C%7B%22column%22%3A4%2C%22dir%22%3A%22asc%22%7D%5D%2C%22start%22%3A${i * 100}%2C%22length%22%3A100%2C%22search%22%3A%7B%22value%22%3A%22%22%7D%7D&lang=en-US`, {
        "headers": {
          "__requestverificationtoken": "4CTWi7pFMASzm4BifYxrhikYYXNdo3l5TnUr7tQMDATonKGRMQWCylNe9wL8RrSBv-TSl88vfD_zOnBybApJSLl1NlQ1",
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "if-modified-since": "Wed, 04 Sep 2024 18:15:25 GMT",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "session-id=023C5CC2747E05716C553EDA6AC4303C4CCE7B45F5E5E07EB023577529041C894E43E0120FC889E5FEBC25A395383C7F8D28FF4BA355727F802FD1366F35B34640A4CBA78C498CE1EA59F246685FB9EB89AFC535B6E1B95D487C8B0A126DD665BA79200DF1425E8F2B34F8DA380D0023BF14251EAF9576EEAAF59438DF12A3B7; _culture=en-US; session=session; __RequestVerificationToken=7_RQzB7wejHGykvVn4fwFXKKzmi7vNMI2hZjzUmF0BmGRhWi3aCc-7_aOwhpXoCupLPvGvoK76byvnmf51yF6oHDcBs1; _gid=GA1.2.1523504959.1725473707; _gat=1; _ga=GA1.1.1114541017.1725473707; _ga_GP0H11H7M9=GS1.1.1725473707.1.1.1725475496.0.0.0",
          "Referer": "https://511wi.gov/cctv?start=0&length=10&order%5Bi%5D=1&order%5Bdir%5D=asc",
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
          totalWi.push(...data.data)

            // console.log(data.data.listCameraViewsQuery.cameraViews)
            // console.log(data.data.listCameraViewsQuery.cameraViews)
            // totalMn.push(...data.data.listCameraViewsQuery.cameraViews)
            i++
        })


  }
  let stringifiedData = JSON.stringify(totalWi, null, 2);
  fs.writeFileSync(`./wi_camera_list.json`, stringifiedData);


}

fetchThing()