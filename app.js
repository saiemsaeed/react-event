const express = require('express');
const {MongoClient, ObjectID} = require('mongodb');
const bodyParser = require("body-parser");

let app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    // res.render('index');
    res.send("Hello");
});

app.get('/id/:id', (req, res) => {

    var _id = new ObjectID(req.params.id);
    console.log(_id);
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if(err){
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').findOne({_id})
        .then((data) => {
            console.log(data);
            res.render('index', {
                data
            });
        });
    });
});


app.get('/find/:id', (req, res) => {
    var id = req.params.id.toLowerCase();
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if(err){
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').find({"reg" : {$regex: `.*${id}.*`}}).toArray()
        .then((data) => {
            res.send(data);
        });
    });
});

app.get('/find/', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if(err){
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').find({}).toArray()
        .then((data) => {
            res.send(data);
        });
    });
})

app.get('/users', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if(err){
            return console.log('Unable to connect to Database', err);
        }
        
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').find({}).toArray()
        .then((data) => {
            res.render('registered', {data, message: "Enter Registration Id To Find"});
        });
    });
});

app.post('/add', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if(err){
            return console.log(`Unable to connect to Database`, err);
        }
        var name = req.body.name;
        var reg = req.body.reg.toLowerCase();
        var email = req.body.email || "";
        var phone = req.body.phone || "";
        console.log("Connected to Database!");
        const db = client.db('heroku_ccjzs1d6');

        db.collection('registeredUsers').insertOne({
            name,
            reg,
            email,
            phone
        })
        .then((result) => {
            console.log(result.ops);
        });
        client.close();      
    });
    res.redirect('/');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}!!!`);
});
