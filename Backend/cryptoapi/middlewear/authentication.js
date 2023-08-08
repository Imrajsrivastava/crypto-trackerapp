const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

const authentication = (req,res,next)=>{
  let token  = req.headers.authorization.split(" ")[1];

  if(!token){
    res.status(401).send({error:"login first 1"})
  }else{
    jwt.verify(token,process.env.JWT_KEY,(err,payload)=>{
      if(err){
        return res.status(401).send({error:"login first 2"})
      }

      const {userID} = payload;
      req.user = userID;

      next();
    })
  }
}

module.exports = {authentication}