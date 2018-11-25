// Assign the required packages and dependencies to variables
var express = require('express');
var ODataServer = require("simple-odata-server");
var Adapter = require('simple-odata-server-mongodb');
var MongoClient = require('mongodb').MongoClient;
var cors = require("cors");
var path = require("path");

// Create app variable to initialize Express 
var app = express();

// Use static server to serve the Express Yourself Website
app.use('/', express.static('webapp'));
//app.use('/resources', express.static('resources/'));

// Enable Cross-origin resource sharing (CORS)  for app.
app.use(cors("*"));

// Define Odata model of the resource entity i.e. Product. 
// The metadata is defined using OData type system called the Entity Data Model (EDM),
// consisting of EntitySets, Entities, ComplexTypes and Scalar Types.
var model = {
    namespace: "ulofemi",
    entityTypes: {
        "Roomdata": {
            "_id": {
                "type": "Edm.String",
                key: true
            },
            "SensorID": {
                "type": "Edm.Int32"
            },
            "Temp": {
                "type": "Edm.Double"
            },
            "Hum": {
                "type": "Edm.Double"
            },
            "Timestamp": {
                "type": "Edm.DateTime"
            }
        }
    },
    entitySets: {
        "Roomdatas": {
            entityType: "ulofemi.Roomdata"
        }
    }
};

// Instantiates ODataServer and assigns to odataserver variable.
var odataServer = ODataServer().model(model);

// Connection to demo database in MongoDB
MongoClient.connect("mongodb://localhost/ulofemi" , { useNewUrlParser: true }, function (err, db) {
    odataServer.adapter(Adapter(function (cb) {
        cb(err, db.db('myodatadb'));
    }));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/webapp/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/candy', function (req, res) {
    console.log("Secret");
});

// The directive to set app route path.
app.use("/odata", function (req, res) {
    odataServer.handle(req, res);
});

// The app listens on port 3010 and prints the endpoint URI in console window.
var server = app.listen(3010, function () {
    console.log('Server running at: ');
    console.log('Webserver     http://localhost:3010/');
    console.log('oData-Service http://localhost:3010/odata/ ');
});