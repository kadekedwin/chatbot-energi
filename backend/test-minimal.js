const express = require('express');
const app = express();
const PORT = 5001;

app.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Minimal server works!' });
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Minimal server running on http://127.0.0.1:${PORT}`);
});

setTimeout(() => {
  console.log('Server is ready for requests');
}, 1000);
