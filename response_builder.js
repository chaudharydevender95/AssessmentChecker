module.exports.createObject = (payload,message,statusCode)=>{
    return {payload,message,statusCode}
}

module.exports.build = (responseObject,req,res,next)=>{
    res.status(responseObject.statusCode || 200).send({message:responseObject.message,payload:responseObject.payload})
}