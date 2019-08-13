const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Assessment = require('./Assessment');

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    assessments: {
        type: [
            {
                assessmentId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Assessment'
                },
                text: {
                    type: String
                },
                completed: {
                    type: Boolean,
                    default: false
                },
                spelling_score: {
                    type: Number,
                    default: 0
                },
                grammar_score: {
                    type: Number,
                    default: 0
                },
                relevance_score: {
                    type: Number,
                    default: 0
                }
            }],
        default: []
    },
    total_score: {
        type: Number,
        default: 0
    },
    spelling_score: {
        type: Number,
        default: 0
    },
    grammar_score: {
        type: Number,
        default: 0
    },
    relevance_score: {
        type: Number,
        default: 0
    }
});

studentSchema.methods.submitAssessment = function(assessmentId,assessment) {
    var assessments = this.assessments
    var index = assessments.findIndex(assessment => assessment.assessmentId == assessmentId)
    console.log(index)
    return new Promise(async (resolve, reject) => {
        var assessmentInfo = assessments[index]
        if (index == -1 || assessmentInfo.completed) resolve(undefined)
        else {
            try{
            
            var [grammarScore, relevanceScore, spellingScore] = await assessment.getScores()

           
            assessmentInfo.spelling_score = spellingScore
            assessmentInfo.grammar_score = grammarScore
            assessmentInfo.relevance_score = relevanceScore
            assessmentInfo.completed = true

            assessments[index] = assessmentInfo
            this.assessments = assessments

            this.spelling_score = this.spelling_score + spellingScore
            this.grammar_score = this.grammar_score + grammarScore
            this.relevance_score = this.relevance_score + relevanceScore
            this.total_score = this.total_score + spellingScore + grammarScore + relevanceScore

            this.save()
            resolve(this)
            }
            catch(e){
                reject(e)
            }
        }
    })

}

module.exports = mongoose.model('Student', studentSchema);