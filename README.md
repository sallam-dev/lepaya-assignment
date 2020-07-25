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
- The assignment did not specify a range for the numbers. The the cards range is assumed to be from **1 to 100**.
- The optional bonus of **showing the history of turns** did not specify when should that history be shown. So the decision was made to view the history is shown since the first turn.
- The assignment did not specify the shape of the backend response. So the decision was made to include the solution with the generated random cards.
- No specific deployment mechanism was required, so Docker containers ware used for portability.
- There was no rule stating that card numbers should be unique, but the decision was made to ensure they are unique sense it seemed the sensible option.

## Solution Architecture
It's important to note that the backend server is the same server hosting the client static files. This is done to speed up the development. Ideally, the client files would be served by Nginx or a CDN in a production environment

### Backend Architecture
- `server` is an abstraction for the server to ease the bootstrapping and registration of routes.
- `processors` contains the business logic related to each endpoint. It can depend on repositories for data.persistance.
- `models` this is where all the models introduced by the developer reside, they are simple POJOs without any dependency.
- `repositories` **NOT UTILIZED** this holds the implementation details for data persistance and fetching. This was not utilized in the solution due to time constraints. Repositories can depend on models.
- `utilities` hold miscellaneous stuff like loggers, mathematical functions and stuff that don't belong to any of the previous layers.

### Frontend Architecture
- `gateways` hold the implementation for IO whether that is network, filesystem, database... etc.
- `repositories` are responsible for data persistance as in the backend and they can depend on gateways.
- `presenters` hold the business logic for the frontend. A presenter can be for a whole screen or a part of the screen depending on the complexity.
- `models` are POJOs that are controlled by the developer, this allows a level of isolation between the backend responses and the models appropriate for the frontend.

## Dependencies
### Backend
- `express` chosen because its been around for a long time, so it's stable with good library ecosystem and most likely familiar to other developers.
- `cors, body-parser` are the goto middlewares for parsing requests and working with cors headers.
- `typescript` is used as it helps with type definitions and type-checking and allows for better refactoring capabilities.

### Frontend
- `vue` was used as this is the expected technology stack for the position and the UI framework I'm mostly productive with.
- `typescript` is used for the same reason in the backend.

## Improvement and Features
### User Improvements
- Better visual design.
- Responsive design scaling from mobile to desktops.
- The ability to cancel a current game and start over.
- Alerting the user when he makes a wrong move.
- Allowing the user to rollback a bad move and correct it for a limited number of times.

### Technical Improvements
- Proper logging in the backend.
- Health and readiness endpoints for the backend to prepare it for cloud native environments.
- Depending on the need, there might be rate limiting for the API calls.
- Application token to identify which app is utilizing the backend.
- Logging request/response to allow for monitoring service quality (Response times, error rates).
- Introduce test coverage and set minimum thresholds.
- More tests for the codebase for better coverage.
- Refactoring the code of the backend so it aligns more with the intended architecture.
- Proper observable implementation for the frontend instead of the ad-hoc one.
- Better CSS code in the vue components.
- Might consider SSR depending on the need of the business.
- Better error handling for the client
