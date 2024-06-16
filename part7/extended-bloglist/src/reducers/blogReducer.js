import { createSlice } from "@reduxjs/toolkit"

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        createBlog(state,action) {
            state.push(action.payload)
        },

        increaseLikes(state,action) {
            const {id} = action.payload
            return state.map(b => b.id !== id ? b : action.payload)
        },

        deleteBlogState(state,action) {
            const id = action.payload
            return state.filter(b => b.id !== id)
        },

        addComment(state,action) {
            return state.map(blog => 
                blog.id !== action.payload.id ? blog : {...blog, comments: blog.comments.concat(action.payload.comment)}
            )
        },

        setBlogs(state,action) {
            return action.payload
        }
    }
})

export const { createBlog, increaseLikes, deleteBlogState, addComment, setBlogs } = blogSlice.actions
export default blogSlice.reducer