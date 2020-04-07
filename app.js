//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const index = require('./routes/index');

const app = express();

require('dotenv').config()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/', index);

const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/naazBookDB';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
