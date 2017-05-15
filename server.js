// var TelegramBot = require('node-telegram-bot-api');
    require('dotenv').config()
// var token = process.env.TG_BOT_API_KEY;
// var bot = new TelegramBot(token, {polling: true});
//
//
// bot.onText(/бот/i, (msg, match) => {
//   const chatId = msg.chat.id
//   const call = match[0]
//   const sender = msg.from.first_name
//   console.log(msg);
//   bot.sendMessage(chatId, call + ' это я, слушаю тебя, ' + sender + '!')
// })
// bot.onText(/посчитай/i, (msg, match) => {
//   const chatId = msg.chat.id
//   const math = match[1, match.length - 1]
//   const sender = msg.from.first_name
//   console.log(msg);
//   bot.sendMessage(chatId, sender + ', я посчитал ' + math + ' = ' + eval(math))
// })
// bot.on('message', function (msg) {
//     var chatId = msg.chat.id;
//     console.log(msg);
//     bot.sendMessage(357801942, msg.text, {caption: "I'm a bot!"});
// });
var bb = require('bot-brother');
var bot = bb({
  key: process.env.TG_BOT_API_KEY,
  sessionManager: bb.sessionManager.memory(),
  polling: { interval: 0, timeout: 1 }
});

// Let's create command '/start'.
bot.command('start')
.invoke(function (ctx) {
  // Setting data, data is used in text message templates.
  ctx.data.user = ctx.meta.user;
  // Invoke callback must return promise.
  return ctx.sendMessage('Hello <%=user.first_name%>. How are you?');
})
.answer(function (ctx) {
  ctx.data.answer = ctx.answer;
  // Returns promise.
  return ctx.sendMessage('OK. I understood. You feel <%=answer%>');
})
.invoke(function (ctx) {
  // Setting data, data is used in text message templates.
  ctx.data.user = ctx.meta.user;
  // Invoke callback must return promise.
  return ctx.sendMessage('Nega nega nega nega nega nega nega');
})


// Creating command '/upload_photo'.
bot.command('upload_photo')
.invoke(function (ctx) {
  return ctx.sendMessage('Drop me a photo, please');
})
.answer(function (ctx) {
  // ctx.message is an object that represents Message.
  // See https://core.telegram.org/bots/api#message
  return ctx.sendPhoto(ctx.message.photo[0].file_id, {caption: 'I got your photo!'});
});
