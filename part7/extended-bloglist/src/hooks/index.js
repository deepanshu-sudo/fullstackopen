import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'

import { setBlogs } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

import userService from '../services/users'
import blogService from '../services/blogs'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

export const useUsers = (blogs) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        userService.getAll().then((users) => setUsers(users))
    }, [blogs])

    return users
}

export const useBlogs = () => {
    const dispatch = useDispatch()
    const blogs = useSelector((state) => state.blogs)

    useEffect(() => {
        blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)))
    }, [dispatch])

    return blogs
}

export const useNotification = () => {
    const dispatch = useDispatch()

    const notify = (message, className) => {
        dispatch(setNotification({ message, className }))
        setTimeout(() => dispatch(clearNotification()), 5000)
    }

    return notify
}
