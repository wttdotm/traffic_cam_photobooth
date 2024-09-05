# YOU ARE ON THE _*SERVER*_ BRANCH

# Repo for TrafficCamPhotobooth.com

# How this site works

This site used to be completely static. In order to add more cities, I have changed it over to an Express server running on a digital ocean droplet. The one and only change this enables - aside from DO serving the still entirely static frontend instead of GH pages - is that it allows me to "host" images from other cities' video-based traffic cameras by providing an endpoint that, when requested, used ffmpeg to grab a screenshot of the livestream and return it as an image to the user's browser.

# How to contribute a city

A city needs two things to be added to the site: a client array of cameras and a server object of cameras. The client array is imported into the `findCameras.html` page on load as a `<script src="[city]_client.js"></script>` tag and contains an array of objects that have each camera's name, area/city, lat/long coordinates, and serverUrl. The server object is a big JSON of key-value pair of camera IDs as keys and the camera objects they refer to as object. More about what these look like can be found by opening any of the lists in `./public/client_lists` for the client arrays or `./server_lists/` for the server jsons.

To contribute a city, you need to do four things:cr
1 - Find out if your city or area has a large list of m3u8 live video streams (for example, [Arizona](https://www.az511.com/) does)
2 - Scrape all of the cameras into a big list (there are some example scripts in varying states of working in `./scrape_scripts`)
3 - Validate which cameras work and which do not (I need to provide a better script here)
4 - Use the validated server list to create a validated client list

Once you have a valid server object and client list that _*has been tested*_, you should add them to `./public/client_lists` for the client arrays or `./server_lists/` for the server jsons and submit a PR. Please provide the output of the `validate_server_and_create_client.js` output with your PR.


The getCameraInfo function is pretty robust at this point. 
### Next Cities to add
[ ] NV https://www.nvroads.com/
[ ] MN https://511mn.org/list/cameras
[ ] NY (full)
[ ] MD / DC https://chart.maryland.gov/TrafficCameras/GetTrafficCameras
[ ] WI https://511wi.gov/cctv?start=0&length=10&order%5Bi%5D=1&order%5Bdir%5D=asc
[ ] CO https://maps.cotrip.org/list/cameras


## Press coverage for TrafficCamPhotobooth.com
- [NBC](https://www.nbcnewyork.com/news/local/how-to-take-selfies-with-new-york-citys-traffic-cameras/5698806/)
- [NY Post](https://nypost.com/2024/08/11/us-news/new-web-site-lets-nyers-use-traffic-cams-to-turn-streets-into-instant-photo-booths/)
- [NY1](https://ny1.com/nyc/all-boroughs/mornings-on-1/2024/08/13/brooklyn-artist-uses-traffic-cameras-for-unique-selfies-across-nyc)
- [Fox 5 NY](https://www.fox5ny.com/news/nyc-traffic-cam-photobooth-selfie)
- [ABC](https://abc7ny.com/videoClip/fire-commissioner-fdny-robert-tucker-nyc/15178890/) (starts at ~17min)
- [Jalopnik](https://jalopnik.com/art-project-turns-new-yorks-dystopian-traffic-surveilla-1851619333)
- [PetaPixel](https://petapixel.com/2024/08/12/website-turns-traffic-cameras-into-photobooths-on-the-street/)

## Contributing:
I'm happy to accept PRs for this project, here are some basic guidelines for doing so.

Here is the basic stuff to keep in mind:

- *Static Site*: In general, the site is completely static. It does not have a server, nor do I want to run one. Everything served on the site needs to be already accessible online from a simple GET request. As it stands now, the way images update is just by refreshing the `src` attribute of `<img>` tags.

- *Camera Data*: All cameras should be passed in one big object where they are used. If you see a significant performance drop, you can separate out the allCameras object into a separate js file, but the user's device will be responsible for processing that entire list one way or another. This allows the site to find the cameras nearest to the user without their location leaving their device, which is important for user privacy. Every camera needs (at the very least): a name, lat/long coordinates, and an image URL for their feed, following the existing cameras in allCameras. Also, camera IDs are passed via URL parameters from one page to another. Keep this pattern.

- *Camera Update Speed*: Slowly updating cameras are not a good experience for the user, and I do not want to create a site that encourages people to stand in the street for minutes at a time. With a PR, please provide how often the images (or video) from the cameras will update. Any image refresh rate slower than 15s is probably not worth putting on. 

I understand that these place some restrictions on which cities can reasonably be added. For a project like this, a free site that always works well and can live forever is better than one with more features that costs money and needs to be maintained.

Other than that, go wild. Just fork it, build it out, and submit :)