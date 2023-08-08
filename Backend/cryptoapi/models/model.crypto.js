const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  firstname:{type:String,required:true},
  lastname:{type:String,required:true},
  email:{type:String,required:true},
  department:{type:String,required:true},
  salary:{type:Number,required:true}
})

const CryptoModel = mongoose.model("crypto",cryptoSchema);

module.exports = {CryptoModel}