# Meme Development Database
This repository contains an in-memory MongoDB database that is specifically designed for development purposes. It allows developers to quickly set up a local MongoDB instance without the need for an external database server.

## Usage
Once the in-memory MongoDB server is running, you can use it just like a regular MongoDB database. Here are some common operations.
In the `/data` folder, database dumps can be used to prepopulate the database.
The database is accessible via the MongoDB connection string: `mongodb://127.0.0.1:65535`.

## Limitations
It's important to note that the in-memory MongoDB database has some limitations:

- Data persistence: Since the database is in-memory, all data is lost when the application is restarted. It is not suitable for production use or long-term data storage.
- Limited functionality: The in-memory database may not support all MongoDB features and functionality. It is primarily intended for development and testing purposes.