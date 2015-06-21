'use strict';

var _ = require('lodash');



exports.nhiStub = function(req, res) {

  if(req.params.id === '1111111'){

    res.status(200)
      .json({
        firstname: 'Mock first',
        familyname: 'Mock last',
        dob: '1111-11-10T11:00:00.000Z',
        address: '70 The Terrace, Wellington, New Zealand',
        gender: 'male',
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


