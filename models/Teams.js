const mongoose= require('mongoose');

const TeamSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        score:{
            type: Number,
            required: true
        },
        email:{
            type: String,
            required: true  
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
);

const Team= mongoose.model('Team',TeamSchema);

module.exports = Team;