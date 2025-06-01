import { Post } from '../db/models/post'

export async function creatPost({ title, author, contents, tags }) {
  const newPost = Post({ title, author, contents, tags })
  return await newPost.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return listPosts({}, options)
}

export async function listPostByAuthor(author, options) {
  return listPosts({ author }, options)
}

export async function listPostByTags(tags, options) {
  return listPosts({ tags }, options)
}
