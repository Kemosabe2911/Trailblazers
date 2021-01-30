const express= require('express');
const app= express();
const mongoose = require('mongoose');
const bodyparser= require('body-parser');

// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

//EJS
app.set('view engine', 'ejs');

//Public Folder
app.use(express.static(__dirname+'/public'));

//MongoDB Config
const db= require('./config/key').MongoURI;

//Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("Connected to MongoDB")})
.catch((err)=> {console.log(err)});


//Team Model import
const Team= require('./models/Teams');

//Email Model import
const Email= require('./models/Email');


//Routes
app.get('/',(req,res) =>{
    res.render('login');
})

app.get('/team',(req,res) =>{
    res.render('index');
})

app.get('/instruct',(req,res) =>{
    res.render('instruct',{
        video: "demo"
    });
})


const PORT= process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running at ${PORT}`));


app.post('/',(req,res) =>{
    const email= req.body.email;
    let errors=[];
    if(!email){
        errors.push({msg: "Please Enter an Email Id"});
        console.log(errors);
    }
    else{
        Email.findOne({email: email})
        .then((email) => {
            console.log(email);
            if(email){
                res.redirect('/team');
            }
            else{
                const newEmail = new Email({email});
                newEmail.save()
                .then((emailid) =>{
                    res.redirect('/');
                    console.log("Success");
                });
            }
        })
    }
})

app.post('/team',(req,res) =>{
    const name= req.body.name;
    const score= 0;
    let errors=[];
    if(!name){
        errors.push({msg: "Please Enter a Team Name"});
        console.log(errors);
    }
    else{
        Team.findOne({name: name})
        .then((team) =>{
            if(team){
                errors.push({msg: "Team name already registered"});
                console.log(errors);
            }
            else{
                const newTeam = new Team({name,score});
                newTeam.save()
                .then((team) =>{
                    res.redirect('/instruct');
                    console.log("Success");
                });
            }
        })
    }
})