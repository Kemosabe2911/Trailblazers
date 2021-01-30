const mongoose= require('mongoose');

const EmailSchema= new mongoose.Schema(
    {
        email:{
            type: String,
            required: true
        }
    }
);

const Email= mongoose.model('Email',EmailSchema);

module.exports = Email;