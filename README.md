# REST API

Dockerized REST API using Express.js and PostgreSQL

## Tech Stack

**Backend:** Node.js, Express, JWT, Docker
**Database:** PostgreSQL, Prisma ORM

## Getting Started

0. **Install Docker Desktop**
   0.1. **Install Postman Client**
   0.2. **Open Docker Desktop**

1. **Clone the Repository**:

```bash
git clone https://github.com/DamjannM/REST-API-using-Express.js-and-PostgreSQL.git
cd REST-API-using-Express.js-and-PostgreSQL
```

2. **Generate the Prisma Client**:

`npx prisma generate`

3. **Build your docker images**:

`docker compose build`

4. **Create PostgreSQL migrations and apply them**:

`docker compose run app npx prisma migrate dev --name init`

_Also_ - to run/apply migrations if necessary:

`docker-compose run app npx prisma migrate deploy`

5. **Boot up docker containers**:

`docker compose up`

6.  **Access the Server**:

Open `http://localhost:5000/` in your browser to see the server is running message.

The **Postman Client** is provided to help you test the API using HTTP requests directly. You can run these requests using the **Postman Client** for Desktop.

### API Documentation

`Base URL: http://localhost:5000`
**All requests and responses are in JSON format.**

`Endpoints: `
/auth/register Methods: POST - Create new user
/auth/login Methods: POST - Login user
/task/ Methods: GET, POST, PUT - Create, Read, Update tasks
/users Methods: GET, PUT - Read, Update users

`Postman collection` JSON includes:

- **Registering a user**: Sends a `POST` request to create a new user.
- **Logging in**: Sends a `POST` request to authenticate a user and retrieve a JWT token.
- **Fetching tasks**: Sends a `GET` request to fetch tasks (JWT required). If role is basic it can fetch only tasks for user, if role is admin it will fetch all tasks from all users.
- **Adding a task**: Sends a `POST` request to create a new task (JWT required). Only user with basic role can create tasks.
- **Updating a task**: Sends a `PUT` request to update an existing task (JWT required). If role is basic it will update only task created by itself, if role is admin it can update all tasks.
- **Fetching users**: Sends a `GET` request to fetch users (JWT required). Only admin can read all users.
- **Updating a user**: Sends a `PUT` request to update an existing user (JWT required). If role is basic it can update only information about himself, if role is admin it can update information about all users.

### How to Use the Postman Client

1. Install the **Postman Client** for Desktop.
2. Open Postman Client.
3. Import collection from yettel_task_collection.json file.
4. Test requests by pressing "Send" (NOTE: Dockerized server and database must be running).
