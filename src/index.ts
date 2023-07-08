import express from 'express'
import cookie from 'cookie-parser';
import ask from 'gpt4free-ts'

const app: express.Application = express();

app.use(express.static('public'));
app.use(cookie());
app.use(express.json());
app.use(express.text());
app.set('views', './views');
app.set('view engine', 'ejs');

// routes start here

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('*', (req, res) => {
    res.status(404).send('404 not found');
});

const port = 3000;
app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
});