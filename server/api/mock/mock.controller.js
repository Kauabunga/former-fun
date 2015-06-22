'use strict';

var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();


exports.icd10Stub = (function() {

  return function(req, res){

    var query = req.params.query || '';

    res.status(200).json([
      'Example code 1',
      'Example code 2',
      'Example code 3',
      'Example code 4',
      'Example code 5'
    ]);

  }

})();


/**
 *
 */
exports.nhiStub = (function() {

  var nhiRandomCache = {};

  return function(req, res) {
    var id = req.params.id;

    if (id === '00000000') {
      res.status(404).send();
    }
    else {

      if (!nhiRandomCache[id]) {

        var gender = chance.gender().toLowerCase();
        var firstname = chance.first({gender: gender});
        var lastname = chance.last();
        var dob = chance.birthday();
        var address = chance.address();

        nhiRandomCache[id] = {
          firstname: firstname,
          familyname: lastname,
          dob: dob,
          address: address,
          gender: gender,
          ethnicity: '11',
          residencestatus: 'citizen',
          medicalwarning: '',
          donor: 'yes'
        }

      }

      res.status(200).json(nhiRandomCache[id]);

    }

  }

})();


