'use strict';

var express = require('express');
var controller = require('./mock.controller');

var router = express.Router();

router.get('/nhi/:id', controller.nhiStub);
router.get('/icd10/:query', controller.icd10Stub);

module.exports = router;
