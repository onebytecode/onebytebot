require('dotenv').config()
var self      = this
var fs        = require('fs')
var resender  = require('./resender')
var mhandler  = require('../modules/mongo_handler')
var greetings = function(context) {
  context.data.user  = context.meta.user
  mhandler.addUser(context.data.user)
  // context.bot.keyboard([
  //   [{'answer1': 'answer1'}],
  //   [{'answer2': {value: 'answer2'}}],
  //   [{'answer3': 3}],
  //   [{'answer4': {value: 4}}]
  // ])
  context.data.user_answers = ''
  !context.session.memory ?
      context.session.memory = 'stage_1'
      : ''
  context.data.stage = context.session.memory
  var STAGE  = context.data.stage
  var STATUS = context.data.stage.split('_').slice(2 , 3)
  STAGE = STAGE[0] + '_' + parseInt(STAGE[1])
  if(!context.data.stage){
    fs.readFile('./stages/stage_1.json', (error, response) => {
      if(error) {
        console.log(`RF | ${error}`);
      } else {
        var CHAT = JSON.parse(response)
        var options  =  []
        Object.keys(CHAT.text.answers).forEach( (el) => {
          console.log(`Key :: ${el}`)
          var _arr = []
          _arr.push({})
          _arr[0][el] = el
          options.push(_arr)
        })
        context.bot.keyboard(options)
        context.sendMessage(CHAT.text.bot_ask.replace('<name_holder>', context.data.user.first_name))
        context.data.stage = 'stage_1_started'
        context.session.memory = 'stage_2'
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
        var options  =  []
        Object.keys(CHAT.text.answers).forEach( (el) => {
          console.log(`Key :: ${el}`)
          var _arr = []
          _arr.push({})
          _arr[0][el] = el
          options.push(_arr)
        })
        context.bot.keyboard(options)
        context.sendMessage(CHAT.text.bot_ask.replace('<name_holder>', context.data.user.first_name))
        context.data.stage = STAGE.join('_') + '_started'
        context.data.memory = STAGE[0] + '_' + (parseInt(STAGE[1]) + 1)
        console.log(`Memory set to ${context.data.stage}`);
      }
    })
  }

}
var talk = function(context, newContext) {
  mhandler.addMessageToUser(newContext.message, context.data.user)
  console.log(`STAGE IS | ${context.data.stage}`);
  Object.keys(newContext.message).forEach( (el) => {
    console.log(`${el} :: ${newContext.message[el]}`);
  })
  var STAGE__ARR  = context.data.stage.split('_').slice(0 , 2)
  var STATUS = context.data.stage.split('_').slice(2 , 3)
  var ANSWER = newContext.message.text
                  ? newContext.message.text.toLowerCase()
                  : newContext.message.photo
                    ? '<photo>'
                    : ''

  STAGE = STAGE__ARR[0] + '_' + STAGE__ARR[1]
  var FILE   = './stages/' + STAGE + '.json'
  fs.readFile(FILE, (error, response) => {
    if(error) {
      console.log(`RF | ${error}`);
      newContext.sendMessage('На самом деле у меня все, спасибо что уделил мне пару минут своего времени!')
      newContext.bot.keyboard([])
      resender.resend(context)
    } else {
      context.data.user_answers += (newContext.answer + ' | ' )
      var CHAT = JSON.parse(response)

      if(Object.keys(CHAT.text.answers).some((el) => {
        if(el === 'regexp') {
          if (ANSWER !== 'все') {
            ANSWER = 'regexp'
          } else {

          }
        }
        return el === ANSWER
      } )){
        Object.keys(CHAT.text.answers).forEach((el) => {
          if(el == ANSWER) {
            var ANSWER_STATUS = Object.keys(CHAT.text.answers[el])
            var ANSWER_REDIRECT = Object.keys(CHAT.text.answers[el][ANSWER_STATUS])
            var ANSWER_TEXT = CHAT.text.answers[el][ANSWER_STATUS][ANSWER_REDIRECT]
            console.log(`DEBUG -----------\n ASNWER_STATUS ${ANSWER_STATUS}\nANSWER_REDIRECT ${ANSWER_REDIRECT}\nANSWER_TEXT ${ANSWER_TEXT}`);
            context.data.stage = STAGE__ARR[0] + '_' + ANSWER_REDIRECT
            if(context.data.stage === 'stage_3') {
              fs.readFile('./stages/stage_3.json', (error, result) => {
                var options  =  []
                var _result  =  JSON.parse(result)
                Object.keys(_result.text.answers).forEach( (el) => {
                  console.log(`Key :: ${el}`)
                  var _arr = []
                  _arr.push({})
                  _arr[0][el] = el
                  options.push(_arr)
                })
                newContext.bot.keyboard(options)
              })
            } else {
              newContext.bot.keyboard([])
            }
            setTimeout(() => {
              newContext.sendMessage(ANSWER_TEXT)
            }, 250)

          } else if (ANSWER === '<photo>') {
            newContext.sendMessage('Фото получено!')
          }
        })
      } else {
        newContext.sendMessage('Варианты ответов: ' + Object.keys(CHAT.text.answers).some((el) => { return el === 'regexp' })
                    ? 'ссылки, фотографии или все ;)'
                    : Object.keys(CHAT.text.answers).join('\n'))
      }
    }
  })

}

module.exports.greetings = greetings
module.exports.talk = talk
