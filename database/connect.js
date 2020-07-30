const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://luis:appsis719@cluster0-7er3y.mongodb.net/test').then(()=>{
  console.log('succes db');
}).catch((err)=>{
  console.log(err);
});

module.exports=mongoose;
