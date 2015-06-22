'use strict';

var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();



exports.nhiStub = function(req, res) {

  if(req.params.id === '1111111'){

    var gender = chance.gender().toLowerCase();
    var firstname = chance.first({ gender: gender });
    var lastname = chance.last();
    var dob = chance.birthday();


    res.status(200)
      .json({
        firstname: firstname,
        familyname: lastname,
        dob: dob,
        address: '70 The Terrace, Wellington, New Zealand',
        gender: gender,
        ethnicity: '11',
        residencestatus: 'citizen',
        medicalwarning: '',
        donor: 'yes'
      });
  }
  else{
    res.status(404).send();
  }


};


