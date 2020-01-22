  
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token;

describe('/api/movies tests', () => {
	before((done)=>{ //testler başlamadan çalışır.
        chai.request(server)
            .post('/authenticate') //bu şekilde token e erişim saglarız
            .send({ username: 'kubrakilic', password: '12345' })
            .end((err,res)=>{
                token = res.body.token;
                done();

            });
    });

    describe('/GET movies', ()=>{
        it('it should GET all the movies',(done)=>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array'); //bir array olmalı demek istiyoruz burada
                    done();
                });

        });
    });


    describe('/POST movies', ()=>{
        it('it should POST a movie',(done)=>{
            const movie = {
                title:'örnek5film',
                director_id:'5e27362d8a5f521f3010ee3f',
                category: 'komedi',
                country: 'turkey',
                year: 1998,
                imdb_score:12
            };
            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object'); //bir array olmalı demek istiyoruz burada
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    done();
                });



        });
    });

});