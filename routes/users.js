var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = requre('cheerio');

// USERS router.  This should technically be called something different but i can't be bothered to refactor it yet.

/* GET users listing. */
router.get('/', function(req, res, next) {

   axios.post('https://gate.d5.mpi-inf.mpg.de/aida/service/disambiguate'
       ,{text:req.query.question})
       .then((response)=>{
         req.aidaRes = response;
           req.wikiURL = aidaRes.data.entityMetadata.values()[0].url;
           //                ^ this should be the valid address in the returned response.
           next();
       });
        //TODO catch errors here.
  //res.send('respond with a resource');
}, function(req,res,next){
    // everything this does is contained within the promise processing.  We need some error handling for when this fails
  axios.get(req.wikiURL).then((response)=>{
      req.articleText = response.data;
      var $ = cheerio.load(req.articleText);
      req.artBodyText = $('#bodyContent').text;
      next();
  })
}, function(req,res,next){
    axios.get("http://demo.allennlp.org/predict/machine-comprehension",{passage:wikiURL,question:req.query.question})
    // I kinda need to know how to debug in this.


    }
    );

module.exports = router;
