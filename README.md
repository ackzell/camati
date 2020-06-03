# Camati

> record your message, then send it

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Netlify

This repo is hooked up to a Netlify deployment. Every pull request from approved users will create an instance of the app which can be previewed.

## Firebase

To handle the uploads we are using the [storage solution from Firebase](https://firebase.google.com/docs/storage).
You can hook up your own instance to test if you provide a `.env` file on the root of the folder with the following keys:

```.env
FIREBASE_API_KEY=******
AUTH_DOMAIN=******
DATABASE_URL=******
PROJECT_ID=******
STORAGE_BUCKET=******
MESSAGING_SENDER_ID=******
APP_ID=******
```
