const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const NOTES_FILE = 'notes.json';

app.get('/notes', (req, res) => {
  fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
    if (err) return res.json({ content: '' });
    res.json(JSON.parse(data));
  });
});

app.post('/notes', (req, res) => {
  const newContent = JSON.stringify({ content: req.body.content });
  fs.writeFile(NOTES_FILE, newContent, err => {
    if (err) return res.status(500).send('Fehler beim Speichern');
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
