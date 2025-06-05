//import { Post } from '../db/models/post'

const { Post } = require('../db/models/post')

async function createPost({ title, author, contents, tags }) {
  const newPost = Post({ title, author, contents, tags })
  return await newPost.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

async function listAllPosts(options) {
  return listPosts({}, options)
}

async function listPostByAuthor(author, options) {
  return listPosts({ author }, options)
}

async function listPostByTags(tags, options) {
  return listPosts({ tags }, options)
}

async function getPostById(postId) {
  return await Post.findById(postId)
}

async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}

module.exports = {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
}
