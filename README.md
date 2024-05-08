# Hacker News API APP
## Description
This project is a NestJS application that interfaces with the HackerNews API to fetch data about stories. It provides several endpoints that return the top 10 most occurring words in the titles of the last 25 stories, the titles of the last week's posts, and the titles from the last 600 stories of users with at least 10,000 karma.

## Features
1. Fetch and analyze the top words from HackerNews story titles.
2. Filter stories based on date and user karma.
3. RESTful API endpoints to access processed data.

## Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js v12.x or later.
npm or yarn as package managers.
Access to an internet connection for fetching data from the HackerNews API.

## Installation
Clone the repository to your local machine:
```bash
git clone https://github.com/Queenzy-Ongeye/hacker-news-api.git
```
## Installing dependancies
```bash
$ npm install
 ## or if using yarn
yarn install
```
## Cofiguration
No additional setup or environment variables are needed for the basic functionality. However, you can configure the port and other parameters by modifying the `src/main.ts` file if necessary.

## Running the app
To start the server, run : 
```bash
# development
$ npm run start
## or
# watch mode
$ npm run start:dev
```
This will start the application on http://localhost:3000 by default.

## API Endpoints
The application provides the following endpoints:

- GET /stories/top-words: Returns the top 10 most occurring words in the titles of the last 25 stories.

## Stay in touch
- Author - Quienzy Ong'eye.

## License
Nest is [MIT licensed](LICENSE).
