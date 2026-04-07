const express = require('express');
const path = require('path');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from the unified server!" });
});

app.use(express.static(path.join(__dirname, 'dist')));


app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Hello World!" });
});