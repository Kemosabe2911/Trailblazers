const mongoose= require('mongoose');

const Question1Schema= new mongoose.Schema(
    {
        question:{
            type: String
        },
        answer:{
            type: String
        },
        options:{
            type: Array
        }
    }
);

const Question1= mongoose.model('Question1',Question1Schema);

module.exports = Question1;