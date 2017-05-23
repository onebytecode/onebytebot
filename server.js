require('dotenv').config()
var bb = require('bot-brother')
var bot = bb({
  key: process.env.TG_BOT_API_KEY,
  sessionManager: bb.sessionManager.memory(),
  polling: { interval: 0, timeout: 1 }
});
const dialogger   = require('./bot_parts/dialogger')
const uLogger     = require('./bot_parts/users_logger')
var CONTEXT     = ''
const ng_id     = process.env.NG_ID

bot.use('before', bb.middlewares.typing());
bot.use('before', bb.middlewares.botanio(process.env.METRICS_KEY));
bot.command('start')
.invoke(function (ctx) {
  CONTEXT = ctx
  return dialogger.greetings(ctx)
})
.answer(function (ctx) {
  return dialogger.talk(CONTEXT, ctx)
})
bot.command('upload_photo')
.invoke(function (ctx) {
  console.log('Context: ' + ctx);
  return ctx.sendMessage('Drop me a photo, please');
})
.answer(function (ctx) {
  return ctx.sendPhoto(ctx.message.photo[0].file_id, {caption: 'I got your photo!'});
})
bot.command('show_users')
  .invoke( (ctx) => {
    return uLogger.getAllUsers(ctx)
  })
bot.command('drop_users')
  .invoke( (ctx) => {
    return uLogger.dropAllUsers(ctx)
  })
