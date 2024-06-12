import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { createSelector } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"
import { showNotification } from "../reducers/notificationReducer"

const selectAnecdotes = state => state.anecdotes
const selectFilter = state => state.filter

const selectFilteredAnecdotes = createSelector(
    [selectAnecdotes, selectFilter],
    (anecdotes, filter) => {
        const filteredAnecdotes = filter === ""
            ? [...anecdotes]
            : [...anecdotes].filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        return filteredAnecdotes.sort((a, b) => b.votes - a.votes);
    }
)

const AnecdoteList = () => {
    const anecdotes = useSelector(selectFilteredAnecdotes)
    const dispatch = useDispatch()

    const vote = (id, anecdote) => {
        const updatedAnecdote = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        anecdoteService
            .update(id, updatedAnecdote)
            .then(returnedAnecdote => dispatch(voteAnecdote(returnedAnecdote.id)))

        dispatch(showNotification(`You voted for ${anecdote.content}`,10))
    }

    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes} votes
                        <button onClick={() => vote(anecdote.id, anecdote)}>vote</button>
                        <br /><br />
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList