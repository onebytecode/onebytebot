const mongoClient    =  require("mongodb").MongoClient
const mongo_url      =  process.env.MONGOD_URL
const mongo_handler  =  this
mongo_handler.execute  =  (func) => {
  mongoClient.connect(mongo_url, (error, db) => {
    this.users =  db.collection('users')
    if(error) console.log(`ERROR :: ${error}`)
    else var result = func()
    db.close()
  })
}

mongo_handler.addUser  =  (user) => {
  mongo_handler.execute( () => {
    if (user) {
      this.users.find({id: user.id}).toArray( (error, result) => {
        if(error) {
          console.log(`ERROR ${error}`);
        } else if(result.length === 0) {
          console.log(`Inserting ${user.first_name}`)
          mongo_handler.execute( () => {
            this.users.insertOne(user, (error, result) => {
              if (error) console.log(`Err :: ${error}`)
              else console.log(`Add user complete!\n${Object.keys(result.ops[0])}`)
            })
          })
        } else {
          console.log(`User exists`)
        }
      })
    }  else {
      console.log(`No user specified!`)
    }
  })
}
mongo_handler.addMessageToUser  =  (message, user) => {
  mongo_handler.execute( () => {
    console.log(`Adding message to ${user.first_name}`)
    var _messages = []
    this.users.findOne({ id: user.id }, (error, result) => {
      if(error) {
        console.log(`ERROR :: ${error}`)
      } else {
        result.messages
            ? _messages = result.messages
            : console.log(`User has no messages`)
        _messages.push(message)
        mongo_handler.execute( () => {
          this.users.updateOne(
            { id: user.id },
            { $set: { messages: _messages }}, (error, result) => {
              if(error) console.log(`ERROR :: ${error}`)
              else console.log(`User successfully updated!`)
            }
          )
        })
      }
    })
  })
}
mongo_handler.dropAllUsers  =  () => {
  mongo_handler.execute( () => {
    this.users.drop()
  })
}
mongo_handler.showAllUsers  =  (callback) => {
  console.log(`Debug point show users mhandler`)
  var usersCollection
  mongo_handler.execute( () => {
    this.users.find().toArray( (error, result) => {
      if(error) console.log(`ERROR :: ${error}`)
      else callback(result)
      console.log(`Result is ${result}`);
    })
  })
}

module.exports  =  mongo_handler
