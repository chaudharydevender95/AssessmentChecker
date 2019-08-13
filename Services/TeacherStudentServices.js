const Student = require('../model/Student');
const httpStatus = require('http-status-codes')

const StudentService = require('./StudentServices')
const responseBuilder = require('../response_builder')

module.exports.addStudent = (req,res,next)=>{
    var student = new Student();
    student.name = req.body.name;
    student.save((err,student)=>{
        if(err) return next(responseBuilder.createObject(undefined,'Some error occurred !',httpStatus.INTERNAL_SERVER_ERROR))
        return next(responseBuilder.createObject(student,student.name+" save successfully !",httpStatus.CREATED))
    })
}

module.exports.updateStudent =async (req,res,next)=>{
    var id = req.body.id;
    var student = await StudentService.getStudentById(id)
    if(!student) return next(responseBuilder.createObject({},"No student found with id "+id,httpStatus.SERVICE_UNAVAILABLE))  
    student.name = req.body.name
    student.save();
    return next(responseBuilder.createObject(student,"Student Updated",httpStatus.OK))
}

module.exports.deleteStudent = async (req,res,next)=>{
    var id = req.body.id;
    var student = await StudentService.getStudentById(id)
    if(!student) return next(responseBuilder.createObject({},"No student found with id "+id,httpStatus.SERVICE_UNAVAILABLE)) 
    student.remove();
    return next(responseBuilder.createObject(student,"Student Deleted",httpStatus.OK))
}

module.exports.getLeaderBoard = (req,res,next)=>{
    var criteria = req.query.criteria
    if(criteria == "rank") criteria = "total_score"
    var sortingObject = {[criteria]:-1}
    Student.aggregate(
        [
          { $sort : sortingObject }
        ],(err,students)=>{
            if(err) return next(responseBuilder.createObject(undefined,'Some error occurred !',httpStatus.INTERNAL_SERVER_ERROR))
            return next(responseBuilder.createObject(students,'Successful Operation !',httpStatus.OK))
        }
     )
}