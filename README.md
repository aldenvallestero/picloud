# picloud
Picloud is a platform that generates random images and gives you the ownership with no cost.

## Architecture
The **src** contains all development files written in TypeScript. From there, sources were divided into 3 directories:
1. routes - it containes collection of endpoints organized by specific usage.
2. controllers - it contains all 3rd-party apps SDK calls given by the endpoint.
3. index - files were not in a single directory.
   1. firebase - database configuration.
   2. index - core engine that runs the server.

## Dependencies
1. @sendgrid/mail 7.6.1 - email sender
2. @types/express 4.17.13 - typed server framework
3. @types/jest 27.4.1 - typed tester
4. @types/multer 1.4.7 - typed file handler
5. @types/node 17.0.21 - typed node runtime
6. axios 0.26.0 - http request handler
7. cloudinary 1.28.1 - image cloud SDK
8. dotenv 16.0.0 - environment variable storage
9. express 4.17.3 - server framework
10. firebase 9.6.7 - microservices
11. firebase-admin 10.0.2 - microservices (more control)
12. jest 27.5.1 - tester
13. multer 1.4.4 - file handler
14. pexels 1.3.0 - random image generator
15. ts-node 10.5.0 - compiler
16. ts-node-dev 1.1.8 - dev compiler

## Endpoints
**Create User**
**POST** <http://localhost:8000/user/register>
{
    email: string,
    password: string,
}

**Password Reset**
**POST** <http://localhost:8000/user/password_reset>
{
    email: string,
}

**Create User**
**POST** <http://localhost:8000/user/register>
{
    email: string,
    password: string
}

## Run on localhost
Here are the steps for running the server from your localhost
1. Install Node.js from <https://nodejs.org/en/>
2. Clone the github repo <https://github.com/aldenvallestero/picloud>
3. Open a terminal and go to the project root directory and proceed to src folder.
4. Run the server by typing `npm run test` 