const mongoose = require('mongoose')
const crypto = require('crypto')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    securityStamp: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

//Cascade delete
userSchema.pre('deleteOne', async function (next) {
  await mongoose.model('Post').deleteMany({ author: this._id })
  next()
})

userSchema.methods.updateSecurityStamp = function () {
  const cryptoString = crypto.randomBytes(32).toString('hex')
  this.securityStamp = cryptoString
  return cryptoString
}

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
})

const User = mongoose.model('User', userSchema)
module.exports = { User }
