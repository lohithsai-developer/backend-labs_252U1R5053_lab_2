# Lab 2: SQLite Database and CRUD Routes

## Student Details
- **Name:** Lohith Sai Guthhikonda
- **Registration Number:** 252U1R5053
- **Section:** AI/DE - 2A [106]
- **Course:** Backend Development Fundamentals
- **Lab:** 02

## Project Overview

This project demonstrates the integration of an SQLite database with a Node.js and Express.js backend server.

It implements CRUD (Create, Read, Update, Delete) operations through REST API endpoints to manage book records.

Each book contains:
- Book ID
- Title
- Author
- Price
- Number of Pages

## Technologies Used

- Node.js
- Express.js
- SQLite
- SQLite3
- JavaScript
- Nodemon
- Postman

## Project Structure

```text
lab_2/
│
├── screenshots/
│   ├── get_all_books.png
│   ├── get_single_book.png
│   ├── post_book.png
│   ├── post_book_result.png
│   ├── put_book.png
│   ├── put_book_result.png
│   ├── delete_book.png
│   ├── delete_book_results.png
│   ├── books_database.png
│   └── final_book_db.png
│
├── app.js
├── database.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

<img width="1920" height="980" alt="books_database" src="https://github.com/user-attachments/assets/3d3e7ca8-4c46-436f-9bd4-781e2c0c3443" />


## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/lohithsai-developer/backend-labs_252U1R5053_lab_2.git
```

### 2. Navigate to the project directory

```bash
cd backend-labs_252U1R5053_lab_2
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The backend server runs at:

`http://localhost:3000`

## Database Details

**Database:** SQLite

**Database File:** `database.db`

**Table:** `book`

| Column | Data Type |
|---|---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT |
| title | TEXT |
| author | TEXT |
| price | INTEGER |
| pages | INTEGER |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Retrieve all books |
| GET | `/books/:bookId/` | Retrieve a specific book |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update an existing book |
| DELETE | `/books/:bookId/` | Delete a book |

## API Testing

All five CRUD operations were tested using Postman.

### 1. GET – Retrieve All Books

<img width="1919" height="911" alt="get_all_books" src="https://github.com/user-attachments/assets/5bd9057f-73d2-4d06-8831-690822162aea" />


### 2. GET – Retrieve Single Book

<img width="1920" height="974" alt="get_single_book" src="https://github.com/user-attachments/assets/9ec1503d-5536-4d78-9fa3-98796a44726e" />


### 3. POST – Add New Book

<img width="1920" height="1023" alt="post_book" src="https://github.com/user-attachments/assets/ed364222-d8e8-4368-a736-4c91fe732169" />


**Response:**

<img width="1920" height="1026" alt="post_book_result" src="https://github.com/user-attachments/assets/b6bb4219-ade0-45b7-a271-b3cbc497615c" />


### 4. PUT – Update Book

<img width="1920" height="1023" alt="put_book" src="https://github.com/user-attachments/assets/cf4afc93-5211-4d41-b5ec-e2e0aa0688f8" />


**Response:**

<img width="1920" height="950" alt="put_book_result" src="https://github.com/user-attachments/assets/1fb575c9-1ab3-4f54-9d86-aa1940ec1966" />


### 5. DELETE – Remove Book

<img width="1920" height="1020" alt="delete_book" src="https://github.com/user-attachments/assets/cea36ffd-77d3-40cd-97f1-8abdd486e367" />


**Response:**

<img width="1920" height="973" alt="delete_book_results" src="https://github.com/user-attachments/assets/b7ad14c5-97f3-4436-9a53-ab3012eeedd6" />


## SQLite Database Verification

The database was verified after performing the CRUD operations.

<img width="1920" height="987" alt="final_book_db" src="https://github.com/user-attachments/assets/2b1766dc-ae10-4879-84b5-f907ff65544d" />
<img width="1920" height="980" alt="books_database" src="https://github.com/user-attachments/assets/d5e6ca03-1a70-47eb-a962-55206cd28d0f" />

## Deployment

**Live URL:** https://backend-labs-252u1r5053-lab-2.onrender.com


## Key Learning Outcomes

- Learned to connect an Express.js server with an SQLite database.
- Understood asynchronous database operations using async/await.
- Implemented REST API endpoints for CRUD operations.
- Used parameterized SQL queries to prevent SQL injection.
- Tested API responses using Postman.
- Verified database changes after insertion, updating, and deletion.

## Challenges and Solutions

During this lab, I learned how to establish a database connection and manage book records through REST APIs. I also understood how to handle asynchronous database operations and use parameterized queries to improve database security.

Testing each endpoint through Postman helped me understand how HTTP methods interact with database operations.

**Lab 2 – Backend Development Fundamentals**
