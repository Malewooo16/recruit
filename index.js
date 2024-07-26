//@ts-check

import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';


import './app/actions/passport.js'; // Ensure this is imported to configure Passport
import authRouter from './app/routes/auth.js';

const app = express();

app.use(express.static('./clientTest'));

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "mosterkityyKeyboard?", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
