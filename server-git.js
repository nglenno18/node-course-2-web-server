/*
Section 5, Lecture 46 -- ADDING VERSION CONTROL (GIT)
  Use Git to save project,
  back up work to GitHub,
  and deploy project LIVE to web (not just available on localhost)

Section 5, Lecture 47 -- GITHUB and SSHKeys
  -use GitBash, not the command prompt
Section 5, Lecture 48 -- DEPLOYING APPS
  - ssh, gitbash, heroku
*/

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//if process.env.port (local) does not exits, use a default 3000
const port = process.env.PORT || 3000;

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

app.get('/about', function(req, res){
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

/*
CHALLENGE: Create a route to /bad --> send back json with an errorMessage
*/
app.get('/bad', function(req, res){
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//The port will not be static, it will be an environment variable that heroku will set
//    -heroku tells app which port to use, which changes
//app.listen(3000, function(){
app.listen(port, function(){
  console.log(`Server is up and running on Port: ${port}`);
});
console.log('check the client');

//Next: Specify a script in package.json (add 'node server-git.js' cmd to the test script)
// "start": "node server.js"
// when heroku tries to start app, will not run node w/ file name, because doesnt know what it is
    // so it runs the start script from package.json
    //--> we run app using start script from terminal
    //-- npm start
