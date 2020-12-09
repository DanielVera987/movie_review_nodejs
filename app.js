'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const routers = require('./routers/router');
const viewDir = `${__dirname}/views`;
const bodyParser = require('body-parser');
const session = require('express-session');
const port = (process.env.PORT || 3000);
const app = express();

app
  .set('views', viewDir)
  .set('view engine', 'ejs')
  .set('port', port)

  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: 'MI-SECRETO',
    resave: false,
    saveUninitialized: false
  }))
  .use(morgan('dev'))
  .use(express.static(`${__dirname}/public`))
  .use(routers)
 
module.exports = app;