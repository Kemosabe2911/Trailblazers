const express= require('express');
const router= express.Router();

//Team Model import
const Team= require('../models/Teams');

//Welcome Page
router.get('/',(req,res) => res.render('index'));

router.post('/',(req,res) =>{
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
                    res.redirect('/welcome');
                    console.log("Success");
                });
            }
        })
    }
})

module.exports = router;