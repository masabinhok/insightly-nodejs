# INSIGHTLY-nodejs

# Setting up things

## Terminal

npm init
npm i
npm i express
npm i mongoose
npm i ejs
npm i nodemon

## Directories

controllers
models
views
routes
index.js

## setting up express

const express = require('express');

const app = express();
const PORT = 8000;

app.listen(PORT, ()=>{
console.log(`Server started at PORT: ${PORT}`);
})

## setting ejs as view engine

const path = require('path')

app.set('view engine' , 'ejs');
app.set('views', path.resolve('./views'));

## ejs features

we can have a partial folder which will contain common codes for reuse purpose, we can simply include them in our files with
<%- include ('./partials/head') %>
here partials is a folder and head is the name of the file which contains the common code.

## dev dependencies

we do not require to restart our app frequently in the prodcution level, so its better to install nodemon as a dev dependencies( it will remain until development phase, which will help to reduce our file size in the production level.)

for that:
npm i nodemon -D
