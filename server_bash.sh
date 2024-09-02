#!/bin/bash

PORT=6969
ATL_CAMERAS="./server_lists/atl_server.json"
SEA_CAMERAS="./server_lists/sea_server.json"

# Function to get camera URL from JSON file
get_camera_url() {
    local area="$1"
    local camera_id="$2"
    local json_file

    case "$area" in
        sea) json_file="$SEA_CAMERAS" ;;
        atl) json_file="$ATL_CAMERAS" ;;
        *) echo "Invalid area"; exit 1 ;;
    esac

    jq -r ".[\"$camera_id\"].liveCameraUrl" "$json_file"
}

# Function to handle Ctrl+C
cleanup() {
    echo -e "\nShutting down server..."
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

echo "Server starting on port $PORT. Press Ctrl+C to stop."

# Start a simple HTTP server
while true; do
    { echo -e "HTTP/1.1 200 OK\r\nContent-Type: image/jpeg\r\n\r\n"; cat -; } | nc -l -p $PORT | (
        read request
        if [[ "$request" =~ ^GET\ /([^/]+)/([^/\ ]+) ]]; then
            area="${BASH_REMATCH[1]}"
            camera_id="${BASH_REMATCH[2]}"
            
            camera_url=$(get_camera_url "$area" "$camera_id")
            echo "Getting camera URL: $camera_url" >&2

            ffmpeg -i "$camera_url" -frames:v 1 -q:v 2 -f image2pipe -
        else
            echo "HTTP/1.1 404 Not Found"
            echo "Content-Type: text/plain"
            echo
            echo "404 Not Found"
        fi
    ) &
    wait $!
done