const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Parent = require('./Parent');

const childSchema = new Schema ({
  name: {type: String},
  lastName: {type: String},
  gender: {type: String},
  birth: {type: String},
  lunch: {type: Boolean},
  morning: {type: Boolean},
  owner: {type: Schema.Types.ObjectId, ref: 'Parent'}
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child;