const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teacherSchema = new Schema ({
  name: {type: String},
  age: {type: String},
  speciality: {type: String},
  education: {type: String},
  role: {
    type: String,
    enum : ['GUEST', 'EDITOR', 'ADMIN'],
    default : 'EDITOR'
  },
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher;