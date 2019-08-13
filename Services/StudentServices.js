const Student = require('../model/Student');
const AssessmentServices = require('./AssessmentService')

const responseBuilder = require('../response_builder')
const httpStatus = require('http-status-codes')

module.exports.getStudentById = (id)=>{
    return new Promise((resolve,reject)=>{
        Student.findOne({_id:id},(err,student)=>{
            if(err || !student) resolve(undefined)
            else resolve(student)
        })
    })
}

module.exports.submitAssessment = async (req,res,next)=>{
    var {body} = req
    var assessmentId = body.assessmentId
    var studentId = body.studentId
    var text = body.text
    
    var assessment = await AssessmentServices.getAssessmentById(assessmentId)
    if(!assessment) return next(responseBuilder.createObject({},"No Assessment found with id "+assessmentId,httpStatus.SERVICE_UNAVAILABLE))

    assessment.text = text
    var student = await this.getStudentById(studentId)
    if(!student)    return next(responseBuilder.createObject({},"No student found with id "+studentId,httpStatus.SERVICE_UNAVAILABLE))
    
    var response = await student.submitAssessment(assessmentId,assessment)
    if(!response)   return next(responseBuilder.createObject({},`No Assignment to solve with assignmentId ${assessmentId} found!`,httpStatus.SERVICE_UNAVAILABLE))

    return next(responseBuilder.createObject(response,'Assessment submitted successfully',httpStatus.CREATED))    
}