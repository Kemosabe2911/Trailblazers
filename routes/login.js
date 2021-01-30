const express= require('express');
const router= express.Router();

//Email Model import
const Email= require('../models/Email');

router.get('/',(req,res) => res.render('login'));


router.post('/',(req,res) =>{
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
                res.redirect('/welcome');
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

module.exports = router;