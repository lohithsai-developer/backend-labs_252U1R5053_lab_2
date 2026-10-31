const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.db');

let db;

async function initializeDBAndServer() {
    db = await sqlite.open({ filename: dbPath, driver: sqlite3.Database });
    console.log('Connected to SQLite database');

    await db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL,
      pages INTEGER NOT NULL
    )
  `);

    const result = await db.get('SELECT COUNT(*) AS count FROM book');
    if (result.count === 0) {
        const sampleBooks = [
            ['The Alchemist', 'Paulo Coelho', 250, 208],
            ['Wings of Fire', 'A. P. J. Abdul Kalam', 300, 180],
            ['Atomic Habits', 'James Clear', 450, 320],
            ['The Guide', 'R. K. Narayan', 200, 220],
            ['Ikigai', 'Hector Garcia', 350, 194],
            ['Rich Dad Poor Dad', 'Robert Kiyosaki', 400, 336],
            ['1984', 'George Orwell', 280, 328],
            ['Pride and Prejudice', 'Jane Austen', 320, 432],
            ['Deep Work', 'Cal Newport', 296, 296],
            ['Think and Grow Rich', 'Napoleon Hill', 270, 250]
        ];

        const insertBook = await db.prepare(`
      INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)
    `);
        try {
            for (const book of sampleBooks) {
                await insertBook.run(book);
            }
        } finally {
            await insertBook.finalize();
        }
        console.log('10 sample books inserted');
    }

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

initializeDBAndServer()
    .catch(error => {
        console.error('CRITICAL: Database or Server failed to initialize!');
        console.error(error);
        process.exit(1);
    });

function getValidBookId(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}

function validateBook(body) {
    const { title, author, price, pages } = body;
    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        !Number.isSafeInteger(price) || price < 0 ||
        !Number.isSafeInteger(pages) || pages <= 0
    ) {
        return false;
    }
    return true;
}

app.get('/books/', async (req, res) => {
    try {
        const search_q = req.query.search_q ? String(req.query.search_q).trim() : '';
        const author = req.query.author ? String(req.query.author).trim() : '';
        const min_price = req.query.min_price ? parseInt(req.query.min_price, 10) : null;
        const max_price = req.query.max_price ? parseInt(req.query.max_price, 10) : null;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const allowedSortColumns = ['id', 'title', 'author', 'price', 'pages'];
        const sort_by = allowedSortColumns.includes(req.query.sort_by) ? req.query.sort_by : 'id';
        const order = String(req.query.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        let conditions = [];
        let params = [];

        if (search_q) {
            conditions.push('title LIKE ?');
            params.push(`%${search_q}%`);
        }
        if (author) {
            conditions.push('author LIKE ?');
            params.push(`%${author}%`);
        }
        if (min_price !== null && !isNaN(min_price)) {
            conditions.push('price >= ?');
            params.push(min_price);
        }
        if (max_price !== null && !isNaN(max_price)) {
            conditions.push('price <= ?');
            params.push(max_price);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countResult = await db.get(`SELECT COUNT(*) AS total FROM book ${whereClause}`, params);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);

        const books = await db.all(`
      SELECT * FROM book 
      ${whereClause} 
      ORDER BY ${sort_by} ${order} 
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

        res.status(200).json({
            metadata: {
                total_items: totalItems,
                total_pages: totalPages,
                current_page: page,
                per_page: limit
            },
            books: books
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve books' });
    }
});

app.get('/books/:bookId/', async (req, res) => {
    const id = getValidBookId(req.params.bookId);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const book = await db.get('SELECT * FROM book WHERE id = ?', [id]);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve book' });
    }
});

app.post('/books/', async (req, res) => {
    if (!validateBook(req.body)) {
        return res.status(400).json({
            error: 'Provide title, author, non-negative integer price, and positive integer pages'
        });
    }

    const { title, author, price, pages } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)`,
            [title.trim(), author.trim(), price, pages]
        );
        const newBook = await db.get('SELECT * FROM book WHERE id = ?', [result.lastID]);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book' });
    }
});

app.put('/books/:bookId/', async (req, res) => {
    const id = getValidBookId(req.params.bookId);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            error: 'Provide title, author, non-negative integer price, and positive integer pages'
        });
    }

    const { title, author, price, pages } = req.body;
    try {
        const existingBook = await db.get('SELECT * FROM book WHERE id = ?', [id]);
        if (!existingBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await db.run(
            `UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?`,
            [title.trim(), author.trim(), price, pages, id]
        );
        const updatedBook = await db.get('SELECT * FROM book WHERE id = ?', [id]);
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/books/:bookId/', async (req, res) => {
    const id = getValidBookId(req.params.bookId);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const result = await db.run('DELETE FROM book WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', bookId: id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
