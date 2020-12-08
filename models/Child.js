const mongoose = require('mongoose')
const Schema = mongoose.Schema

const childSchema = new Schema ({

})

const Child = mongoose.model('Child', childSchema)

module.exports = Child;