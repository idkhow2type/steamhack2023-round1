import express from 'express';
import cookie from 'cookie-parser';
import multer from 'multer';
import ask from 'gpt4free-ts';

const app: express.Application = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));
app.use(cookie());
app.use(express.json());
app.use(express.text());
app.set('views', './views');
app.set('view engine', 'ejs');

// routes start here

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/makedoc', upload.any(), async (req, res) => {
    if (!req.files.length) {
        res.status(400).send('No file uploaded');
        return;
    }
    const file = req.files[0];

    const commented = (
        await ask(
            file.buffer.toString() +
                "\n\nwrite some comments embedded in this code. DO NOT give any additional message, don't give a description or overview of the code, don't even say anything like 'Here's the commented code', ONLY respond with the commented code in a code block WITHOUT specifying the language"
        )
    ).replace(/^```[\s\S]+?```$/gm, (match) =>
        match.replace(/^```[\s\n]*|[\s\n]*```$/g, '')
    ); // im sorry

    res.send(commented);
});

app.get('*', (req, res) => {
    res.status(404).send('404 not found');
});

const port = 3000;
app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
});
