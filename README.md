# Blog API

## Overview

A RESTful API for a blogging platform built with Node.js, Express, PostgreSQL, and Sequelize. This API allows users to manage posts and comments, with support for user authentication and pagination.

## Features

- User authentication with JWT
- JWT secured API's
- CRUD operations for posts and comments
- Searching on posts and comments
- Pagination for fetching posts

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Database Migrations](#database-migrations)
4. [Running the Project](#running-the-project)
5. [API Endpoints](#api-endpoints)

## Installation

1. **Pre-requisite**
    - Node JS 
    - PostgreSQL
2. **Clone the Repository**

   ```bash
   git clone https://github.com/ahsan-kwanso/blog-api-v2.git
   cd in folder where you cloned this git repo
3. **Install Dependencies**
    ```bash
    npm install
## Configuration

1. **Create a `.env` file**: Add the following environment variables:

    ```plaintext
    JWT_SECRET=your_jwt_secret
    PORT=your_port_number
    NODE_ENV=development

    DB_USERNAME_DEV=your_user_name
    DB_PASSWORD_DEV=your_password
    DB_NAME_DEV=your_database_name
    DB_HOST_DEV=your_host
    DB_DIALECT_DEV=database (postgres, mysql etc)
    
    DATABASE_URL = your_db_url_provided_by_heroku
    ```

2. **Create a database**: Set up a PostgreSQL database.

3. **Update `db.config.js`**: Edit the file located at `backend/config/db.config.js` to include your database configuration:

    ```javascript
    module.exports = {
      development: {
        username: 'your_db_username',
        password: 'your_db_password',
        database: 'your_db_name',
        host: 'your_db_host',
        dialect: 'postgres',
      },
      // other environments...
    };
    ```
## Database Migrations
This guide provides instructions on how to manage database migrations using Sequelize.

## Setting Up

1. **Ensure Database Configuration**

   Make sure your database configuration is correctly set in the `db.config.js` file located at `backend/config/db.config.js`. This file should include your database connection details.

2. **Run Command For Migration**
    ```bash
    npm run db:migrate
    ```

## Running the Project

### Development Mode

Start the project in development mode using `nodemon`:

```bash
npm run dev
```

### Production Mode
Start the project in production mode
```bash
npm start
```

## API EndPoints
This section provides an overview of the API endpoints available in the Backend Project. Use this guide to understand the available endpoints and how to interact with them using Postman or other tools.

## Base URL

All endpoints use the base URL: `http://localhost:3000/`

## Authentication

All endpoints require authentication using a Bearer token. Include the token in the `Authorization` header of your requests.

### Bearer Token
```plaintext
issued upon sign in / sign up. Place that bearer token in authorization section.
```

# Endpoints

## Check Server
* Method: GET
* URL: /
* Description: Checks if the server is up and running.

## User Authentication

### Signup
* Method: POST
* URL: /auth/signup
* Body:
  ```json
  {
    "user_name": "your_user_name",
    "email": "your_email",
    "password": "password"
  }
  ```
* Description: Registers a new user.

### SignIn

* Method: POST
* URL: /auth/signin
* Body:

    ```json
    {
      "email": "your_email",
      "password": "password"
    }
    ```
* Description: Logs in a user and provides a Bearer token.

## Posts
### Create Post

* Method: POST
* URL: /posts
* Body:

    ```json
    {
      "title": "FrontEnd Development",
      "content": "ReactJs HTML CSS JS Tailwind"
    }
    ```
* Description: Creates a new post.

## Get Posts

* Method: GET
* URL: /posts
* Description: Retrieves all posts.

## Get Post By ID

* Method: GET
* URL: /posts/
* URL Params:
    * `post_id`: ID of the post to retrieve.
* Description: Retrieves a specific post by ID.

## Update Post

* Method: PUT
* URL: /posts/
* URL Params:
    * `post_id`: ID of the post to update.
* Body:

    ```json
    {
      "title": "Updated title",
      "content": "Updated content"
    }
    ```
* Description: Updates a specific post.

### Delete Post

* Method: DELETE
* URL: /posts/
* URL Params:
    * `post_id`: ID of the post to delete.
* Description: Deletes a specific post.

## Comments
### Create Comment

* Method: POST
* URL: /comments
* Body:

    ```json
    {
      "post_id": 5,
      "title": "Deeper Nested Reply",
      "content": "This is another level of nesting, reply to the fourth comment.",
      "parent_comment_id": 7
    }
    ```
* Description: Creates a new comment on a post.

### Get Comment By ID

* Method: GET
* URL: /comments/
* URL Params:
    * `comment_id`: ID of the comment to retrieve.
* Description: Retrieves a specific comment by ID.

### Get Comments By Post ID

* Method: GET
* URL: /comments/post/
* URL Params:
    * `post_id`: ID of the post to get comments for.
* Query Params:
        page: Page number for pagination.
        limit: Number of comments to return.
* Description: Retrieves all comments for a specific post.

### Update Comment

* Method: PUT
* URL: /comments/
* URL Params:
    * `comment_id:` ID of the comment to update.
* Body:
    ```json
    {
      "content": "But I don't enjoyed it"
    }
    ```
* Description: Registers a new user.

## Advanced Queries
### Posts with Comments

* Method: GET
* URL: /posts-comments
* Description: Retrieves all posts along with their comments.

### Get User's Posts with Comments

* Method: GET
* URL: /posts-comments/user/
* URL Params:
    * `user_id`: ID of the user to get posts and comments for.
* Description: Retrieves all posts and comments for a specific user.

### Search Comments by Title or Content

* Method: GET
* URL: /comments
* Query Params:
    * `content`: Content to search for in comments.
* Description: Searches for comments based on content.

### Search Posts by Title or Content

* Method: GET
* URL: /posts-comments/search
* Query Params:
    * `title`: Title to search for in posts.
    * `limit`: Number of posts to return.
* Description: Searches for posts based on title.

## End Notes

Thank you for exploring the Blog API! This documentation aims to provide a comprehensive overview of how to set up, configure, and interact with the API. Here are a few final notes:

- **Security:** Ensure you use a strong, unique JWT secret in your `.env` file. For production, consider additional security measures such as HTTPS and environment-based configurations.

- **Testing:** Use tools like Postman or Insomnia for testing the API endpoints. Consider writing automated tests to ensure the stability of your API.

- **Contributing:** Contributions to improve the API are welcome! Please follow the guidelines in the repository for submitting pull requests and reporting issues.

- **Feedback:** Your feedback is valuable! If you encounter any issues or have suggestions for improvements, please reach out via the repository issues page.

- **Future Enhancements**: Planned enhancements may include features such as user roles and permissions, richer search functionalities, and integration with external services. Stay tuned for updates!

**Feel free to reach out if you have any questions or need further assistance.**
