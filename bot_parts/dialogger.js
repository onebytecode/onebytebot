var self      = this
var fs        = require('fs')
var greetings = function(context) {
  context.data.user  = context.meta.user
  !context.session.memory ?
      context.session.memory = 'stage_1'
      : ''
  context.data.stage = context.session.memory
  var STAGE  = context.data.stage
  console.log(`STAGE FROM GREETINGS ${STAGE}`);
  var STATUS = context.data.stage.split('_').slice(2 , 3)
  STAGE = STAGE[0] + '_' + parseInt(STAGE[1])
  if(!context.data.stage){
    fs.readFile('./stages/stage_1.json', (error, response) => {
      if(error) {
        console.log(`RF | ${error}`);
      } else {
        var CHAT = JSON.parse(response)
        context.sendMessage(CHAT.text.bot_ask)
        context.data.stage = 'stage_1_started'
        context.session.memory = 'stage_2'
        console.log(``);
      }
    })
  } else {
    var STAGE  = context.data.stage.split('_').slice(0 , 2)
    var STATUS = context.data.stage.split('_').slice(1 , 2)
    var FILE   = './stages/' + STAGE.join('_') + '.json'
    fs.readFile(FILE, (error, response) => {
      if(error){
        console.log(`RF | ${error}`);
      } else {
        var CHAT = JSON.parse(response)
        context.sendMessage(CHAT.text.bot_ask)
        context.data.stage = STAGE.join('_') + '_started'
        context.data.memory = STAGE[0] + '_' + (parseInt(STAGE[1]) + 1)
        console.log(`Memory set to ${context.data.stage}`);
      }
    })
  }

}
var talk = function(context, newContext) {
  console.log(`VALUES | ${context.data.stage}`);
  var STAGE  = context.data.stage.split('_').slice(0 , 2)
  var STATUS = context.data.stage.split('_').slice(2 , 3)
  var ANSWER = newContext.answer

  STATUS ?
      STATUS == 'passed' ?
          STAGE = STAGE[0] + '_' + (parseInt(STAGE[1]) + 1)
          : STATUS == 'started' ?
                STAGE = STAGE[0] + '_' + parseInt(STAGE[1])
                :  newContext.sendMessage('Кончились шаги :(')
      : STAGE = STAGE[0] + '_' + parseInt(STAGE[1])

  var FILE   = './stages/' + STAGE + '.json'
  console.log(`Talking with ${context.meta.user.name}`);
  console.log(`Debug point status | ${STATUS}`);
  fs.readFile(FILE, (error, response) => {
    if(error){
      console.log(`RF | ${error}`);
      newContext.sendMessage('У нас кончились уроки, так что сорян, как санек отбухает доделаем')
    } else {
      var CHAT = JSON.parse(response)
      if(Object.keys(CHAT.text.answers).some((el) => { return el == ANSWER } )){
        Object.keys(CHAT.text.answers).forEach((el) => {
          if(el == ANSWER) {
            context.data.stage = STAGE + '_' + Object.keys(CHAT.text.answers[el])
            newContext.sendMessage(CHAT.text.answers[el][Object.keys(CHAT.text.answers[el])])
          }
        })
      } else {
        newContext.sendMessage('Варианты ответов: ' + Object.keys(CHAT.text.answers).join(' | '))
      }
    }
  })

}

module.exports.greetings = greetings
module.exports.talk = talk
