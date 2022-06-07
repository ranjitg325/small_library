const mongoose = require('mongoose');
const registerModel = require("../model/registerModel.js")
const createModel = require("../model/createModel.js")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const bookCreate = async function (req, res) {
    try {
        let data = req.body;

        const {title, userId, category } = data

        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide some data" })
        }

         if (!title)
        return res.status(400).send({ status: false, msg: " Title is required" })

        let validtitle = await createModel.findOne({ title })
         if (validtitle) {
        return res.status(401).send({ status: false, msg: " Title already exist" })
             }

        let trimname =title.trim()
        if(!(/^(\w+\s)*\w+$/.test(trimname))){
         return res.status(400).send({ status: false, msg: "Please give a valid title without space" })
             }

         if (!userId)
             return res.status(400).send({ status: false, msg: "userId is required" })

         if (!isValidObjectId(userId)) {
             res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
             return
         }

         let user = await registerModel.findOne({ _id: data.userId })
         if (!user) {
         return res.status(401).send({ status: false, message: 'User does not exit' })

         }
         if (!category)
            { return res.status(400).send({ status: false, msg: "Category is required" })}

     

     let savedData = await createModel.create( data )
     return res.status(201).send({ status: true, msg: savedData });
    
 
 }
 catch (error) {
 console.log(error)
 return res.status(500).send({ status: false, msg: error.message })
}
}


const viewYourBooks = async (req , res) => {
    try {
        let data = req.body;
        let query = req.query        
        let filter = {
            ...query
        }



        let user = await registerModel.findOne({ _id: data.userId })
        if (!user) {
        return res.status(401).send({ status: false, message: 'User does not exit' })

        }
      
         let Role=user.role;
           let validRole= function(value){
               for(let i=0;i<value.length;i++){
                   if(((value[i]=="CREATOR")&& (value[i]=="VIEW_ALL"))||((value[i]=="VIEW_ALL"))||((value[i]=="CREATOR")&& (value[i]=="VIEWER") && (value[i]=="VIEW_ALL"))||((value[i]=="VIEWER")&&(value[i]=="VIEW_ALL"))) return true;
               }
               return false;
           }
           if (!validRole(Role)) {
               return res.status(403).send({status: false , message: "You can not do this task"})
           }

           let queryBody=req.query.body
           const{neW,old}=query;
          if(queryBody){
              const time=Date.now()-10*60*60
            if(neW) { 
                let bookTime= await BookModel.find({createdAt:{$lt:time}})
              if(!bookTime){
                  res.status(404).send("No book created within 10 minutes")
              }
              return res.status(200).send({ status: true, message: "Books list" , data: bookTime });
  
          }

          if(old){
            let bookTimes= await BookModel.find({createdAt:{$gt:time}})
            if(!bookTimes){
                res.status(404).send("No book created before 10 minutes")
            }
            return res.status(200).send({ status: true, message: "Books list" , data: bookTimes });

        }
        else{
            const filterByQuery = await createModel.find(filter)
            if (filterByQuery.length == 0) {
                return res.status(404).send({ status: false, msg: "No book found" })
            }
        }

        }
        return res.status(201).send({ status: true, msg: "Book lists", data: filterByQuery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

const allbooks = async function (req, res) {
    try {
        let query = req.query        
        let filter = {
            ...query
        }

        const filterByQuery = await createModel.find(filter)
        if (filterByQuery.length == 0) {
            return res.status(404).send({ status: false, msg: "No book found" })
        }
        return res.status(201).send({ status: true, msg: "Book lists", data: filterByQuery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.bookCreate = bookCreate

module.exports.viewYourBooks = viewYourBooks

module.exports.allbooks = allbooks