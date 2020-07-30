const File=require('../../database/file');
const express=require('express');
const router=express.Router();
const {Storage}=require('@google-cloud/storage');
const Multer=require('multer');
const path=require('path');
const jwt=require('jsonwebtoken');
const auth=require('./auth');

router.get('/',auth,async(req,res)=>{
    res.json(await File.find());
});

const gc=new Storage({
    keyFilename:path.join(__dirname,'../../google_app.json'),
    projectId:'rosy-environs-268816'
});

router.get('/create_bucket',auth,(req,res)=>{
    gc.createBucket('bucket_prueba_sis719_2').then(()=>{
      res.json({message:'success'});
    }).catch(err=>{
      res.json({message:err});
    });
});

const multer=Multer({
    storage:Multer.memoryStorage()
});

const bucket=gc.bucket(process.env.GCLOUD_STORAGE_BUCKET||'bucket_prueba_sis719_2');

router.post('/upload',auth,multer.single('img'),(req,res)=>{
    if(!req.file){
      res.status(400).json({message:'no enviaste archivos'});
    }
    console.log(req.file);
    const blob=bucket.file(req.file.originalname);
    const blobStream=blob.createWriteStream({
      resumable:false
    });

    blobStream.on('error',(err)=>{
      res.json({message:err});
    });

    blobStream.on('finish',async()=>{
      let url='https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
      const ins=new File({
        url:url,
        name:blob.name
      });
      await ins.save();
      res.json({message:url});
    });

    blobStream.end(req.file.buffer);
});

router.get('/token',(req, res)=>{
    const token=jwt.sign({},'miClave',{
      expiresIn:'1h'
    });
    res.json({token});
});













module.exports=router;
