// require('dotenv').config()
const mongoClient      =  require("mongodb").MongoClient
const mongo_url        =  process.env.MONGOD_URL
const mongo_handler    =  this
const users_collection = process.env.USERS_COLLECTION
console.log(`Test ${mongo_url}\n${users_collection}`);
mongo_handler.execute  =  (func) => {
  mongoClient.connect(mongo_url, (error, db) => {
    if(error){ console.log(`ERROR :: ${error}`)}
    else {
      mongo_handler.users =  db.collection(users_collection)
      var result = func()
      db.close()
    }
  })
}

mongo_handler.addUser  =  (user) => {
  mongo_handler.execute( () => {
    if (user) {
      mongo_handler.users.find({id: user.id}).toArray( (error, result) => {
        if(error) {
          console.log(`ERROR ${error}`)
        } else if(result.length === 0) {
          console.log(`Inserting ${user.first_name}`)
          mongo_handler.execute( () => {
            mongo_handler.users.insertOne(user, (error, result) => {
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
    mongo_handler.users.findOne({ id: user.id }, (error, result) => {
      if(error) {
        console.log(`ERROR :: ${error}`)
      } else {
        result.messages
            ? _messages = result.messages
            : console.log(`User has no messages`)
        _messages.push(message)
        mongo_handler.execute( () => {
          mongo_handler.users.updateOne(
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
