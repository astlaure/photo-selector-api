require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');

const authentication = require('./authentication');
const connection = require('./database');
const authRouter = require('./routers/auth.router');
const photoRouter = require('./routers/photo.router');

const app = express();

connection
  .then(() => {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

    authentication.setupAuthentication(app);

    app.use('/api', photoRouter);
    app.use('/', authRouter);

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(() => { process.exit(1); });
