const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const User = require('../models/User');
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

//kullanıcı ekledik
router.post('/register', (req, res, next)=> {
  const { username, password}= req.body;

  bcrypt.hash(password, 10).then((hash)=>{ //şifreyi gizleme
    const user= new User({
      username,
      password:hash
    });
  
    const promise= user.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });  
  });
});

//login işlemini yapma ve çıktı olarak token üretme
router.post('/authenticate', (req,res)=>{
  const { username, password }=req.body;
  User.findOne({
    username: username
  }, (err,user)=>{
    if(err)
      throw err;
    //kullanıcı yoksa
    if(!user){
      res.json({
        status: false,
        message: 'authentication failed, user not found.'
      });
    }//eger kullanıcı varsa şifre kontrol edilir
      else{
        bcrypt.compare(password,user.password).then((result)=>{
          if(!result){
            res.json({
              status: false,
              message: 'authentication failed, wrong password.'
            });
          }//eger şifrede dogru ise bir token oluştururuz ve bunu kullanıcıya sunarız.
           else{
            const payload ={
              username: username
            };
            const token = jwt.sign(payload, req.app.get('api_secret_key'),{
              expiresIn: 720 // 12 saat
            });
            res.json({
              status: true,
              token
            });
           }
        });
      }
  });
});

module.exports = router;
