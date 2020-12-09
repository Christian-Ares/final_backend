const mongoose = require('mongoose')
const Schema = mongoose.Schema

const parentSchema = new Schema ({
  name: {type: String},
  lastName: {type: String},
  address: {type: String},
  username: {type: String, required: true},
  password: {type: String, required: true},
})

const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent;