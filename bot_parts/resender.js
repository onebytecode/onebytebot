require('dotenv').config()
var CHAT_ID = process.env.NG_ID
var resend = ((context) => {
  var ANSWERS = context.data.user_answers.split( ' | ')
  console.log(`Context is ${context.data.user.first_name}`);
  var ORDER   = `Пользователь ${context.data.user.first_name} ${context.data.user.last_name} прошел все шаги с такими словами:\n${ANSWERS.join('\n')}`
  context.bot.api.sendMessage(CHAT_ID, ORDER)
})

module.exports.resend = resend
