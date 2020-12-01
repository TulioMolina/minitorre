# [minitorre](https://minitorre.herokuapp.com/)

Lightweight web app for searching job opportunities or people at [Torre](https://torre.co/), written in TypeScript (backend) and vanilla JS (frontend).

The project is currently deployed at Heroku. The backend works retrieving Torre's data and storing it in database, and providing endpoints with filtering options for the frontend app to call them:

<strong>POST</strong> /api/opportunities/search

Query parameters:
- offset
- size
- logicalOperator

Body:
- objective
- type

<strong>POST</strong> /api/people/search

Query parameters:
- offset
- size
- logicalOperator

Body:
- locationName
- name
- professionalHeadline


## Technologies 
- Express
- MongoDB
- Bootstrap

## Local setup
- Clone the repo: `git clone https://github.com/TulioMolina/minitorre.git`
- Install dependencies: `cd minitorre && npm install`
- Create and configure your `.env` file according to `.env.example`
- Build and run locally: `npm run build && npm start`

Try minitorre yourself at https://minitorre.herokuapp.com/.
