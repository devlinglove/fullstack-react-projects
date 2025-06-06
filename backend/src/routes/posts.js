//import { getPostById, listAllPosts } from '../services/posts'
const {
  createPost,
  getPostById,
  listAllPosts,
  updatePost,
  deletePost,
} = require('../services/posts.js')

const { requiredAuth } = require('../middleware/jwt.js')
const { catchAsync } = require('../utils/catchAsync.js')
const { AppError } = require('../utils/appError.js')

function postsRoutes(app) {
  app.get(
    '/api/v1/posts',
    requiredAuth,
    catchAsync(async (req, res) => {
      const { sortOrder, sortBy } = req.query
      const allPosts = await listAllPosts({ sortOrder, sortBy })
      return res.json(allPosts)
    }),
  )

  app.post(
    '/api/v1/posts',
    requiredAuth,
    catchAsync(async (req, res) => {
      const createdPost = await createPost(req.auth.sub, req.body)
      return res.json(createdPost)
    }),
  )
  //   app.post('/api/v1/posts', async (req, res) => {
  //     try {
  //       const createdPost = await createPost(req.body)
  //       return res.json(createdPost)
  //     } catch (error) {
  //       console.error('error creating post', error)
  //       return res.status(500).end()
  //     }
  //   })
  app.put(
    '/api/v1/posts/:id',
    requiredAuth,
    catchAsync(async (req, res, next) => {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      if (post == null) {
        return next(new AppError('No post found with that ID', 404))
      }
      return res.json(post)
    }),
  )
  app.get(
    '/api/v1/posts/:id',
    catchAsync(async (req, res, next) => {
      const { id } = req.params
      const post = await getPostById(id)
      if (post === null) {
        return next(new AppError('No post found with this id', 404))
      }
      return res.json(post)
    }),
  )
  app.delete(
    '/api/v1/posts/:id',
    requiredAuth,
    catchAsync(async (req, res, next) => {
      const { id } = req.params
      const { deletedCount } = await deletePost(req.auth.sub, id)
      if (deletedCount === 0) {
        //return res.sendStatus(404)
        return next(new AppError('No post found with this id', 404))
      }
      return res.status(204).end()
    }),
  )
}

module.exports = { postsRoutes }
