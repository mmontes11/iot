#!/bin/bash

set -e

docker-compose up -d

tmux new-session -d -s iot
tab=0

function new_tab() {
    name="$1"
    path="$2"
    tab=$(($tab + 1))
    tmux new-window -t iot:"$tab" -n "$name"
    tmux send-keys -t iot:"$tab" "cd $path; npm start" enter
}

for ms in $(ls -d packages/*); do
    name=$(basename "$ms")
    path="$ms"
    new_tab "$name" "$path"
done

tmux rename-window -t iot:0 'workspace'
tmux select-window -t iot:0

tmux attach -t iot
