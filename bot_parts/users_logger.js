const users_logger  =  this
const mhandler      =  require('../modules/mongo_handler')
users_logger.getAllUsers  =  (context) => {
  // console.log(`Debug point get users module ${mhandler.showAllUsers()}`);
  mhandler.showAllUsers( (result) => {
    var users    = result
    var message  =  ''
    users.forEach( (el) => {
      message += `Name :: ${el.first_name}\n`
      if(el.messages) {
        el.messages.forEach( (msg) => {
          console.log(`Message keys :; ${Object.keys(msg)}`);
          msg.text
            ? message += (msg.text + '\n')
            : msg.photo
              ? message += 'photo\n'
              : ''
        })
      }
    })
    context.sendMessage(message)
  })
}
users_logger.dropAllUsers  =  (context) => {
  mhandler.dropAllUsers()
  context.sendMessage('All users successfully dropped!')
}




module.exports  =  users_logger
