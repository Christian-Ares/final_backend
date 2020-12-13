const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Parent = require('./Parent');

const childSchema = new Schema ({
  name: {type: String},
  lastName: {type: String},
  gender: {type: String},
  birth: {type: String},
  lunch: {type: Boolean, default: false},
  morning: {type: Boolean, default: false},
  owner: {type: Schema.Types.ObjectId, ref: 'Parent'}
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child;