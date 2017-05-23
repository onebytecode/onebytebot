require('dotenv').config()
var bb = require('bot-brother');
var mongoClient = require("mongodb").MongoClient;
var bot = bb({
  key: process.env.TG_BOT_API_KEY,
  sessionManager: bb.sessionManager.memory(),
  polling: { interval: 0, timeout: 1 }
});
var dialogger   = require('./bot_parts/dialogger')
var CONTEXT     = ''
const ng_id     = process.env.NG_ID
const mongo_url = process.env.MONGOD_URL

mongoClient.connect(mongo_url, function(err, db){

    if(err){
        return console.log(err);
    } else {
      console.log(`DB is started :: ${db.databaseName}`);
    }
    var usersCollection = db.collection("users")
    var user_nikita     = { name: "Nikita", lastName: "Goncharov", _id: process.env.NG_ID }
    usersCollection.insertOne(user_nikita, (err, result) => {
      if(err) {
        return console.log(`ERR :: ${err}`);
      } else {
        console.log(`Result :: ${result.ops}`);
        db.close()
      }
    })
})

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
