import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({ 
    extended: true,
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'qwerty',
    port: 5432,
})

app.get('/', (req, res) => {
    console.log("TEST :");
    pool.query('SELECT * FROM biodata')
        .then(testData => {
            console.log(testData.rows);
            res.json(testData.rows);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).send("Database Error");
        });
});

//Ambil semua data biodata
app.get('/biodata', (req, res) => {
    pool.query('SELECT * FROM biodata ORDER BY id ASC')
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).json({ message: "Database Error", error: err.message });
        });
});

//Ambil satu data biodata berdasarkan id
app.get('/biodata/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM biodata WHERE id = $1', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: `Data dengan id ${id} tidak ditemukan` });
            }
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).json({ message: "Database Error", error: err.message });
        });
});

app.listen(port, () => {
    console.log(`App running on port ${port},`)
})