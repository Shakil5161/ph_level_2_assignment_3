Library Management API
This is a Library Management System built using Express, TypeScript, and MongoDB. The application provides APIs to manage books and borrowing records, allowing users to perform CRUD operations and retrieve summaries of borrowed books.

**Features**
**Book Management:**

1. Add new books.
2. Retrieve all books with filtering, sorting, and pagination.
3. Retrieve a specific book by ID.
4. Update book details.
5. Delete books.

**Borrow Management:**

1. Borrow books with quantity validation.
2. Automatically update book availability based on copies.
3. Retrieve summaries of borrowed books using aggregation.

**Technologies Used**

1. Backend: Node.js, Express
2. Database: MongoDB (via Mongoose)
3. Language: TypeScript
4. Deployment: Vercel

**Live Demo**
Visit the live application: https://ph-level-2-assignment-3.vercel.app

API Endpoints

**Book Management**
1. Add a Book
POST /api/books

Request Body:
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
Response:
{
  "success": true,
  "message": "Book created successfully",
  "data": { ... }
}

**2. Get All Books**
GET /api/books

Query Parameters:

filter: Filter by genre (e.g., FICTION, SCIENCE).
sortBy: Field to sort by (e.g., createdAt).
sort: Sorting order (asc or desc).
limit: Number of results to return.

Response:

{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ ... ]
}

3. Get Book by ID
GET /api/books/:bookId

Response:
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { ... }
}


4. Update Book
PUT /api/books/:bookId

Request Body:
{
  "copies": 10
}
Response:
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ... }
}

5. Delete Book
DELETE /api/books/:bookId

Response:
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}

**Borrow Management**
1. Borrow a Book
POST /api/borrow

Request Body:
{
  "book": "6856b6b294f3b99694d8931e",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
Response:
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": { ... }
}


2. Borrowed Books Summary
GET /api/borrow

Response:
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}


**Setup Instructions**

Prerequisites
  Node.js installed on your machine.
  MongoDB connection string.
  
**Steps to Run Locally**
Clone the Repository

Install Dependencies:
npm install

Set Environment Variables: Create a .env file in the root directory and add your MongoDB connection string:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>

Run the Application:
npm run dev

Access the API: The API will be available at http://localhost:5000.

Project video link: https://screenrec.com/share/KsIrezbDw6
