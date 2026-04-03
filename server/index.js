const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();

// const userRoutes = require('./users/userRoutes');
// const stockRoutes = require('./stocks/stockRoutes');

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// userRoutes.setPool(database.pool);
// stockRoutes.setPool(database.pool);


app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});