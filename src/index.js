const express = require("express");
const bodyParser = require("body-parser");
const route = require("./route/route.js");
const mongoose = require("mongoose");
const app = express();


app.use(bodyParser.json());

app.use('/', route);

mongoose.connect("mongodb+srv://sapna20:Sapnadha20@cluster0.crepr.mongodb.net/Project-3-db?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});