import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state,action) {
            state.push(action.payload)
        },

        voteAnecdote(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(a => a.id === id)

            const changedAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            }

            return state.map(anecdote =>
                anecdote.id !== id ? anecdote : changedAnecdote
            )
        },

        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const { voteAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = anecdote => {
    return async dispatch => {
        const returnedAnecdote = await anecdoteService.create(anecdote)
        dispatch(appendAnecdote(returnedAnecdote))
    }
}

export default anecdoteSlice.reducer