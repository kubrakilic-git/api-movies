const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


const index = require('./routes/index');
const movie = require('./routes/movie');
const director = require('./routes/director');

const app = express();
//config
const config  =require('./config'); //buraya token için oluşturdugumuz config.js dahil ettik
app.set('api_secret_key', config.api_secret_key);


//middleware
const verifyToken  =require('./middleware/verify-token');

//mongoDB ye baglantı saglama
mongoose.connect('mongodb://localhost/movie-api',{ useNewUrlParser: true , useUnifiedTopology: true } );
mongoose.connection.on('open', ()=>{
//  console.log("MongoDB: connected");
});
mongoose.connection.on('error',(err)=>{
  console.log("MongoDB: Error", err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', verifyToken); //api altındaki heryerde kullanılabilecel
app.use('/api/movies', movie);
app.use('/api/directors', director);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: {message:err.message, code: err.code}}); //hata mesajını istediğimiz şekilde vermeyi saglar 
});

module.exports = app;
