const fetch = require('node-fetch')
const fs = require('fs')


let fetchThing = async (url) => {

    const thing = await fetch("https://www.nvroads.com/map/mapIcons/Cameras", {
        "headers": {
          "__requestverificationtoken": "7AKH8qKBj_-6WtPpS9jViOnDHujHRm-lMbg-PLWlQ5QtVwuW-CWdTN8t2gwz1GC_NBJJ7H5a2Nt_1qvvMtF-X3F4v8c1",
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "session-id=60F8DD216A9E22FBFE908FBBDF6378EF0A3C22A9AF9C3C1055F36B562DBE8FC017085FD193A1D27EEDAE8230087FF719E650BA7D7923C470C83F427C8F2E13FD1948F78B17AF2DEFA492064F362DE1D5BD0D346D21B3C3981E59CA967744316C55059CF5C60841BDF3C87E482D618779784BB8AEF1846CE76894DF120CAEC787; _culture=en-US; session=session; __RequestVerificationToken=ueUZBr1bOhULR4WQhgu-V2LoYVNpc524P9s4vzKV45mzbKfpeYlEcdoUkpuYMsgpinjZph-af6JaWSH1ZDONvBmxIEQ1; FeatureSlideModalVersion=1; _gid=GA1.2.96079209.1725298010; _ga_FLY6HVR68T=GS1.1.1725298010.3.1.1725298287.0.0.0; _ga=GA1.2.620205228.1724377824; _ga_FMGM2F0ZXB=GS1.2.1725298010.2.1.1725298287.0.0.0; map={%22selectedLayers%22:[%22TrafficSpeeds%22%2C%22Incidents%22%2C%22Construction%22%2C%22Closures%22%2C%22Cameras%22]%2C%22prevZoom%22:10%2C%22prevLatLng%22:[35.988475914615165%2C-115.19438028689092]%2C%22mapView%22:%222024-09-02T17:39:30.663Z%22}",
          "Referer": "https://www.nvroads.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      })
        .then(res => res.json())
        .then(data => {
            console.log(data.item2.length)
            let stringifiedData = JSON.stringify(data.item2, null, 2);
            fs.writeFileSync(`./nv_camera_list.json`, stringifiedData);
        })


}

fetchThing()