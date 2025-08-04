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



// Firebase konfigurieren
const firebaseConfig = {
  apiKey: "API_KEY_HIER",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referenz zur Notizen-Collection/Dokument
const notesDoc = db.collection('notizen').doc('gemeinsam');

// Notizen laden und ins Textfeld schreiben
function loadNotes() {
  notesDoc.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const notesElem = document.getElementById('notes');
      if (notesElem.value !== data.content) {
        notesElem.value = data.content;
      }
    }
  });
}

// Notizen speichern, wenn sich etwas ändert
function saveNotes() {
  const content = document.getElementById('notes').value;
  notesDoc.set({ content: content });
}

// Automatisch laden und alle 3 Sekunden aktualisieren
window.onload = () => {
  loadNotes();
  setInterval(loadNotes, 3000);
};

