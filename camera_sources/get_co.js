const fetch = require('node-fetch')
const fs = require('fs')




// const coStuff = fetch("https://maps.cotrip.org/api/graphql", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "content-type": "application/json",
//     "language": "en",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "cookie": "_ga=GA1.1.555772429.1725473827; _ga_G221BGV94P=GS1.1.1725473826.1.1.1725474359.0.0.0",
//     "Referer": "https://maps.cotrip.org/list/cameras?sortDirection=DESC&sortBy=ROADWAY&page=1&pageRecordLimit=100",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "{\"query\":\"query ($input: ListArgs!) { listCameraViewsQuery(input: $input) { cameraViews { category icon lastUpdated { timestamp timezone } title uri url sources { type src } parentCollection { title uri icon color location { routeDesignator } lastUpdated { timestamp timezone } } } totalRecords error { message type } } }\",\"variables\":{\"input\":{\"west\":-180,\"south\":-85,\"east\":180,\"north\":85,\"sortDirection\":\"DESC\",\"sortType\":\"ROADWAY\",\"freeSearchTerm\":\"\",\"classificationsOrSlugs\":[],\"recordLimit\":100,\"recordOffset\":0}}}",
//   "method": "POST"
// }).then(data => data.json()).then(data => console.log(data))


query GetCameraData($input: MapFeaturesArgs!) {
  mapFeaturesQuery(input: $input) {
    mapFeatures {
      features {
        id
        geometry
        properties {
          name
        }
        ... on Camera {
          active
          views(limit: 5) {
            uri
            ... on CameraView {
              url
              category
            }
          }
        }
      }
    }
  }
}


const fetchCameraData = async (bounds) => {
  const response = await fetch("https://maps.cotrip.org/api/features", {
    headers: {
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/json",
      "Language": "en",
      "Priority": "u=1, i",
      "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": "\"macOS\"",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Cookie": "_ga=GA1.1.555772429.1725473827; _ga_G221BGV94P=GS1.1.1725473826.1.1.1725474781.0.0.0",
      "Referer": "https://maps.cotrip.org/@-103.50271,39.36698,9?show=normalCameras,weatherWarnings",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    method: "POST",
    body: JSON.stringify({
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west,
      zoom: 9,
      layerSlugs: ["normalCameras", "weatherWarnings"],
      nonClusterableUris: ["dashboard"]
    })
  });

  const data = await response.json();

  return data.features.filter((feature) => feature.type === "Camera").map((camera) => ({
    id: camera.id,
    name: camera.properties.name,
    geometry: camera.geometry,
    uri: camera.uri,
    url: camera.views[0].url,
    category: camera.views[0].category
  }));
};

// let totalAz = [];
// let fetchThing = async (url) => {
//   let i = 0
//   while (i < 6) {

//     const thing = await fetch(`https://www.az511.com/List/GetData/Cameras?query=%7B%22columns%22%3A%5B%7B%22data%22%3Anull%2C%22name%22%3A%22%22%7D%2C%7B%22name%22%3A%22sortId%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22cityName%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadway%22%2C%22s%22%3Atrue%7D%2C%7B%22name%22%3A%22roadNumber%22%7D%2C%7B%22data%22%3A5%2C%22name%22%3A%22%22%7D%5D%2C%22order%22%3A%5B%7B%22column%22%3A1%2C%22dir%22%3A%22asc%22%7D%2C%7B%22column%22%3A3%2C%22dir%22%3A%22asc%22%7D%5D%2C%22start%22%3A${i * 100}%2C%22length%22%3A100%2C%22search%22%3A%7B%22value%22%3A%22%22%7D%7D&lang=en-US`, {
//       "headers": {
//         "__requestverificationtoken": "NbyuTaIdrJLlX_ITWskZJyrSNAQeEpSL0dsqhYk1hMDSHkxCYZg9yyEOhFn-lacSZocKzHw0NxsuM535SaEXZIknn2Q1",
//         "accept": "application/json, text/javascript, */*; q=0.01",
//         "content-type": "application/json",
//         "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"macOS\"",
//         "x-requested-with": "XMLHttpRequest",
//         "Referer": "https://www.az511.com/cctv?start=0&length=10&order%5Bi%5D=1&order%5Bdir%5D=asc",
//         "Referrer-Policy": "strict-origin-when-cross-origin"
//       },
//       "body": null,
//       "method": "GET"
//     })
//         .then(res => res.json())
//         .then(data => {
//           console.log(Object.keys(data))
//           console.log(data.data.length)
//           console.log(data.data[0])
//           totalAz.push(...data.data)

//             // console.log(data.data.listCameraViewsQuery.cameraViews)
//             // console.log(data.data.listCameraViewsQuery.cameraViews)
//             // totalMn.push(...data.data.listCameraViewsQuery.cameraViews)
//             i++
//         })


//   }
//   let stringifiedData = JSON.stringify(totalAz, null, 2);
//   fs.writeFileSync(`./az_camera_list.json`, stringifiedData);


// }

// fetchThing()