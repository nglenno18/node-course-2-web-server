/*
Section 5, Lecture 46 -- ADDING VERSION CONTROL (GIT)
  Use Git to save project,
  back up work to GitHub,
  and deploy project LIVE to web (not just available on localhost)
*/

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerHelper('getCurrentYear', function(){
  return new Date().getFullYear();
});
//capitalize helper
hbs.registerHelper('screamIt', function(text){
  return text.toUpperCase();
});
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
// http://localhost:3000/help.html

//app.use is how you REGISTER middleware
app.use(function(req, resp, next){    //next exists so you can tell your middleware is done
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);          //timestamp + http.method
  fs.appendFile('server.log', log + '\n', function(err){
    if(err){
      console.log('Unable to append server.log');
    }
  });
  next();  //app will only continue when next() is called
});


app.use('/maintenance', function(req, resp, next){
  resp.render('maintenance.hbs', {
    pageTitle: 'Maintenance HBS',
    welcomeMessage: `This is just a maintenance page rendering:,
    render hbs inside new piece of middleware, call response.render,
    - no difference bw resp object in a request handler and a response object in middleware,
    no need to call next(), stop it after rendering hbs file to screen`
  });
  var log = `${req.method} ${req.url}`;
  console.log(log);
});
//^^middleware is executed in the order it is used
//help.html will still render. We set up our express.static directory, then our logger, then maintenance hbs logger


app.get('/', function(request, response){         //request = http request
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Heyyaa welcome to my website'
  });
});

//handler takes the response AND request object
app.get('/about', function(req, res){
  //res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

/*
CHALLENGE: Create a route to /bad --> send back json with an errorMessage
*/
app.get('/bad', function(req, res){
  // res.send('Bad Page');   --Instead of passing in a string or html, pass in object
  res.send({
    errorMessage: 'Unable to handle request'
  });
});
//app.listen is going to bind application to a port on our machine
app.listen(3000, function(){
  console.log('Server is up and running on Port: 3000');
});
console.log('check the client');

/*
Very basic express application that listens on port 3000 and
  currently has handlers for 3 URLs
*/
