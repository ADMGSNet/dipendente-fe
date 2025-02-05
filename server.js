const express = require('express');
const path = require('path');

const app = express();
const port = 4100;

console.log(__dirname)

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/legge_13_1989/browser')));

// Route for serving the Angular app
app.get('/cittadino/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/legge_13_1989/browser/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});