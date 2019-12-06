# Adonis Simple API application

This is my 1st restfull API using AdonisJs

Requirements
1. Node
2. PgSQL
3. Postman

API List
1. Register
2. Login
3. Books


## Setup

setup your database .env

```js
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_DATABASE=adon
```

Run the npm install.

```js
npm install
```

Run the following command to run startup migrations.

```js
adonis migration:run
```

Run the following command to start project.

```js
adonis serve --dev
```
