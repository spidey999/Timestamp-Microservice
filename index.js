// index.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
app = express();

// Enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// So that API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Mount the middleware to serve the styles sheet in the public folder
app.use("/public", express.static(__dirname + "/public"));

//app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));

// Mount the body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Parse the data send to post requests
app.use(bodyParser.json());

// Display the index page for GET requests to the root (/) path
// Redirect to the api/:time route after getting a POST request to the root path (via a form)
app.route('/').get((req, res) => {
    res.sendFile(__dirname + "/views/index.html");
}).post((req, res) => {
    //console.log(req.body);
    var date = req.body.date;
    var subdirectory = `/api/${date}`;
    //console.log(subdirectory);
    res.redirect(subdirectory);
});

// Display the current time and its unix conversion for GET requests to the path /api
// Use JSON notation! 
app.get('/api', (req, res) => {
    var time = new Date();
    var currentTime = time;
    var unixTime = time.getTime();
    res.json({"unix": unixTime, "utc": currentTime.toUTCString()});
});

// Display the time entered by the user after the path /api
app.get('/api/:time', (req, res) => {
    // Extract the number entered after the time
    var enteredTime = req.params.time;

    // Try to parse the string entered
    var parsed = Date.parse(enteredTime);

    // If parsed is a number, treat the entered value as a valid UTC time
    // If parsed is NaN, treat the entered value as a valid unix time
    if (!isNaN(parsed)) {
        var utc = new Date(enteredTime);
        var unix = utc.getTime();
    } else {
        unix = new Number(enteredTime); 
        utc = new  Date(unix);
    }

    // Debug statement to see the original values and conversions
    console.log(`entered time: ${enteredTime} current time: ${utc} unix time: ${unix}`);

    // Send an error JSON object if the date is still invalid
    // Otherwise, send the time in unix and utc format
    if (utc == "Invalid Date") {
        res.json({"error": utc.toString()});
    } else {
        res.json({'unix': unix, 'utc': utc.toUTCString()});
    }
});

// Print to the console information about all requests made 
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} ${req.ip}`);
    next();
});

// Get the port or assign it to 3000 if there is none 
var port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Node is listening on port ${port}...`));

