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



window.onload = () => {
  loadNotes();
  setInterval(loadNotes, 3000); // Alle 3 Sekunden aktualisieren
};

function saveNotes() {
  const content = document.getElementById('notes').value;
  fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
}

function loadNotes() {
  fetch('/notes')
    .then(res => res.json())
    .then(data => {
      const notesElem = document.getElementById('notes');
      // Nur aktualisieren, wenn sich der Text unterscheidet, damit der User beim Schreiben nicht gestört wird
      if (notesElem.value !== data.content) {
        notesElem.value = data.content;
      }
    });
}
