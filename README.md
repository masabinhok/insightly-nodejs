# INSIGHTLY - Node.js Application

## Overview

INSIGHTLY is a Node.js application designed to provide a robust backend setup using Express, MongoDB, EJS, and other essential libraries. This application demonstrates how to create a full-featured web application with user authentication and various other functionalities.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Setup and Configuration](#setup-and-configuration)
  - [Setting up Express](#setting-up-express)
  - [Setting up EJS as View Engine](#setting-up-ejs-as-view-engine)
  - [Dev Dependencies](#dev-dependencies)
- [Models](#models)
  - [User Model](#user-model)
  - [Mongoose Pre-save Middleware](#mongoose-pre-save-middleware)
- [Routes](#routes)
  - [User Routes](#user-routes)
- [Connecting to MongoDB](#connecting-to-mongodb)
- [Parsing Middlewares](#parsing-middlewares)
- [Virtual Functions](#virtual-functions)
- [Sign In Route Handling](#sign-in-route-handling)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB

### Installation

1. Initialize npm and install dependencies:

   ```bash
   npm init -y
   npm install express mongoose ejs nodemon
   ```

### Running the Application

1. Start the application using nodemon:

   ```bash
   npx nodemon index.js
   ```

## Project Structure

The project structure is organized as follows:

```
.
├── controllers
├── models
│   └── user.js
├── routes
│   └── user.js
├── views
│   ├── partials
│   ├── signin.ejs
│   └── signup.ejs
├── index.js
└── package.json
```

## Setup and Configuration

### Setting up Express

```javascript
const express = require('express');

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
```

### Setting up EJS as View Engine

```javascript
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
```

### EJS Features

We can include partial files in EJS for reusable code:

```html
<%- include('./partials/head') %>
```

### Dev Dependencies

Install nodemon for development:

```bash
npm install nodemon -D
```

## Models

### User Model

```javascript
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: '/images/default.png' },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  },
  { timestamps: true }
);

const User = model('user', userSchema);

module.exports = User;
```

### Mongoose Pre-save Middleware

```javascript
const { randomBytes, createHmac } = require('crypto');

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  this.salt = salt;
  this.password = hashedPassword;

  next();
});
```

## Routes

### User Routes

```javascript
const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect('/');
});

module.exports = router;
```

Import the routes in `index.js`:

```javascript
const userRoute = require('./routes/user');
app.use('/user', userRoute);
```

## Connecting to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/blogapp')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });
```

## Parsing Middlewares

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

## Virtual Functions

```javascript
userSchema.statics.matchPassword = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new Error('User not found');

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  if (hashedPassword !== userProvidedHash) throw new Error('Invalid Password');

  const userWithoutSensitiveData = user.toObject();
  delete userWithoutSensitiveData.password;
  delete userWithoutSensitiveData.salt;

  return userWithoutSensitiveData;
};
```

## Sign In Route Handling

```javascript
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.matchPassword(email, password);

  console.log(user);
  return res.redirect('/');
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.