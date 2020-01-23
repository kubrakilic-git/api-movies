const express = require('express');
const router = express.Router();

//models
const Movie = require('../models/Movie');
//bütün filmleri listelemek
router.get('/', (req,res)=>{
  const promise = Movie.aggregate([
    {
      $lookup:{
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind:'$director'
    }
  ]); //bu şekilde tüm filmlerin araması yapılır.
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


//filmlerde ilk top 10 listesi
router.get('/top10', (req,res)=>{
  const promise = Movie.find({ }).limit(10).sort({imdb_score: -1}); // bu şekilde 10 filmi scorelarına göre sıralar
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});



//id ye göre film detayına ulaşma
//url de girdiğmiz id ye göre film detaylarını gösterir.
router.get('/:movie_id', (req,res,next)=>{
  //res.send(req.params); //bu şekilde movie_id de ki data neyse buraya düşer ve kullanalabiliriz
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie)=>{
    //istediğimiz hata mesajını bu şekilde verebiliriz. app.js de ekleme yaptık.
    if(!movie)
      next({ message: 'The movie was not found.', code:99});
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});


//film güncelleme
router.put('/:movie_id', (req,res,next)=>{
  //res.send(req.params); //bu şekilde movie_id de ki data neyse buraya düşer ve kullanalabiliriz
  const promise = Movie.findByIdAndUpdate(  //güncelleme işlemi bu şekilde dogru bir şekilde calısırız
    req.params.movie_id, 
    req.body,
    //çıktı olarak güncellenmiş datayı döndürmek istersek
    {
      new: true
    }
    );
  promise.then((movie)=>{
    //istediğimiz hata mesajını bu şekilde verebiliriz. app.js de ekleme yaptık.
    if(!movie)
      next({ message: 'The movie was not found.', code:99});
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});

//film silme
router.delete('/:movie_id', (req,res,next)=>{
  //res.send(req.params); //bu şekilde movie_id de ki data neyse buraya düşer ve kullanalabiliriz
  const promise = Movie.findByIdAndRemove(req.params.movie_id); //silme işlemi gerçekleşir
  promise.then((movie)=>{
    //istediğimiz hata mesajını bu şekilde verebiliriz. app.js de ekleme yaptık.
    if(!movie)
      next({ message: 'The movie was not found.', code:99});
    res.json({
      status:1
    });
  }).catch((err)=>{
    res.json(err);
  });
});

router.post('/', (req, res, next)=> {
  //önemli bir nokta bu erişimi bodyParser sayesinde yaptık.
  //const {title, imdb_score, category, country,year} = req.body; //postmondan eklediğimiz verilere bu şekilde erişim sağlayabiliriz
  //erişdiğimiz bu verileri veritabanına kaydetme
  const movie = new Movie(req.body);
  //bu dataları veritabanına kaydetmek

// movie.save((err,data)=>{
//   if(err)
//     res.json(err);
//   res.json({status:true});
// });

//üstteki ile altta yazdıgım kodlar aynı işleve sahip ikiside datalerı veritabanına kaydeder.
//alttakinin kullanımı daha anlaşılır oldugu için alttaki tercih edilir.
const promise = movie.save();
promise.then((data)=>{
  res.json(data)
}).catch((err)=>{
  res.json(err);
});
});


//iki yıl arasındaki(between) filmleri listeleme
router.get('/between/:start_year/:ende_year', (req,res)=>{
  const {start_year, end_year } = req.params; //bu şekilde datayı almış olalım.
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
    }
    ); //bu şekilde tüm filmlerin araması yapılır.
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


module.exports = router;
