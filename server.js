const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const coworkingSpace = require('./routes/coworkingSpace');
const reservation = require('./routes/reservation');
const waitlist = require('./routes/waitlist');
const auth = require('./routes/auth');
const notification = require('./routes/notification');
const cors = require('cors'); 

//Load env vars
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

 app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set('query parser', 'extended');

app.use('/api/v1/space', coworkingSpace);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservation', reservation);
app.use('/api/v1/waitlist', waitlist);
app.use('/api/v1/notification', notification);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('server running in ', process.env.NODE_ENV, ' mode on port ', PORT));
process.on('unhandledRejection',(err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});