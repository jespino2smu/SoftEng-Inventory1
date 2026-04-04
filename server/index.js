const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
app.use(express.json());

// ----------------------------

const userRoutes = require('./routes/userRoutes');
userRoutes.setPool(database.pool);
app.use('/users', userRoutes);

// ----------------------------

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));


const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});