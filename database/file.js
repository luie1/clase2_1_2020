const mongoose=require('./connect');
const file={
    url:String,
    name:String
}
const filemodel=mongoose.model('file',file);
module.exports=filemodel;
