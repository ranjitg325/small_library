const express = require("express")
const router = express.Router()

const registerController = require("../controller/registerController.js")
const createController = require("../controller/createController.js")

const middleware=require("../middleware/auth.js")

//========API===============//

router.post('/register',registerController.userCreate)
router.post('/login',registerController.userLogin)


router.post('/books',middleware.authentication,createController.bookCreate)
router.get('/books',middleware.authentication,createController.viewYourBooks)
router.get('/books1',middleware.authentication,createController.allbooks)





module.exports = router;


