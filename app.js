const express = require('express');
const fetch = require('node-fetch');
const ejs = require('ejs')
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));



app.get('/', function(req, res) {

  fetch('https://covid19.mathdro.id/api')
    .then(function(response) {
        response.json().then(function(json) {
            const {confirmed: {value:confirmedValue}, recovered: {value: recoveredValue}, deaths:{value:deathsValue}} = json;

            const data = {
              confirmed: confirmedValue.toLocaleString(),
              deaths: deathsValue.toLocaleString(),
              recovered: recoveredValue.toLocaleString()
            };

              res.render('index', {countryName: 'Global Data', confirmed: data.confirmed, recovered:data.recovered, deaths:data.deaths});
          }
        );
    });

});

app.get('/:searchedCountry', function(req,res){

  const singleCountry = _.upperFirst(req.params.searchedCountry)

  fetch('https://covid19.mathdro.id/api/countries/'+singleCountry)
  .then (function(response){
     const {status} = response;
     if (status === 404){
       res.render('failure');
     } else {
       response.json().then(function(json){


           const {confirmed: {value:countryConfirmedValue}, recovered: {value: countryRecoveredValue}, deaths:{value:countryDeathsValue}} = json;

           const countryData={
             confirmed: countryConfirmedValue.toLocaleString(),
             deaths: countryDeathsValue.toLocaleString(),
             recovered: countryRecoveredValue.toLocaleString()
           };

           res.render('index', {countryName:singleCountry, confirmed: countryData.confirmed, recovered:countryData.recovered, deaths:countryData.deaths});

       });
     };

  });

});

app.post('/', function(req,res){
  const searchedCountry = req.body.searchedCountry;

  if(!searchedCountry){
    res.send('Country not found')
  } else {
    res.redirect('/'+searchedCountry);
  }


});

app.post('/:searchedCountry', function(req,res){
  const searchedCountry = req.body.searchedCountry;

  res.redirect('/'+searchedCountry);
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
