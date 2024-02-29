const express = require('express');
const cors = require('cors');

const userRoute = require('./routes/user');
const carBodyRoute = require('./routes/carBody');
const carRoute = require('./routes/car');
const billRoute = require('./routes/bill');
const dashboardRoute = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/user', userRoute);
app.use('/carBody', carBodyRoute);
app.use('/car', carRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;
