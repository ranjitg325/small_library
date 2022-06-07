
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({

    title:  { 
        type: String,
         required: true, 
         unique:true
         },

    userId: { 
        required: true , 
        type: ObjectId,
        ref: "createbook1"
    },

    category: { 
        type: String, 
        required: true, 
    },
    
 
}, {timestamps:true})


module.exports=mongoose.model('creator',bookSchema)