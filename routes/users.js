var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var qs = require('qs');

// USERS router.  This should technically be called something different but i can't be bothered to refactor it yet.

/* GET users listing. */
router.get('/', function(req, res, next) {

   axios.post('https://gate.d5.mpi-inf.mpg.de/aida/service/disambiguate'
       ,{text:req.query.question})
       .then((response)=>{
           console.log(response);
         res.locals.aidaRes = response;
           res.locals.wikiURL = Object.values(res.locals.aidaRes.data.entityMetadata)[0].url;
           //                       ^ This is a method of the global Object class, not of the object prototyle.

           next();
       }).catch((error)=>{
           res.send("Couldn't tell what the question was about")
   });
        //TODO catch errors here.
  //res.send('respond with a resource');
}, function(req,res,next){
    // everything this does is contained within the promise processing.  We need some error handling for when this fails
  axios.get(res.locals.wikiURL).then((response)=>{
      console.log(response);
      res.locals.articleText = response.data;
      var $ = cheerio.load(res.locals.articleText);
      res.locals.artBodyText = $('#bodyContent p').text();
      console.log(res.locals.artBodyText)
      next();
  })
}, function(req,res,next){
    axios.post("http://demo.allennlp.org/predict/machine-comprehension",{passage:res.locals.artBodyText,question:req.query.question.replace('[[','').replace(']]','')},
        {        headers: {
            'Content-Type': 'application/json',
        }})
        .then((response)=>{
            console.log(response);
            res.send(response.data.best_span_str||'there was no best string!');

        }).catch((error)=>{
            console.log(error);
            console.log(error.response || 'no response')

    })
    // I kinda need to know how to debug in this.

    }
    );

module.exports = router;
