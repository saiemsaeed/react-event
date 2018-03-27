const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");

let app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/addUser', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/EventApp', (err, client) => {
        if(err){
            return console.log(`Unable to connect to Database`, err);
        }
        console.log("Connected to Database!");
        const db = client.db('EventApp');

        db.collection('registeredStudents').insertOne({
            name: req.body.name,
            reg: req.body.reg,
        })
        .then((result) => {
            console.log(result.ops);
        });
        client.close();      
    });
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Server is listening on PORT 3000!!!");
});
