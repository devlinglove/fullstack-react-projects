//import { getPostById, listAllPosts } from '../services/posts'
const {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
} = require('../services/posts.js')

const { requiredAuth } = require('../middleware/jwt.js')
const express = require('express')

const router = express.Router()

router.route('/').get(async (req, res) => {
  const { sortOrder, sortBy } = req.query
  try {
    const allPosts = await listAllPosts({ sortOrder, sortBy })
    return res.json(allPosts)
  } catch (error) {
    console.error('error listing posts', error)
    return res.status(500).end()
  }
})

module.exports = router
