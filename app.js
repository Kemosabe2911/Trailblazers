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

//Question1 Model import
const Question1= require('./models/Q1');


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


const PORT= process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running at ${PORT}`));


app.post('/',(req,res) =>{
    const email= req.body.email;
    console.log(email);
    let errors=[];
    if(!email){
        errors.push({msg: "Please Enter an Email Id"});
        console.log(errors);
    }
    else{
        console.log('Hello');
        console.log(email);
        Email.findOne({email: email})
        .then((email) => {
            console.log(email);
            if(email){
                /*res.redirect('/team')*/
                res.render('index',{
                    email: email.email,
                    errors: errors
                });
            }
            else{
                const newEmail = new Email({email});
                newEmail.save()
                .then((email) =>{
                    /*res.redirect('/');*/
                    res.render('index',{
                        email: email.email,
                        errors: errors
                    });
                    console.log("Success");
                });
            }
        })
    }
})

app.post('/team',(req,res) =>{
    console.log(req.body);
    const name= req.body.name;
    const email = req.body.email;
    const score= 0;
    const penalty=0;
    let errors=[];
    /*Question1.find({},function(err,question){
        if(!err){
            console.log(question)
            const result= question;
            console.log("Question working");
            console.log(result);
        }
        else{
            console.log(err)
        }
    })*/
    if(!name){
        errors.push({msg: "Please Enter a Team Name"});
        console.log(errors);
    }
    else{
        Team.findOne({name: name})
        .then((team) =>{
            console.log(team);
            if(team){
                /*let teamName= team.name;
                    res.render('instruct',{
                        video: "demo",
                        team: teamName,
                        email: req.body.email
                    });
                console.log("Success");*/
                errors.push({msg: "Team Name Already registered"});
                res.render('index',{
                    email: email,
                    errors: errors
                });
            }
            else{
                const newTeam = new Team({name,score,email,penalty});
                newTeam.save()
                .then((team) =>{
                    let teamName= team.name;
                    res.render('instruct',{
                        video: "demo-1.mp4",
                        team: teamName,
                        email: req.body.email
                    });
                    console.log("Success");
                });
            }
        })
    }
})
//https://www.youtube.com/embed/zSd1sz56h9Q?autoplay=1&mute=1&controls=0

//task1 - Auditorium
app.post('/start',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = 0;
    let score =0;
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            let penalty= team.penalty;
            console.log(teamName,timeLeft);
            res.render('contest',{
                video: "task1",
                no: 1,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                score: score,
                task: "I'm one of the most world-renowned chefs and cooking with me will be your worst nightmare. I run a foundation along with my wife to support charities. Who am I?",
                options: ["Vikas Khanna","Daniel Hemm","Gordan Ramsay","Charity Morgan"],
                ans: "Gordan Ramsay"
            });
        }
    })
})

//task2- Central Library
app.post('/task-1',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = 0;
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest',{
                video: "task2",
                no: 2,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                task: "The probability of occurrence of a letter in a paragraph is the number on",
                options: ["Scrabble tiles","Mahjong tiles","Dabble coins","Quiddler cards"],
                ans: "Scrabble tiles"
            });
        }
    })
})

//task3 - Basketball Court
app.post('/task-2',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = 0;
    console.log(teamName,timeLeft,penalty);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest-layout-2',{
                video: "task3",
                no: 3,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                image: "task3-2.png",
                task: "Identify the athlete from the picture",
                options: ["Carolyne Wozniaki","Megan Rapinoe","Alex Morgan","Lucy Bronze"],
                ans: "Alex Morgan"
            });
        }
    })
})

//task4 - Swimming Pool
app.post('/task-3',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = 0;
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest',{
                video: "task4",
                no: 4,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                task: "Bathophobia is the fear of",
                options: ["Perfume baths","Stairs","Gravity","Beautiful women"],
                ans: "Stairs"
            });
        }
    })
    
})

//task5 - Ground
app.post('/task-4',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest',{
                video: "task5",
                no: 5,
                team: teamName,
                time: timeLeft,
                penalty: penalty,
                task: "What fake name does Harry use while attending Bill and Fleur's wedding in disguise?",
                options: ["Barny Weasley","Avery Weasley","Mason Granger","Cillian Granger"],
                ans: "Barny Weasley"
            });
        }
    })
    
    //const result= Team.find({name: teamName})
    //console.log(result);
    /*Team.find({},function(err,team){
        if(!err){
            console.log(team)
            console.log("Success");
        }
        else{
            console.log(err)
        }
    }).sort({name: -1})*/
})

//task6 - Ground
app.post('/task-5',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest-layout-2',{
                video: "task6",
                no: 6,
                team: teamName,
                time: timeLeft,
                penalty: penalty,
                image: "task6-2.png",
                task: "Identify the movie",
                options: ["Fury","Hacksaw ridge","Extraction","American Sniper"],
                ans: "Fury"
            });
        }
    })
    
    
})

//task7
app.post('/task-6',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest',{
                video: "task7",
                no: 7,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                task: "Read the following information and answer the questions given below:   P + Q mean P is the daughter of Q, P × Q means P is the son of Q and P – Q means P is the wife of Q.Example 7: If A × B – D, which of the following is true ?",
                options: ["D is wife of B","A is daughter of B","B is father of A","D is father of A"],
                ans: "D is father of A"
            });
        }
    })
    
    
})

//task8
app.post('/task-7',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest-layout-2',{
                video: "task8",
                no: 8,
                image: "task8-2.png",
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                task: "Identify the architect",
                options: ["Frank Gehri","Laurie Baker","Antoni Gaudi","Zaha Hadid"],
                ans: "Antoni Gaudi"
            });
        }
    })
    
    
})

//task9
app.post('/task-8',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team);
            console.log(teamName,timeLeft);
            let penalty = team.penalty;
            res.render('contest',{
                video: "task9",
                no: 9,
                penalty: penalty,
                team: teamName,
                time: timeLeft,
                task: `Guess the song:
                💸💸🍺🎵💦`,
                options: ["Tip tip barsa paani","Baha killiki","Pani re pani re rang tera kaisa","Pani da rang deku ke"],
                ans: "Tip tip barsa paani"
            });
        }
    })
    
})

//Finish
app.post('/task-9',(req,res) =>{
    const teamName = req.body.team;
    let timeLeft = req.body.time;
    let  penalty = req.body.penalty;
    let score = parseInt(timeLeft)+ parseInt(penalty);
    console.log(teamName,timeLeft);
    Team.updateOne({name: teamName},
        {$set: {score: score, penalty: penalty}}, function(err,updatedTeam){
            if(!err){
                console.log("suceess");
            }
        }
    )
    Team.findOne({name: teamName},function(err,team){
        if(!err){
            console.log(team)
            const result= team;
            console.log("Success");
            console.log(result);
            let time = parseInt(result.score);
            let minutes= parseInt(time/60);
            let seconds= parseInt(time%60);
            minutes= minutes<10 ? "0"+minutes : minutes;
            seconds= seconds<10 ? "0"+seconds : seconds;
            console.log(minutes,seconds)
            res.render('finish',{
                video: "finish",
                minutes: minutes,
                seconds: seconds
            });
        }
        else{
            console.log(err)
        }
    })
})




//Leaderboard
app.get('/leaderboard',(req,res) =>{
    Team.find({},function(err,team){
        if(!err){
            console.log(team)
            const result= team;
            console.log("Success");
            console.log(result);
            res.render("leaderboard",{
                teams: result
            });
        }
        else{
            console.log(err)
        }
    }).sort({score: 1})
    /*
    result.sort(sortFunction);
    function sortFunction(a,b){
        if(a[2] === b[2]){
            return 0;
        }
        else{
            return (a[2]<b[2]) ? -1 : 1;
        }
    }*/
})

app.get('/exit',(req,res) =>{
    res.redirect('/');
})