const express = require("express")
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()


const {connection}= require("./config/db")
const {UserModel} = require("./models/model.user");
const  {authentication} = require("./middlewear/authentication")
const {CryptoRouter} = require("./routes/route.crypto")

const app = express();
app.use(express.json());



const PORT = process.env.PORT || 8080;


app.get("/",authentication,(req,res)=>{
  res.send({msg:"root route is working"});
})

app.post("/signup",(req,res)=>{

  const {email,password,confirmpassword} = req.body;

  if(!email || !password || !confirmpassword ){
    return res.send({error:"required all the field!"})
  }

  if(password !== confirmpassword ){
    return res.send({error:"confirm password or password should be same"})
  }


  try {

    bcrypt.hash(password, 5,async function(err, hash) {
      if(err){
        return res.send({error:"error while hashing password"});
      }
      const Newuser = new UserModel({...req.body,password:hash,confirmpassword:hash})

     const user = await Newuser.save();

     res.status(200).send({msg:"signup seccessful !"});
      
  });
    
  } catch (error) {
    res.status(500).send({error:"signup error from server side!"})
    
  }



})



app.post("/login",async(req,res)=>{
  const {email,password} = req.body;

  if(!email || !password  ){
    return res.send({error:"required all the field!"})
  }

  try {

    const user = await UserModel.findOne({email:email});

    if(!user){

      return res.send({error:"wrong credential !"})

    }

    const pass = await bcrypt.compare(password,user.password);

    if(pass){
      let token = jwt.sign({userID:user._id},process.env.JWT_KEY);
      res.status(200).send({msg:"login successful !",token:token});
    }else{

      return res.send({error:"wrong credential !"})

    }
    
  } catch (error) {

    res.status(500).send({error:"server error while login!"});
    
  }


})


// ..crypto routes 

app.use("/cryptoes",CryptoRouter)

app.listen(PORT,async()=>{
  try {

    await connection
    console.log("database connected !");
    
  } catch (error) {
    console.log("error in db connection ",error)
    
  }
  console.log("server running at port 8080");
})