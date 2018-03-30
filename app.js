const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const bodyParser = require("body-parser");
const hbs = require('hbs');

let app = express();

hbs.registerHelper("ifPaid", function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerPartials(__dirname + "/views/partials");

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/id/:id', (req, res) => {

    var _id = new ObjectID(req.params.id);
    // console.log(_id);
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').findOne({ _id })
            .then((data) => {
                console.log(data);
                res.render('index', {
                    data
                });
            });
    });
});

app.get('/all/:type', (req, res) => {
    var type = req.params.type.toLowerCase();
    var obj = {};
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        if (type === "email") {
            obj = { email: 1, _id: 0 };
        } else if (type === "phone") {
            obj = { phone: 1, _id: 0 };
        }
        else if (type === "joined"){
            obj = {name: 1, reg: 1, _id: 0}
        }

        if (obj === {}) {
            return;
        }
        db.collection('registeredUsers').find({joined: true}, { projection: obj }).toArray()
            .then((data) => {
                let x;
                if (type === "email") {
                    let x = data.reduce((acc, next) => {
                        return next.email != "" ? acc += next.email + "<br>" : acc;
                    }, "");
                    res.send(x);
                } else if (type === "phone") {
                    let x = data.reduce((acc, next) => {
                        return next.phone != "" ? acc += next.phone + "<br>" : acc;
                    }, "");
                    res.send(x);

                }
                else if(type === "joined"){
                    let x = data.reduce((acc, next) => {
                        return acc += `${next.name} ----------- ${next.reg} <br/>`;
                    }, "");
                    res.send(x);
                }
            });
    });
});


app.get('/find/:id', (req, res) => {
    var id = req.params.id.toLowerCase();
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            console.log(err);
        }
        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').find({ "reg": { $regex: `.*${id}.*` } }).toArray()
            .then((data) => {
                res.send(data);
            });
    });
});

app.get('/joined/:id/:action', (req, res) => {
    var action = req.params.action;
    var joined = (action === "true") ? true : (action === "false") ? false : "";
    if (typeof joined !== "boolean")
        res.status(404).send();
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            return console.log(`Unable to connect to Database`, err);
        }
        var id = new ObjectID(req.params.id);
        console.log("Connected to Database!");
        const db = client.db('heroku_ccjzs1d6');

        db.collection('registeredUsers').updateOne({ _id: id }, {
            $set: {
                joined,
                joinedTime: new Date()
            }
        })
            .then((result) => {
                client.close();
                res.send(result);
            });
    });
});

app.get('/find/', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
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
        if (err) {
            return console.log('Unable to connect to Database', err);
        }

        const db = client.db('heroku_ccjzs1d6');
        db.collection('registeredUsers').find({}).toArray()
            .then((data) => {
                res.render('registered', { data, message: "Enter Registration Id To Find" });
            });
    });
});

app.post('/add', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            return console.log(`Unable to connect to Database`, err);
        }
        var name = req.body.name;
        var reg = req.body.reg.toLowerCase();
        var email = req.body.email || "";
        var phone = req.body.phone || "";
        var paymentStatus = req.body.paymentStatus;
        console.log("Connected to Database!");
        const db = client.db('heroku_ccjzs1d6');

        db.collection('registeredUsers').insertOne({
            name,
            reg,
            email,
            phone,
            paymentStatus
        })
            .then((result) => {
                console.log(result.ops);
            });
        client.close();
    });
    res.redirect('/');
});

app.post('/add/:id', (req, res) => {
    MongoClient.connect('mongodb://react:react123@ds125479.mlab.com:25479/heroku_ccjzs1d6', (err, client) => {
        if (err) {
            return console.log(`Unable to connect to Database`, err);
        }
        var id = new ObjectID(req.params.id);
        var name = req.body.name;
        var reg = req.body.reg.toLowerCase();
        var email = req.body.email || "";
        var phone = req.body.phone || "";
        var paymentStatus = req.body.paymentStatus;
        console.log("Connected to Database!");
        const db = client.db('heroku_ccjzs1d6');

        db.collection('registeredUsers').updateOne({ _id: id }, {
            $set: {
                name,
                reg,
                email,
                phone,
                paymentStatus
            }
        })
            .then((result) => {
                console.log(result.ops);
            });
        client.close();
    });
    res.redirect('/users');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}!!!`);
});
