const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const logCsv = 'log.csv';
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon  = require("sinon");
const moment = require('moment');
const app = express();
const newTime = "";
app.use(bodyParser.json());


app.use((req1, res1, next) => {
    // write your logging code here
    
    const newTime = new Date().toISOString();
    const logLine = req1.headers['user-agent'].replace(/,/g, '') + ',' + newTime + ',' + req1.method
        + ',' + req1.originalUrl + ',' + ('HTTP/' + req1.httpVersion) + ',' + res1.statusCode;

        
    fs.appendFile('log.csv',
         '\n' + logLine, function (err) {
            if (err) throw err;
            
        });
    console.log(logLine);
    next();
});


app.get('/', (req2, res2) => {
    // write your code to respond "ok" here
    res2.end("ok");
});


app.get('/logs', (req3, res3) => {
    // write your code to return a json object containing the log data here
    var csvString = "";

    fs.readFile('log.csv', 'utf8', function (err, data) {
        if (err) throw err;

        csvString = data;

        var lines = csvString.split('\n');

        var result = [];

        var headers = lines[0].split(',');

        for (var i = 1; i < lines.length; i++) {
            
            var obj = {};
           
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
      

        }
       
        //return result; //JavaScript object
        res3.json(result);
    });

});

module.exports = app;