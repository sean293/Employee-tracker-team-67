# Employee-tracker-team-67

## To Fork Project
Go to the main project and click the `Fork` button in the top right to create a new fork. This will essentially create a copy on your page that you can edit without changing the main project.

Create a local copy using `git clone [link to your repo]` while in the target directory.

To make changes to your local clone, first use `git add .` to add all files.
Then use `git commit -m "[message]"` to commit with a message.
Finally use `git push` to upload the changes to the repository.

To merge your repo click `Open Pull Request` on your fork. You will be able to see the changes and add a message to your request.

## To Run Website
Install [node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/try/download/community).

Open MongoDB Compass and make a new connetion to `mongodb://localhost:27017` (should be the default).

While in the `/mern_stack/client` directories run `npm install` to get all needed dependencies from the `package.json` files.

To start the backend run `node server.js` when in the `/mern_stack` directory.  Leave this terminal open.

To start the frontend run `npm start` when in the `/mern_stack/client` directory. Leave this terminal open.

It should then open `http://localhost:3000/` in a web browser.

To view accounts added to the database using the `/register` page, open the `users` collection under the `Team67` database in MongoDB Compass.

Let's see how this goes