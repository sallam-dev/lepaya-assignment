# Lepaya Assignment - Memory Game
This repo is contains Mohamed Sallam's solution for the interview assignment

## How to run this project
First, you'll need to install Docker, if you don't have that refer to [their documentation](https://docs.docker.com/get-docker/) to install it. It highly depends on your operating system

### Build
Make sure you're in your project directory, and enter the following command to build the docker image
```
docker build -t lepaya-sallam:latest .
```

### Run
To run a docker container based on the previously built image, run the following command **(don't close your terminal window)**
```
docker run --publish 7071:9090 lepaya-sallam:latest
```
If you would like to run the docker container in the background (detached mode) and not have it tied to your terminal window enter the following command
```
docker run --name lepaya-sallam-interview --detach --publish 7071:9090 lepaya-sallam:latest
```

You should now be able to test the application in your browser using the following link
```
http://localhost:7071/app
```
## Assumptions made for the project


## Solution Architecture


## Dependencies

## What could be improved
