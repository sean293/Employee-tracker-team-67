# Employee-tracker-team-67

## To Fork Project
Go to the main project and click the "Fork" button in the top right to create a new fork. This will essentially create a copy on your page that you can edit without changing the main project.

Create a local copy using "git clone [link to your repo]" while in the target directory.

To make changes to your local clone, 

## To Run Website
Install [node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/try/download/community).

Open MongoDB Compass and make a new connetion to mongodb://localhost:27017 (should be the default).

Install npm plugins using "npm install" while in the /mern_stack directory. This will install all dependencies listed in the package.json file.

To start the backend run "node server.js" when in the /mern_stack directory.  Leave this terminal open.

To start the frontend run "npm start" when in the /mern_stack/client directory. Leave this terminal open.

It should then open http://localhost:3000/ in a web browser.

To view accounts added to the database using the /register page, open the "users" collection under the "Team67" database in MongoDB Compass.