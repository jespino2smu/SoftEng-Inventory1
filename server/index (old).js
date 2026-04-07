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
const stockRoutes = require('./routes/stockRoutes');
stockRoutes.setPool(database.pool);
app.use('/stocks', stockRoutes);

// ----------------------------

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));


// const PORT = 1337;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server running at https://irksomely-unconditional-glenna.ngrok-free.dev:${PORT}`);
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});



app.get('/', (req, res) => {
  res.send('Hello World');
});