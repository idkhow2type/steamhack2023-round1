import 'dotenv/config';
import express from 'express';
import cookie from 'cookie-parser';
import multer from 'multer';
import { User, Thread } from 'chatgptdemo-api';
import comment from './comment.js';
import modifyFilesInZip from './zip.js';

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
    res.redirect('dashboard');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/app', (req, res) => {
    res.render('app');
});

app.post('/makedoc', upload.any(), async (req, res) => {
    if (!req.files.length) {
        res.status(400).send('No file uploaded');
        return;
    }
    const file: Express.Multer.File = req.files[0];

    try {
        const user = new User(req.cookies['chat_user']);
        await user.initialise();
        const thread = new Thread({ name: file.originalname }, user);
        await thread.initialise();

        res.cookie('chat_user', req['chat_user'] ?? user.session);

        if (file.originalname.endsWith('.zip')) {
            const zip = await modifyFilesInZip(file.buffer, async (data) =>
                comment(data, thread)
            );

            zip.addFile(
                'README.md',
                Buffer.from(
                    await thread.sendMessage(
                        'Write a README.md for the project containing all those files. Describe what the project is and what it does'
                    )
                )
            );

            res.send(zip.toBuffer());
        } else {
            res.send(
                Buffer.from(await comment(file.buffer.toString(), thread))
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get('*', (req, res) => {
    res.status(404).send('404 not found');
});

const port = 3000;
app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
});
