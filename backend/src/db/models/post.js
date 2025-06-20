//import mongoose, { Schema } from 'mongoose'

const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    //author: String,
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    contents: String,
    tags: [String],
  },
  {
    timestamps: true,
  },
)

const Post = mongoose.model('Post', postSchema)
module.exports = { Post }
