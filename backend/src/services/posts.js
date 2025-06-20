//import { Post } from '../db/models/post'

const { Post } = require('../db/models/post')

async function createPost(userId, { title, contents, tags }) {
  const newPost = new Post({ title, author: userId, contents, tags })
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

async function listFilterAllPosts(filter = {}, options) {
  return listPosts(filter, options)
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

async function updatePost(userId, postId, { title, author, contents, tags }) {
  console.log('title', title)
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author: userId, contents, tags } },
    { new: true, runValidators: true },
  )

  return post
}

async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

module.exports = {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
  listFilterAllPosts,
}
