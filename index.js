const express = require('express');
const cors = require('cors');
const multer = require('multer')
const fs = require('fs');
const upload = multer({ dest: './images/' })

const app = express();
const port = 3005;
let catMemes = [];
let currentMeme = '{}';

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
// The images directory that is served as a static server
app.use('/images', express.static('images'));


app.post('/api/upload/', upload.single('memeFile'), (req, res) => {
    console.log(req.file);
    const fileType = (req.file.mimetype === 'image/png') ? '.png' : '.jpg';
    const newFile = './images/' + req.file.filename + fileType;
    fs.rename('./images/' + req.file.filename, newFile, () => {
        currentMeme = req.file;
        fs.writeFileSync('./data/currentMeme.json', JSON.stringify(currentMeme));
        res.sendStatus(200);
    });
});


app.get('/api/memes/', (req, res) => {
    res.send(catMemes);
});


app.get('/api/currentmeme/', (req, res) => {
    res.send(currentMeme);
});


app.post('/api/savecurrent/', (req, res) => {
    if (currentMeme !== '{}') {
        catMemes.push(currentMeme);
        fs.writeFileSync('./data/catMemes.json', JSON.stringify(catMemes));
        currentMeme = '{}';
        fs.writeFileSync('./data/currentMeme.json', currentMeme);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});


app.listen(port, () => {
    let rawData = fs.readFileSync('./data/catMemes.json');
    catMemes = JSON.parse(rawData);
    console.log('Loaded ' + catMemes.length + '  cat memes!');
    rawData = fs.readFileSync('./data/currentMeme.json');
    currentMeme = JSON.parse(rawData);
    console.log('Loaded currentMeme!', currentMeme);
    console.log('Cat Meme API listening on port ' + port);
});