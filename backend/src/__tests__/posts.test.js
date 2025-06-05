//import mongoose from 'mongoose'
const mongoose = require('mongoose')
//import { describe, expect, test } from '@jest/globals'
const { describe, expect, test, beforeEach } = require('@jest/globals')
const {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
} = require('../services/posts.js')
const { Post } = require('../db/models/post.js')
//import { createPost, getPostById } from '../services/posts.js'
//import { Post } from '../db/models/post.js'

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: 'Daniel Bugl',
      contents: 'This post is stored in MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundPost = await getPostById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      contents: 'Post with no title',
      tags: ['empty'],
    }
    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (let post of samplePosts) {
    let createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('with all parameters should succeed', async () => {
    const allPosts = await listAllPosts()
    expect(allPosts.length).toEqual(createdSamplePosts.length)
  })
  test('should return posts sorted by creationdate descending by default', async () => {
    const allPosts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(allPosts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  test('should take into account provided sorting options', async () => {
    const allPosts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(allPosts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const postById = await getPostById(createdSamplePosts[0]._id)
    //console.log('postById.toObject()', postById.toObject())
    //console.log('postById-------.toObject()', createdSamplePosts[0].toObject())
    expect(postById.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const postById = await getPostById('000000000000000000000000')
    expect(postById).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })
  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual(createdSamplePosts[0].title)
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const updatedPost = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(updatedPost).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
