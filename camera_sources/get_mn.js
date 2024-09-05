const fetch = require('node-fetch')
const fs = require('fs')

const allMnCams = []

fetch("https://511mn.org/api/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "language": "en",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "_gid=GA1.2.1802053146.1725478985; _gat_gtag_UA_44124103_34=1; _ga_NTNXEDRR02=GS1.1.1725478984.2.1.1725480008.0.0.0; _ga=GA1.2.528609706.1725341319",
    "Referer": "https://511mn.org/@-92.48172,47.20914,14?show=normalCameras",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "[{\"query\":\"query MapFeatures($input: MapFeaturesArgs!, $plowType: String) { mapFeaturesQuery(input: $input) { mapFeatures { bbox tooltip uri features { id geometry properties } ... on Sign { signDisplayType } ... on Event { priority } __typename ... on Camera { active views(limit: 100) { uri ... on CameraView { url } category } } ... on Plow { views(limit: 100, plowType: $plowType) { uri ... on PlowCameraView { url } category } } } error { message type } } }\",\"variables\":{\"input\":{\"north\":47.23313,\"south\":47.18327,\"east\":-92.44275,\"west\":-92.52069,\"zoom\":14,\"layerSlugs\":[\"normalCameras\"],\"nonClusterableUris\":[\"dashboard\"]},\"plowType\":\"plowCameras\"}},{\"query\":\"query Dashboard( $layerSlugs: [String!]! $nearbyViewLimit: Int! $isCamerasEnabled: Boolean! $showCameraCarousel: Boolean! $isLoggedIn: Boolean! $maxPriority: Int $showCommercialQuantities: Boolean! ) { dashboardQuery { cameraViewsPayload @include(if: $showCameraCarousel) { cameraViews { ...CameraViewContents } cameraViewType } cmsPayload { messages { uri title content displayLocations } campaigns { title content url displayLocations } } collections(layerSlugs: $layerSlugs, maxPriority: $maxPriority) { uri title cityReference bbox icon color ... on Event { agencyAttribution { agencyName agencyURL agencyIconURL } lastUpdated { timestamp timezone } beginTime { timestamp timezone } isWazeEvent priority quantities @include(if: $showCommercialQuantities) { label value icon } description ...DelayDescriptions } location { primaryLinearReference secondaryLinearReference } views(limit: $nearbyViewLimit, orderBy: NEAREST_ASC) @include(if: $isCamerasEnabled) { uri ... on CameraView { url } ... on PlowCameraView { url } ... on RestAreaView { url } parentCollection { uri location { primaryLinearReference } } } } favoritesPayload @include(if: $isLoggedIn) { favorites { uri ...FavoriteVisual ...AlertSchedule } error { type } } } } fragment CameraViewContents on CameraView { title category uri url sources { type src } parentCollection { uri bbox } } fragment FavoriteVisual on Favorite { id uri name bbox __typename ... on FavoriteArea { customAreaShapeSource } ... on FavoriteTrip { to from mode waypoints typicalGoogleTravelTimeSeconds } visual { id geometry properties } } fragment AlertSchedule on Favorite { alertSchedule { id alertingTimeInterval { startMillis endMillis } daysOfWeek lastUpdated { timestamp timezone } sendEmail sendSms } } fragment DelayDescriptions on Event { delayDescriptions { currentDelay routeDesignator direction delayTime timeColor qualifier segmentDelays { delayDescription segmentDescription isMultiSegmentEvent } } }\",\"variables\":{\"layerSlugs\":[\"constructionReports\",\"roadConditions\",\"ferryReports\",\"towingProhibitedReports\",\"truckersReports\",\"wazeReports\",\"weatherWarningsAreaEvents\",\"winterDriving\",\"roadReports\",\"wazeJams\",\"metroTrafficMap\",\"future\"],\"maxPriority\":1,\"nearbyViewLimit\":100,\"isCamerasEnabled\":true,\"showCameraCarousel\":true,\"isLoggedIn\":false,\"showCommercialQuantities\":false}}]",
  "method": "POST"
}).then(data => data.json()).then(data => {
  console.log(data[1])
  cameraViews = data[1].data.dashboardQuery.cameraViewsPayload.cameraViews
  // console.log(data[1].data.dashboardQuery.cameraViewsPayload)
  console.log("Camera views returned", cameraViews.length, cameraViews[0])
  // cameras = data.data.listCameraViewsQuery.cameraViews
  // console.log(cameras[0])
  //   let videos = 0
  //   let images = 0
  //   camera.forEach(camera => {

  //   })
  })

const fetchAllCams = async () => {

  let i = 0
  while (i < 19) {


  let result = await fetch("https://511mn.org/api/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "language": "en",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "_gid=GA1.2.1802053146.1725478985; _gat_gtag_UA_44124103_34=1; _ga=GA1.1.528609706.1725341319; _ga_NTNXEDRR02=GS1.1.1725478984.2.1.1725482295.0.0.0",
    "Referer": "https://511mn.org/list/cameras?sortDirection=DESC&sortBy=ROADWAY&page=1&pageRecordLimit=100",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": `{\"query\":\"query ($input: ListArgs!) { listCameraViewsQuery(input: $input) { cameraViews { category icon lastUpdated { timestamp timezone } title uri url sources { type src } parentCollection { title uri bbox icon color location { routeDesignator } lastUpdated { timestamp timezone } } } totalRecords error { message type } } }\",\"variables\":{\"input\":{\"west\":-180,\"south\":-85,\"east\":180,\"north\":85,\"sortDirection\":\"DESC\",\"sortType\":\"ROADWAY\",\"freeSearchTerm\":\"\",\"classificationsOrSlugs\":[],\"recordLimit\":100,\"recordOffset\":${i * 100}}}}`,
  "method": "POST"
}).then(data => data.json()).then(data => {
  console.log("\n\n\n\n\nLIST VIEW QUERY")
  let allCameras = data.data.listCameraViewsQuery
  console.log(Object.keys(allCameras))
  allCameras.cameraViews = allCameras.cameraViews.filter(camera => camera.category === "VIDEO")
  console.log(allCameras.cameraViews.length)
  console.log(allCameras.cameraViews[0])
  allMnCams.push(...allCameras.cameraViews)
  // console.log(data.data.listCameraViewsQuery)
  // console.log(data)
  // console.log(data[0].data.cameraQuery.camera.views)
  // console.log(data[1].data.dashboardQuery.cameraViewsPayload)
  // cameras = data.data.listCameraViewsQuery.cameraViews
  // console.log(cameras[0])
  //   let videos = 0
  //   let images = 0
  //   camera.forEach(camera => {

  //   })
  i++
  })

}
console.log(allMnCams)
console.log(allMnCams.length)
console.log(allMnCams[1800])
let stringifiedData = JSON.stringify(allMnCams)
fs.writeFileSync(`./mn_camera_list.json`, stringifiedData);
}

let getemall = fetchAllCams()


//   fetch("https://511mn.org/api/graphql", {
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
//     "cookie": "_gid=GA1.2.1802053146.1725478985; _ga=GA1.1.528609706.1725341319; _gat_gtag_UA_44124103_34=1; _ga_NTNXEDRR02=GS1.1.1725478984.2.1.1725481432.0.0.0",
//     "Referer": "https://511mn.org/camera/338910/@-92.23426,47.35575,9?show=normalCameras",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "[{\"query\":\"query Camera( $cameraId: ID! $layerSlugs: [String!]! $nearbyViewLimit: Int! $showCameraLastUpdated: Boolean! $isCamerasEnabled: Boolean! $showCommercialQuantities: Boolean! ) { cameraQuery(cameraId: $cameraId) { camera { uri title bbox agencyAttribution { agencyName } lastUpdated @include(if: $showCameraLastUpdated) { timestamp timezone } location { primaryLinearReference secondaryLinearReference } nearbyWeatherStation { uri status lastUpdated { timestamp timezone } description weatherStationFields drivingConditions { title description lastUpdated { timestamp timezone } icon color } } features { id geometry properties } ...Views ...NearbyResults } error { type } } } fragment Views on FeatureCollection { views(orderBy: LINEAR_REF_ASC) @include(if: $isCamerasEnabled) { uri title category __typename ... on RestAreaView { url isSatelliteView } ... on CameraView { url sources { type src } } ... on PlowCameraView { url } lastUpdated @include(if: $showCameraLastUpdated) { timestamp timezone } parentCollection { uri icon location { primaryLinearReference } } } } fragment NearbyResults on FeatureCollection { nearbyResults(layerSlugs: $layerSlugs) { __typename uri title cityReference bbox icon color location { primaryLinearReference secondaryLinearReference } ... on Event { quantities @include(if: $showCommercialQuantities) { label value icon } } views(limit: $nearbyViewLimit, orderBy: NEAREST_ASC) @include(if: $isCamerasEnabled) { uri category __typename ... on CameraView { url } ... on PlowCameraView { url } ... on SignComboView { imageUrl textJustification textLines } ... on SignTextView { textJustification textLines } ... on SignImageView { imageUrl } ... on SignOverlayView { travelTimes imageUrl imageLayout } ... on SignOverlayTPIMView { textLines imageUrl } parentCollection { uri location { primaryLinearReference } ... on Sign { signDisplayType signStatus gantrySigns { views { uri category title ... on SignImageView { imageUrl } } } } } } ... on RestArea { restAreaStatusSummary { header headerColor body bodyColor footer footerColor } } ... on Event { delayDescriptions { currentDelay routeDesignator direction delayTime timeColor qualifier segmentDelays { delayDescription segmentDescription isMultiSegmentEvent } } } } }\",\"variables\":{\"cameraId\":\"338910\",\"showCameraLastUpdated\":false,\"layerSlugs\":[\"normalCameras\"],\"nearbyViewLimit\":1,\"isCamerasEnabled\":true,\"showCommercialQuantities\":false}}]",
//   "method": "POST"
// }).then(data => data.json()).then(data => {
//   console.log("\n\n\n\n\n\nCAMERA SPECIFICI QUERY")
//   console.log(data[0].data.cameraQuery.camera)
//   console.log(data[0].data.cameraQuery.camera.features[0].geometry.coordinates)
//   // console.log(data[0].data.cameraQuery.camera.views)
//   // console.log(data[1].data.dashboardQuery.cameraViewsPayload)
//   // cameras = data.data.listCameraViewsQuery.cameraViews
//   // console.log(cameras[0])
//   //   let videos = 0
//   //   let images = 0
//   //   camera.forEach(camera => {

//   //   })
//   })

// // let totalMn = [];
// // let fetchThing = async (url) => {
// //   let i = 0
// //   while (i < 9) {

// //     const thing = await fetch("https://511mn.org/api/graphql", {
// //       "headers": {
// //         "accept": "*/*",
// //         "accept-language": "en-US,en;q=0.9",
// //         "content-type": "application/json",
// //         "language": "en",
// //         "priority": "u=1, i",
// //         "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
// //         "sec-ch-ua-mobile": "?0",
// //         "sec-ch-ua-platform": "\"macOS\"",
// //         "sec-fetch-dest": "empty",
// //         "sec-fetch-mode": "cors",
// //         "sec-fetch-site": "same-origin",
// //         "cookie": "_gid=GA1.2.1742875365.1725341319; _gat_gtag_UA_44124103_34=1; _ga=GA1.1.528609706.1725341319; _ga_NTNXEDRR02=GS1.1.1725341319.1.1.1725341359.0.0.0",
// //         "Referer": "https://511mn.org/list/cameras",
// //         "Referrer-Policy": "strict-origin-when-cross-origin"
// //       },
// //       "body": `{\"query\":\"query ($input: ListArgs!) { listCameraViewsQuery(input: $input) { cameraViews { category icon lastUpdated { timestamp timezone } title uri url sources { type src } parentCollection { title uri icon color location { routeDesignator } lastUpdated { timestamp timezone } } } totalRecords error { message type } } }\",\"variables\":{\"input\":{\"west\":-180,\"south\":-85,\"east\":180,\"north\":85,\"sortDirection\":\"DESC\",\"sortType\":\"ROADWAY\",\"freeSearchTerm\":\"\",\"classificationsOrSlugs\":[],\"recordLimit\":200,\"recordOffset\":${i * 200}}}}`,
// //       "method": "POST"
// //     })
// //         .then(res => res.json())
// //         .then(data => {
// //             console.log(data.data.listCameraViewsQuery.cameraViews)
// //             totalMn.push(...data.data.listCameraViewsQuery.cameraViews)
// //             i++
// //         })


//   }
//   let stringifiedData = JSON.stringify(totalMn, null, 2);
//   fs.writeFileSync(`./mn_camera_list.json`, stringifiedData);


// }

// fetchThing()


// const fetch = require('node-fetch');

// async function fetchAllCameraViewFields() {
//   const url = 'https://511mn.org/api/graphql';
//   const headers = {
//     'accept': '*/*',
//     'accept-language': 'en-US,en;q=0.9',
//     'content-type': 'application/json',
//     'language': 'en',
//     'priority': 'u=1, i',
//     'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"macOS"',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin',
//     'Referer': 'https://511mn.org/list/events',
//     'Referrer-Policy': 'strict-origin-when-cross-origin'
//   };

//   const body = JSON.stringify({
//     query: `
//       query ($input: ListArgs!) {
//         listCameraViewsQuery(input: $input) {
//           cameraViews {
//             __typename
//             ...on CameraView {
//               __typename
//               id
//               category
//               icon
//               lastUpdated {
//                 timestamp
//                 timezone
//               }
//               title
//               uri
//               url
//               sources {
//                 type
//                 src
//               }
//               parentCollection {
//                 title
//                 uri
//                 icon
//                 color
//                 location {
//                   routeDesignator
//                 }
//                 lastUpdated {
//                   timestamp
//                   timezone
//                 }
//               }
//               # Add any other known fields here
//             }
//           }
//           totalRecords
//           error {
//             message
//             type
//           }
//         }
//       }
//     `,
//     variables: {
//       input: {
//         west: -180,
//         south: -85,
//         east: 180,
//         north: 85,
//         sortDirection: "DESC",
//         sortType: "ROADWAY",
//         freeSearchTerm: "",
//         classificationsOrSlugs: [],
//         recordLimit: 25,
//         recordOffset: 0
//       }
//     }
//   });

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: headers,
//       body: body
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(JSON.stringify(data, null, 2));
//   } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }

// fetchAllCameraViewFields();