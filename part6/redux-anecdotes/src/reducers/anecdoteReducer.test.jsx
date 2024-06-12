import { describe, test } from 'vitest'
import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

describe('anecdoteReducer', () => {
    test('a new anecdote can be added', () => {
        const state = []
        const action = {
            type: 'anecdotes/createAnecdote',
            payload: {
                content: 'If it hurts, do it more often',
                id: 1,
                votes: 0
            }
        }

        deepFreeze(state)
        const newState = anecdoteReducer(state,action)

        expect(newState).toHaveLength(1)
        expect(newState).toContainEqual(action.payload)
    })

    test('a anecdote can be voted', () => {
        const state = [
            {
                content: 'If it hurts, do it more often',
                id: 1,
                votes: 0
            },
            {
                content: 'Adding manpower to a late software project makes it later!',
                id: 2,
                votes: 0
            }
        ]

        const action = {
            type: 'anecdotes/voteAnecdote',
            payload: {
                id: 2
            }
        }

        deepFreeze(state)
        const newState = anecdoteReducer(state, action)

        expect(newState).toHaveLength(2)

        expect(newState).toContainEqual(state[0])

        expect(newState).toContainEqual({
            content: 'Adding manpower to a late software project makes it later!',
            id: 2,
            votes: 1
        })
    })
})