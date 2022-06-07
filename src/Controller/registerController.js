const registerModel = require("../model/registerModel.js")
const emailValidator = require('validator')
const jwt = require("jsonwebtoken")

const isValidRole = function (value) {
    for (let i=0 ; i<value.length ; i++) {
        if ((value[i] == "CREATOR")|| (value[i]=="VIEWER")||(value[i]=="VIEW_ALL"))  return true
          
    }
    return false;
}


const userCreate = async function (req, res) {
   try {
       let data = req.body
 
    let{Role,name,phone,email,password} = data
    if(Object.entries(data).length==0){
        res.status(400).send({ status: false, msg: "please provide some data" })
    }

   
    if (!isValidRole(Role)) { 
        return res.status(400).send({ status: false, message: "role is not valid" }) 
    }
 
    if(!name){
        return res.status(400).send({ status: false, msg: "Name is required" })
    }
    let trimname =name.trim()
    if(!(/^(\w+\s)*\w+$/.test(trimname))){
        return res.status(400).send({ status: false, msg: "Please give a valid name without space" })
    }
    
    if (!phone){
        return res.status(400).send({ status: false, msg: "Phone no is required" })
    }
    
    let validphone = await registerModel.findOne({ phone })
    if (validphone) {
        return res.status(401).send({ status: false, msg: "phone no. is already exist" })
    }
    if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
        return res.status(400).send({ status: false, msg: " enter valid  phone no." })
    }
    
    if(!email){
        return res.status(400).send({ status: false, msg: " email is required" })
    }
    
    let validemail = await registerModel.findOne({ email })
    if (validemail) {
        return res.status(400).send({ status: false, msg: "email id is already exist" })
    }
    
    const isValidEmail = emailValidator.isEmail(email)
    if (!isValidEmail) {
         return res.status(400).send({ status: false, msg: " invalid email" })
    }
    
    if (!password){
        return res.status(400).send({ status: false, msg: "Password is required" })
    }  
    // if (password.length < 8 || password.length > 15) {
    //     return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
    // }
    
    //const finalDetails = {name,phone,email,password}
    let savedData = await registerModel.create(data)
    return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    }
    
    catch (error) {
    return res.status(500).send({ status: false, message: error.message })
    }
    
    }



    const userLogin = async function(req,res){
        try{
             let data =req.body;
             if(Object.keys(data).length==0){
                 res.status(400).send({status:false,msg:"kindly pass Some Data"})
             }
             let username = req.body.email;
             let password = req.body.password;
    
             if(!username){
                return res.status(400).send({ status: false, msg: " Email is required" })
            }
    
            const isValidEmail = emailValidator.isEmail(username)
            if (!isValidEmail) {
             return res.status(400).send({ status: false, msg: " invalid email" })
        }
    
            
             if (!password){
            return res.status(400).send({ status: false, msg: "Password is required" })
             }
    
             let user = await registerModel.findOne({email: username, password: password});
             if(!user)
                 return res.status(404).send({
                    status : false,
                    msg:"username or password are not matching",
                 });
             
             let token = jwt.sign({
                  userId: user._id,
                  //email :username
                  
                },"library",{expiresIn:"1800s"},
                
                
                );
                res.setHeader("x-api-key",token);
              res.status(201).send({status: true,msg:'sucess', data: token})
    
        }
        catch (err) {
           res.status(500).send({ Error: err.message })
        }
    }
    
    module.exports.userCreate=userCreate
    module.exports.userLogin = userLogin