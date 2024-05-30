const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user

    if (!body.title || !body.url) {
        res.status(400).send({ error: 'Bad Request: title or url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if(user && blog && user._id.toString() === blog.user.toString()) {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } else {
        return res.status(400).json({error: 'error while deleting: invalid user or id'})
    }
})

blogsRouter.put('/:id', async (req, res) => {
    const { title, author, url, likes } = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )

    res.json(updatedBlog)
})

module.exports = blogsRouter