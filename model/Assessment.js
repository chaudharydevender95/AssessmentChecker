const mongoose = require('mongoose');
var request = require("request");

const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
    text:{
        type: String
    },
    topics: {
        type: [String],
        validate:{
            validator: v=> v.length > 0
        },
        required:true
    }
});

assessmentSchema.methods.getScores = async function(){
    let grammarScore = await this.getRelevanceScore();
    let relevanceScore = await this.getRelevanceScore();
    let spellingScore = await this.getSpellingScore();

    return [grammarScore,relevanceScore,spellingScore]
}
assessmentSchema.methods.getRelevanceScore = function(){
    return this.calculateScore('relevance');
}
assessmentSchema.methods.getGrammarScore = function(){
    return this.calculateScore('grammar');
}
assessmentSchema.methods.getSpellingScore = function(){
    return this.calculateScore('spellings');
}
assessmentSchema.methods.calculateScore = function(feature){
    var options = {
        method: 'POST',
        url: 'https://gi3domjqhj3gk4ttnfxw4lzrfyydu3lpmnvwk4roobzgs43nfz4w23a.prism.stoplight.io/evaluate/'+feature,
        headers: {'content-type': 'application/json'},
        body: this,
        json: true
      };
      return new Promise((resolve,reject)=>{
        request(options, function (error, response, body) {
            console.log(body)
            if (error) reject(0);
            else resolve(body.score)
          });
      })
}

module.exports = mongoose.model('Assessment', assessmentSchema);