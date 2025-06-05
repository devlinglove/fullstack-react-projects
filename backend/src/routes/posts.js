//import { getPostById, listAllPosts } from '../services/posts'
const {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
} = require('../services/posts.js')

const { requiredAuth } = require('../middleware/jwt.js')

function postsRoutes(app) {
  app.get('/api/v1/posts', requiredAuth, async (req, res) => {
    const { sortOrder, sortBy } = req.query
    try {
      const allPosts = await listAllPosts({ sortOrder, sortBy })
      return res.json(allPosts)
    } catch (error) {
      console.error('error listing posts', error)
      return res.status(500).end()
    }
  })
  app.post('/api/v1/posts', async (req, res) => {
    try {
      const createdPost = await createPost(req.body)
      return res.json(createdPost)
    } catch (error) {
      console.error('error creating post', error)
      return res.status(500).end()
    }
  })
  app.post('/api/v1/posts', async (req, res) => {
    try {
      const createdPost = await createPost(req.body)
      return res.json(createdPost)
    } catch (error) {
      console.error('error creating post', error)
      return res.status(500).end()
    }
  })
  app.put('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)
      return res.json(post)
    } catch (error) {
      console.error('error updating post', error)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post === null) {
        return res.status(400).end()
      }
      return res.json(post)
    } catch (error) {
      console.error('error getting post', error)
      return res.status(500).end()
    }
  })
  app.delete('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const { deletedCount } = await deletePost(id)
      if (deletedCount === 0) {
        //return res.sendStatus(404)
        return res.status(404).end()
      }
      return res.status(204).end()
    } catch (error) {
      console.error('error getting post', error)
      return res.status(500).end()
    }
  })
}

module.exports = { postsRoutes }
