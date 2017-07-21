// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2017 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp
require('dotenv').config({silent: true});
var cics = require('cics-exci');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/license', express.static(__dirname + '/'));

app.post('/cics/reverse', function (req, res) {
  var mycics = new cics();

  var original = req.body.string;
  var channel = "MYCHANNEL";
  var applid = process.env.CICS_APPLID;

  // Function to call if we successfully connect to CICS
  var putContainer = function() {
    var inputdata = {"name" : "INPUTDATA",
                     "string" : original,
                     "channel" : channel};

    mycics.putContainer(inputdata, function(err, data) {
      if (err) {
        console.log("Error in PUT CONTAINER request, err.rc=", err.rc);
        res.sendStatus(500);
        mycics.dispose();
      } else {
        console.log("CICS PUT CONTAINER completed successfully!");
        programLink();
      }
    });
  }

  // Function to call if we successfully put data in our container
  var programLink = function() {
    var linkData = {"applid" : applid,
                    "program" : "EDUCHAN",
                    "channel" : channel
                   };

    mycics.link(linkData, function(err, data) {
      if (err) {
        console.log("Error in LINK request, err.rc=", err.rc);
        res.sendStatus(500);
        mycics.dispose();
      } else {
        console.log("CICS LINK completed successfully!");
        getContainer();
      }
    });
  }

  // Function to call if we successfully link to the CICS program
  var getContainer = function() {
    var outputdata = {"name" : "OUTPUTDATA",
                      "channel" : channel};

    mycics.getContainer(outputdata, function(err, data) {
      if (err) {
        console.log("Error in GET CONTAINER request, err.rc=", err.rc);
        res.sendStatus(500);
        mycics.dispose();
      } else {
        returnToClient(data);
      }
    });
  }

  // Function to call if all previous requests are successful
  // This will return data to the client and stop the CICS process
  var returnToClient = function(returnData) {
    console.log("CICS GET CONTAINER completed successfully!");

    response = { "original": original, "reversed": returnData.rstring };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));

    mycics.dispose();
  }

  // Connect to CICS and start request by putting data in Container
  if (applid) {
    var conn = mycics.create(function() {
      console.log("CICS process started successfully!");
      putContainer();
    });
  } else {
    res.sendStatus(500);
  }
});

app.listen(port, function () {
  console.log('Example app listening on port %d!', port);
});
