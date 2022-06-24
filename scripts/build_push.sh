cd .

docker build -t loserforever/multi-client ./client
docker build -t loserforever/multi-server ./server
docker build -t loserforever/multi-worker ./worker

docker push loserforever/multi-client
docker push loserforever/multi-server
docker push loserforever/multi-worker