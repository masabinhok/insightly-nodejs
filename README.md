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

## creating a model

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
{
fullName: {
type: String,
required: true,
},

    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

},
{
timestamps: true,
}
);

const User = model("user", userSchema);

module.exports = User;

.............................................

enum - can be used to model data with limited set of possible values, it is basically an array, if role is assigned to any other value rather than the enum has been defined to, mongoose throws an error..

## Mongoose pre-save middleware

userSchema.pre("save", function (next) {
const user = this;

if (!user.isModified("password")) return next();

const salt = randomBytes(16).toString('hex');
const hashedPassword = createHmac("sha256", salt)
.update(user.password)
.digest("hex");

this.salt = salt;
this.password = hashedPassword;

next();
});

Its a mongoose presave middlware for hashing a user's password before saving the user document to the database.

We are generating a 16 digit hashed password with a salt for the user's password and assigning the salt to user.salt and hashedPassword to user.password,

We are using a built in module crypto, for generating hash passwords using createHmac('sha256', salt) and randomBytes() method.

createHmac('sha256', salt) : create a hash with sha256 algorithm, with the provided salt.
