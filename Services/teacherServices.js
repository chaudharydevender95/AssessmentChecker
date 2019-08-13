const StudentServices = require('./StudentServices')
const AssessmentServices = require('./AssessmentService')

const responseBuilder = require('../response_builder')
const httpStatus = require('http-status-codes')

module.exports.assignAssessment = async (req, res, next) => {
    var studentId = req.body.studentId
    var assessmentId = req.body.assessmentId

    var assessment = await AssessmentServices.getAssessmentById(assessmentId)
    if (!assessment) return next(responseBuilder.createObject({},"No Assessment found with id "+id,httpStatus.SERVICE_UNAVAILABLE))
        
    var student = await StudentServices.getStudentById(studentId)
    if (!student) return next(responseBuilder.createObject({},"No student found with id "+id,httpStatus.SERVICE_UNAVAILABLE))

    var assessments = student.assessments
    var index = assessments.findIndex(assessment => assessment.assessmentId == assessmentId)
    if (index != -1) return next(responseBuilder.createObject({},"Assessment already assinged to student",httpStatus.SERVICE_UNAVAILABLE))
    
    var assessments = [...student.assessments, { assessmentId }]
    student.assessments = assessments
    student.save()
    return next(responseBuilder.createObject(student,'Assessment assigned successfully',httpStatus.CREATED))
}

module.exports.unAssignAssessment = async (req, res, next) => {
    var studentId = req.body.studentId
    var assessmentId = req.body.assessmentId

    var student = await StudentServices.getStudentById(studentId)
    if (!student)  return next(responseBuilder.createObject({},"No student found with id "+id,httpStatus.SERVICE_UNAVAILABLE))
    
    var assessments = student.assessments
    var index = assessments.findIndex(assessment => assessment.assessmentId == assessmentId)
    if(index != -1){
        var assessment = assessments[index]
        if(!assessment.completed) assessments.splice(index,1)
        else  return next(responseBuilder.createObject({},"Assessment was already submitted",httpStatus.SERVICE_UNAVAILABLE))
    }else   return next(responseBuilder.createObject({},"Assessment was not assigned to "+student.name,httpStatus.SERVICE_UNAVAILABLE))

    student.assessments = assessments
    student.save()
    return next(responseBuilder.createObject(student,'Assessment assigned successfully',httpStatus.OK))
}