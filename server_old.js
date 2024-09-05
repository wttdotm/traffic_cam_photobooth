const express = require('express');
const path = require('path')
const app = express();
const port = 6969;
const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');

const atl_cameras = require('./server_lists/atl_server.json');
const sea_cameras = require('./server_lists/sea_server.json');


app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    console.error("error occurred", err.stack)
    res.status(500).send('Something broke!')
  })

app.get('/api/:area/:cameraID', (req, res) => {
    let cameraID = req.params.cameraID;
    let area = req.params.area;
    let cameraUrl;
    console.log(req.params)
    switch (area) {
        case 'sea':
            cameraUrl = sea_cameras[cameraID].liveCameraUrl;
            break;
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

    if (!cameraUrl) {
        return res.status(404).send('Camera not found');
    }

    console.log('Getting this camera URL:', cameraUrl);

    let ffmpegCommand;
    let clientAborted = false;

    // Listen for the client aborting the request
    req.on('aborted', () => {
        console.log("req, on clientaborted")
        clientAborted = true;
        if (ffmpegCommand) {
            ffmpegCommand.kill('SIGKILL'); // Kill the ffmpeg process
        }
    });

    const ffmpegPromise = new Promise((resolve, reject) => {
        let foundImage = true;
        ffmpegCommand = ffmpeg(`${cameraUrl}`)
            .frames(1)
            .outputOptions('-q:v 2')
            .format('image2pipe')
            .on('error', (err) => {
                if (!clientAborted) console.error(`Client aborted? ${clientAborted} || Error in ffmpeg on error:`, err);
                foundImage = false;
                // reject(err);
            })
            .on('end', () => {
                // res.writeHead(200, {
                //     'Content-Type': 'image/jpeg',
                // });
                if (foundImage && !clientAborted) {
                    resolve('success');
                } else (
                    console.log("client aborted??")
                )
            });

        ffmpegCommand.pipe(res);
    });

    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve('timeout');
        }, 5000);
    });

    Promise.race([ffmpegPromise, timeoutPromise])
        .then((result) => {
            console.log("RACE RESULT: ", result)
            if (result === 'sucess') {
                res.writeHead(200, {
                    'Content-Type': 'image/jpeg',
                });
                res.send()
            }
            if (result === 'timeout' && !clientAborted) {
                console.log('Returning fallback image due to timeout');
                res.sendFile(__dirname + '/assets/camera_unavail.png', (err) => {
                    if (err) {
                        console.error('Error sending fallback image:', err);
                        res.status(500).end();
                    }
                });
                if (ffmpegCommand) {
                    ffmpegCommand.kill('SIGKILL'); // Kill the ffmpeg process
                }
            }
        })
        .catch(() => {
            console.log("in catch of race")
            if (!clientAborted) {
                console.log("promise, catch, client aborted true")
                console.log('Error occurred, returning fallback image');
                res.sendFile(__dirname + '/assets/camera_unavail.png', (err) => {
                    if (err) {
                        console.error('Error sending fallback image:', err);
                        res.status(500).end();
                    }
                });
                if (ffmpegCommand) {
                    console.log("promise, catch, ffmpeg command true")
                    ffmpegCommand.kill('SIGKILL'); // Kill the ffmpeg process
                }
            } else (console.log("Client aborted in catch"))
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
