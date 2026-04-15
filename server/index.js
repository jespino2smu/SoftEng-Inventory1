const express = require('express');
const app = express();
app.use(express.json());

//const cors = require('cors');
// app.use(cors({
//   origin: 'https://https://irksomely-unconditional-glenna.ngrok-free.dev',
//   methods: ['GET','POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   //credentials: true // only if using cookies/auth
// }));

const database = require('./database');

// ----------------------------
const userRoutes = require('./routes/userRoutes');
userRoutes.setPool(database.pool);
app.use('/api/users', userRoutes);

// ----------------------------
const stockRoutes = require('./routes/stockRoutes');
stockRoutes.setPool(database.pool);
app.use('/api/stocks', stockRoutes);

// ----------------------------
const notificationRoutes = require('./routes/notificationRoutes');
notificationRoutes.setPool(database.pool);
app.use('/api/notifications', notificationRoutes);

// ----------------------------

app.post('/api/test', async (req, res) => {
  console.log("Ran Test!");
    //const { userId } = req.body;

    try {
        const [result] = await database.pool.execute(
            "SELECT * FROM product"
        );
        
        res.status(200).json(result);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
});

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true
// }));


const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

app.get('/api', (req, res) => {
  res.send('Hello World');
});