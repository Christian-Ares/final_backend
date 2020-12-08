const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Parent = require('./Parent');

const childSchema = new Schema ({
  name: {type: String},
  age: {type: String},
  owner: {type: Schema.Types.ObjectId, ref: 'Parent'}
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child;