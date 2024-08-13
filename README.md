# Repo for TrafficCamPhotobooth.com

## Press coverage for TrafficCamPhotobooth.com
- [NBC](https://www.nbcnewyork.com/news/local/how-to-take-selfies-with-new-york-citys-traffic-cameras/5698806/)
- [NY Post](https://nypost.com/2024/08/11/us-news/new-web-site-lets-nyers-use-traffic-cams-to-turn-streets-into-instant-photo-booths/)
- [NY1](https://ny1.com/nyc/all-boroughs/mornings-on-1/2024/08/13/brooklyn-artist-uses-traffic-cameras-for-unique-selfies-across-nyc)
- [Fox 5 NY](https://www.fox5ny.com/news/nyc-traffic-cam-photobooth-selfie)
- [ABC](https://abc7ny.com/videoClip/fire-commissioner-fdny-robert-tucker-nyc/15178890/) (starts at ~17min)
- [Jalopnik](https://jalopnik.com/art-project-turns-new-yorks-dystopian-traffic-surveilla-1851619333)
- [PetaPixel](https://petapixel.com/2024/08/12/website-turns-traffic-cameras-into-photobooths-on-the-street/)

## Contributing:
I'm happy to accept PRs for this project, and this is a good time to write out some basic guidelines for doing so.

Here is the basic stuff to keep in mind:

*Static Site*: In general, the site is completely static. It does not have a server, nor do I want to run one. Everything served on the site needs to be already accessible online from a simple GET request. As it stands now, the way images update is just by refreshing the src attribute of <img> tags.

*Camera Data*: All cameras should be passed in one big object where they are used. If you see a significant performance drop, you can separate out the allCameras object into a separate js file, but the user's device will be responsible for processing that entire list one way or another. This allows the site to find the cameras nearest to the user without their location leaving their device, which is important for user privacy. Every camera needs (at the very least): a name, lat/long coordinates, and an image URL for their feed, following the existing cameras in allCameras. Also, camera IDs are passed via URL parameters from one page to another. Keep this pattern.

Slowly updating cameras are not a good experience for the user, and I do not want to create a site that encourages people to stand in the street for minutes at a time. With a PR, please provide how often the images (or video) from the cameras will update. Any image refresh rate slower than 15s is probably not worth putting on. (I know this disqualifies many cities, but that's somewhat unavoidable.)