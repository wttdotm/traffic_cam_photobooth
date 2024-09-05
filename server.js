const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 6969;

const atl_cameras = require('./server_lists/atl_server.json');
// const az_cameras = require('./server_lists/az_server.json');
const mn_cameras = require('./server_lists/mn_server.json');
const md_cameras = require('./server_lists/md_server.json');
// const sea_cameras = require('./server_lists/sea_server.json');

app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).send('Something broke!');
});

// Helper function to get camera URL
function getCameraUrl(area, cameraID) {
    let cameraUrl
    switch (area) {
        // case 'sea':
        //     console.log(cameraID)
        //     console.log(sea_cameras[cameraID])
        //     cameraUrl = sea_cameras[cameraID].liveCameraUrl;

        //     break;
        case 'atl':
            cameraUrl = atl_cameras[cameraID].liveCameraUrl;
            break;
        case 'mn':
            cameraUrl = mn_cameras[cameraID].liveCameraUrl;
            break
        case 'md':
            cameraUrl = md_cameras[cameraID].liveCameraUrl
            break
        case 'az':
            cameraUrl = az_cameras[cameraID].liveCameraUrl
            break
    }
//   const cameras = area === 'sea' ? sea_cameras : atl_cameras;
  return cameraUrl ? cameraUrl : false
}

app.get('/api/:area/:cameraID', async (req, res) => {
  const { area, cameraID } = req.params;
  const cameraUrl = getCameraUrl(area, cameraID);

  if (!cameraUrl) {
    return res.status(404).send('Camera not found');
  }

  console.log('Getting this camera URL:', cameraUrl);

  res.writeHead(200, { 'Content-Type': 'image/jpeg' });

  ffmpeg(cameraUrl, {timeout : 5})
//   ffmpeg(cameraUrl, {timeout : 5})
    .inputOptions('-nostdin')
    .outputOptions([
      '-frames:v 1',  // Capture only one frame
      '-q:v 2',       // Set quality
      '-f image2pipe',  // Output to pipe
      '-vcodec mjpeg'   // Use MJPEG codec for compatibility
    ])
    .on('error', (err) => {
      console.error('FFmpeg error:', err);
      sendFallbackImage(res);
    })
    .pipe(res, { end: true });
});

function sendFallbackImage(res) {
  const fallbackPath = path.join(__dirname, 'assets', 'camera_unavail.png');
  res.sendFile(fallbackPath, (err) => {
    if (err) {
      console.error('Error sending fallback image:', err);
      res.status(500).end();
    }
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});