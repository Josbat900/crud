// crear un Middleware

require("dotenv").config();

const API_KEY = process.env.API_KEY;

const authMiddleware = (req,res, next)=>{
    const userApiKey = req.get("x-api-key")
    if(userApiKey && userApiKey === API_KEY){

        next();
    }else{
        res.status(401).send("not authorized")
    }
    
}


module.exports = authMiddleware;