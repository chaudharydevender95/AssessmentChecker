var express = require('express');
var router = express.Router();

const StudentService = require('../Services/TeacherStudentServices')
const AssessmentService = require('../Services/AssessmentService')
const TeacherServices = require('../Services/teacherServices')

router.post('/student', StudentService.addStudent);

router.put('/student',StudentService.updateStudent)
 
router.delete('/student',StudentService.deleteStudent);

router.post('/assessment', AssessmentService.addAssessment);

router.put('/assessment',AssessmentService.updateAssessment);
 
router.delete('/assessment',AssessmentService.deleteAssessment);

router.post('/assign',TeacherServices.assignAssessment)

router.post('/unAssign',TeacherServices.unAssignAssessment)

router.get('/leaderBoard',StudentService.getLeaderBoard)

module.exports = router;