# Meme generator

A full stack application to showcase the implementation of most relevant web service technologies.
Demonstrated through a meme creator, allowing you to design memes and share it with other people!


https://github.com/TheBormann/MemeGenerator/assets/44904320/2d8642cc-98ad-4185-a8ef-f693cc72c6f8

## Implemented technologies
- Secure login and registration
- Image manipulation
- Speech to text
- Text to speech

## Requirements

Run the npm script `installall` in the folder `meme-generator-launcher`:

```bash
cd meme-generator-launcher && npm run installall && npm start
```

```powershell
cd meme-generator-launcher ; npm run installall ; npm start
```

### Install .env files

Download the `.env` files from the [Google Drive](https://drive.google.com/drive/folders/1FdOwgSKd96C5ATlouB1XRpdhUAeVb5lp?usp=sharing) and place them in the following folders:

```
ONLINEMULTIMEDIAWS2023
└── apps
    ├── meme-generator-backend
    │   └── => HERE
    │
    └── meme-generator-frontend
    │   └── => HERE
```

### MongoDB

In order to restore the database, you need to download the MongoDB Database Tools. Follow [this installation documentation](https://www.mongodb.com/docs/database-tools/installation/installation-windows/). From all the downloadable tools, this is the right one: https://www.mongodb.com/try/download/database-tools.

Follow all the steps, include the **bin** to your `Path` in your environment variables etc.

## Run the applications

In the folder `meme-generator-launcher`, you can run the following scripts:

```bash

# Run the full application without database connection
npm run startdev

# Run the full application with database connection
npm run start

# Or you can run the single applications seperately

# Run the frontend
npm run client

# Run the backend
npm run server

# Run the database
npm run db

```

## API docs

On `http://localhost:3001/api/`, you can find the API documentation.

## Project structure

```
MEMEGENERATOR
│   README.md
│   .gitignore
│   .dcignore
│
├── docs
│   (documentation files and assets)
│
├── meme-generator-launcher
│   └── package.json
│
├── mongoserver
│   ├── data
│   ├── index.mjs
│   └── package.json
│
└── apps
    ├── meme-generator-backend
    │   ├── bin
    │   ├── public
    │   ├── routes
    │   ├── views
    │   │   .env
    │   │   app.js
    │   │   package.json
    │
    └── meme-generator-frontend
        │   package.json
        ├── public
        ├── src
        └── build
```
