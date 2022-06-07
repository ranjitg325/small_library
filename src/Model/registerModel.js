const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },

    phone : {
        type : String,
        required : true,
        unique : true,
        trim : true
    
    },
    
    email: {
        required: true,
        type: String,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },
    Role:{
        type:[String],
        required:true,
        trim:true
    }
}, { timestamps: true });

module.exports = mongoose.model('createbook1', user)