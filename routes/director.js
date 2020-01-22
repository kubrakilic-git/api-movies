const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//models
const Director = require('../models/Director');

//tüm yönetmenleri listelemek
//yönetmene ait filmleri görme
router.get('/', (req,res)=>{
    const promise = Director.aggregate([
        {
            $lookup:{
                from: 'movies', //director tablosunun join edildiği yer
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind:{
                path: '$movies',
                preserveNullAndEmptyArrays: true //bu şekilde filmi olmayan yönetmende belirtilir.

            }
        },
        //bir yönetmenin filmlerini ayrı ayrı göstermektense
        //tek array içinde tutmak.
        {
            $group:{
                _id:{
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies:{
                    $push: '$movies'
                }
            }
        },

        
    ]); //burada join işlemini gerçekleştirecez.
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });



//id ye göre yönetmen detayını gösterme
router.get('/:director_id', (req,res)=>{
    const promise = Director.aggregate([
        {
            $match:{
                '_id': mongoose.Types.ObjectId(req.params.director_id) //bu şekilde id ye göre olan yönetmenlerin bilgilerine erişebiliriz
            }
        },
        {
            $lookup:{
                from: 'movies', //director tablosunun join edildiği yer
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind:{
                path: '$movies',
                preserveNullAndEmptyArrays: true //bu şekilde filmi olmayan yönetmende belirtilir.

            }
        },
        //bir yönetmenin filmlerini ayrı ayrı göstermektense
        //tek array içinde tutmak.
        {
            $group:{
                _id:{
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies:{
                    $push: '$movies'
                }
            }
        },

        
    ]); //burada join işlemini gerçekleştirecez.
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });


//yönetmek eklemek veritabanına
router.post('/', (req, res, next)=> {
    const director = new Director(req.body);
    const promise = director.save(); //database direkt olarak kayıt yapar.
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});


//yönetmen güncelleme
router.put('/:director_id', (req,res,next)=>{
    //res.send(req.params); //bu şekilde director_id de ki data neyse buraya düşer ve kullanalabiliriz
    const promise = Director.findByIdAndUpdate(  //güncelleme işlemi bu şekilde dogru bir şekilde calısırız
      req.params.director_id, 
      req.body,
      //çıktı olarak güncellenmiş datayı döndürmek istersek
      {
        new: true
      }
      );
    promise.then((director)=>{
      //istediğimiz hata mesajını bu şekilde verebiliriz. app.js de ekleme yaptık.
      if(!director)
        next({ message: 'The director was not found.', code:99});
      res.json(director);
    }).catch((err)=>{
      res.json(err);
    });
  });
  


  //yönetmen silme
router.delete('/:director_id', (req,res,next)=>{
    //res.send(req.params); //bu şekilde movie_id de ki data neyse buraya düşer ve kullanalabiliriz
    const promise = Director.findByIdAndRemove(req.params.director_id); //silme işlemi gerçekleşir
    promise.then((director)=>{
      //istediğimiz hata mesajını bu şekilde verebiliriz. app.js de ekleme yaptık.
      if(!director)
        next({ message: 'The movie was not found.', code:99});
      res.json(director);
    }).catch((err)=>{
      res.json(err);
    });
  });
  
module.exports = router;
