const jwt = require('jsonwebtoken');

//Ara katman oluşturma
module.exports = (req,res,next)=>{
    const token = req.headers['x-access-token'] || req.body.token || req.query.token
    
    if(token){ //token kontrolü
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded)=>{
            if(err){
                res.json({
                    status: false,
                    message: 'failed to authenticate token.'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.json({
            status: false,
            message: 'no token provided'
        });
    }

};