const Assessment = require('../model/Assessment');

const httpStatus = require('http-status-codes')
const responseBuilder = require('../response_builder')

module.exports.getAssessmentById = (id)=>{
    return new Promise((resolve,reject)=>{
        Assessment.findOne({_id:id},(err,assessment)=>{
            if(err || !assessment) resolve(undefined)
            else resolve(assessment)
        })
    })
}

module.exports.addAssessment = (req,res,next)=>{
    var assessment = new Assessment();
    assessment.topics = req.body.topics
    assessment.save((err,assessment)=>{
        if(err) return next(responseBuilder.createObject(undefined,'Some error occurred !',httpStatus.INTERNAL_SERVER_ERROR))
        return next(responseBuilder.createObject(assessment,"Assessment saved successfully !",httpStatus.CREATED))
    })
}

module.exports.updateAssessment = async (req,res,next)=>{
    var id = req.body.id;
    var assessment = await this.getAssessmentById(id)
    if(!assessment) return next(responseBuilder.createObject({},"No Assessment found with id "+id,httpStatus.SERVICE_UNAVAILABLE))
    
    assessment.topics = req.body.topics
    assessment.save()
    return next(responseBuilder.createObject(assessment,"Assessment Updated",httpStatus.OK))
}

module.exports.deleteAssessment = async (req,res,next)=>{
    var id = req.body.id;
    var assessment =await this.getAssessmentById(id)
    if(!assessment) return next(responseBuilder.createObject({},"No Assessment found with id "+id,httpStatus.SERVICE_UNAVAILABLE))
    assessment.remove();
    return next(responseBuilder.createObject(assessment,"Assessment Deleted",httpStatus.OK))
}