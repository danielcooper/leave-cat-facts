#!/usr/bin/env node

const https = require('https');

const args = process.argv.slice(2);
const token = args[0];
const channel = args[1];
const frequency = args[2] || 60000;
const listEndpoint = `https://slack.com/api/channels.list?token=${token}`
const leaveEndpoint = `https://slack.com/api/channels.leave?token=${token}&channel=${channel}`


if(channel === undefined) {
    return https.get(listEndpoint, function(res) {
      var data = ''
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', (d) => {
        var myData = JSON.parse(data).channels.map((channel) => {
          return channel.is_member && channel.is_archived == false && {
            name: channel.name,
            id: channel.id
          }
        });
        myData.forEach((channel) => {
          if(channel !== false) console.log(channel);
        });
      });
    });
} else {
  setInterval( function(){
    https.get(leaveEndpoint);
  }, frequency);
}
