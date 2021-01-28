const express= require('express');
const app= express();
const mongoose = require('mongoose');
const bodyparser= require('body-parser');

// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

app.use('/',require('./routes/index'));

const PORT= process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running at ${PORT}`));