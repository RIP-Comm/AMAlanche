# AMAlanche

## Get Started

To launch backend server install node package using:

> npm install

After package installations, you can start nodemon launching:

> npm run dev

Or with docker:

> npm run docker:dev

## Project Structure

 - `app` : folder for frontend application;
 - `src` : folder for backend application;
    - `interfaces`: contains all interfaces to take full advantage of typescript;
    - `loaders`: this folder contains all script to initialize server, executed once at server startup, like dependency container and express initialization;
    - `middleware`: this folder group all middleware;
    - `models`: folder for database entity;
    - `routes`: api entry point;
    - `services`: folder with all Business logic;

## Dependency Injection
This project is predispose to use Dependency Injection. See [typedi](https://github.com/typestack/typedi) documentation.

## Request validation 

To validate request has been introduced [celebrate](https://github.com/arb/celebrate) middleware.


## API Example

It has already been implemented an example test api

### Endpoint
> POST - http://localhost:3000/api/users/test/

---
### Request Body
``` json
{
  "id": "xyz"
}
```
---
### Response Body
``` json
{
    "id": "xyz",
    "name": "test",
    "email": "test@test.it",
    "creationDate": "2022-11-19T08:55:41.849Z"
}
```
