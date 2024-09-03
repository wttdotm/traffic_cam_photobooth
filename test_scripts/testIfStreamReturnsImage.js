const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch')

const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});
// console.log("fetch abourt error", fetch.AbortError)



const ffmpegPromise = (streamUrl) => {
 
    return new Promise((resolve, reject) => {
        let foundImage = false;
        ffmpegCommand = ffmpeg(streamUrl, {'timeout' : 3000})
            .frames(1)
            .outputOptions('-q:v 2')
            .format('image2pipe')
            .on('error', (err) => {
                let errMessage = `Error: ${err}`
                // console.error('Error:', err);
                if (errMessage.indexOf('SIGKILL') == -1) console.error('Error:', err);
                foundImage = false;
                reject(`err: ${err}`);
            })
            .on('end', () => {
                console.log("Resolving true")
                resolve(true)
            })
            // .run()
            

            setTimeout(function(ffmpegCommand) {
                // command.on('error', function() {
                //   console.log('Ffmpeg has been killed');
                // });
                // console.log("Attemptint ot kill")
                ffmpegCommand.kill();
                // reject('timed out')
            }, 5000, ffmpegCommand);

            ffmpegCommand.pipe()
    })

}
async function checkIfStreamReturnsImage (streamUrl, timeout) {
    // console.log("IN CHECKSTREAM")
        // console.log(atl_cameras[camera])
        let returnedData = await fetch(streamUrl, { agent, timeout: 3000 })
            // .then(res => res.json())
            .then(res => res.text())
            .then(res => {
                // console.log(res)
                result = res.indexOf("chunklist") > -1
                // console.log("result", result)
                console.log("Got URL, checking if image exists")
                // const works = await ffmpegPromise.catch(() => false)
            })
            .then(() => ffmpegPromise(streamUrl))
            .catch(err => {
                let result = false
                console.log("result", result, err)
                return false
            })
        // console.log("returning:", returnedData)
        return returnedData
            // .then(res =  > console.log(streamUrl, "FOR RES", res))
            // })


// KEEP THIS HERE FOR MORE ROBUST FFMPEG CHECK????
        
        const works = await ffmpegPromise.catch(() => false)
        return works
}   



// const ugh = async () => {
//     // let shouldBeTrue = await checkIfStreamReturnsImage('https://sfs-lr-34.dot.ga.gov:443/rtplive/ATL-CCTV-0985/playlist.m3u8')
//     let shouldBeTrue = await checkIfStreamReturnsImage('https://sfs-lr-39.dot.ga.gov:443/rtplive/COBB-CCTV-PowersFerryRd_InterstateNorthPkwy-1142-E/playlist.m3u8', 5000)
//     // let shouldBeFalse = await checkIfStreamReturnsImage('https://sfs-lr-33.dot.ga.gov:443/rtplive/ALPH-CCTV-0027/playlist.m3u8', 5000)
//     let shouldBeFalse = await checkIfStreamReturnsImage('https://sfs-lr-33.dot.ga.gov:443/rtplive/ALPH-CCTV-0027/playlist.m3u8', 5000)
//     console.log(`True ${shouldBeTrue} || False ${shouldBeFalse}`)
// }
// ugh()
module.exports = checkIfStreamReturnsImage