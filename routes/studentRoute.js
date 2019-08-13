var express = require('express');
var router = express.Router();

const StudentServices = require('../Services/StudentServices')

router.post('/submit', StudentServices.submitAssessment);



module.exports = router;