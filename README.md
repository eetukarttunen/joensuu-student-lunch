# Student Restaurant Menus

A website that uses [Fazer & CO. (Compass Group) API](https://www.compass-group.fi/) to show all student restaurant menus in a certain area on the same page. This project makes it easier for users to find out which restaurant to visit for lunch, without having to visit every restaurant homepage.

## Technologies Used

- React
- Node.js
- Express
- Jest
- Docker

## Getting Started

To run this project, you will need to have Docker installed on your machine. If you do not have Docker installed, you can follow the instructions [here](https://docs.docker.com/get-docker/).

After installing Docker, you can run the project using the following command:

````
docker-compose up -d
````

This will start up the application in a Docker container and make it available on `http://localhost:3000/`.

## Testing

This project uses Jest for testing. To run the tests, use the following command:

````
jest <testName>.test.js
````

This will run all of the tests in the project and give you a report on any failures.