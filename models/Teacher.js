const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teacherSchema = new Schema ({
  username: {type: String, required: true},
  password: {type: String, required: true},
  role: {
    type: String,
    enum : ['GUEST', 'EDITOR', 'ADMIN'],
    default : 'ADMIN'
  },

})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher;