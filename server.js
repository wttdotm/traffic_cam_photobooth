const express = require('express');
const fs = require('fs')
const fileUpload = require('express-fileupload');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const multer = require("multer");
const glob = require('glob')




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

const port = 6969;

const atl_cameras = require('./server_lists/atl_server.json');
// const az_cameras = require('./server_lists/az_server.json');
const mn_cameras = require('./server_lists/mn_server.json');
const md_cameras = require('./server_lists/md_server.json');
// const sea_cameras = require('./server_lists/sea_server.json');
const ott_cameras = require("./server_lists/ott_server.json");

app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
// app.set('view engine', 'ejs');
app.get(["/sweetstreams", "/sweetstreams/"], (req, res) => {
  console.log("Incoming request to /sweetstreams");
  console.log("Headers:", req.headers);
  console.log("Full URL:", req.protocol + '://' + req.get('host') + req.originalUrl);
  res.redirect("/sweetstreams.html");
});

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
        case 'ott':
            cameraUrl = ott_cameras[cameraID].liveCameraUrl
            break
    }
//   const cameras = area === 'sea' ? sea_cameras : atl_cameras;
  return cameraUrl ? cameraUrl : false
}

// app.get('/mudSurveillance', (req, res) => {
//   res.render('views/about');
// });

app.post('/upload', (req, res) => {
  // Log the files to the console
  console.log(req.files);

  const { file } = req.files;
  console.log(file)

  // If no image submitted, exit
  if (!file) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  file.mv(__dirname + '/upload/' + Date.now() + file.name);

  // res.sendStatus(200);
  res.redirect('back');


});

// app.get('/remove/:filename', (req, res) => {
//   console.log(req.params)
//   console.log(req.query)
// })

app.get('/api/mostRecent', (req, res) => {
  const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
  };

  const orderReccentFiles = (dir) => {
      return fs.readdirSync(dir)
          .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
          .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };
  const mostRecent = getMostRecentFile('./upload/')
  console.log("SENDING THIS FILE BACK", mostRecent)
  res.sendFile(`${__dirname}/upload/${mostRecent.file}`)

  // console.log("this is most recent file", getMostRecentFile('./upload/'))
})


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