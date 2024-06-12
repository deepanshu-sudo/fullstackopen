import { createSlice } from "@reduxjs/toolkit"

const initialState = ""

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotification(state,action) {
            return action.payload
        },

        removeNotification(state,action) {
            return initialState
        }
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const showNotification = (message, timeInSeconds) => {
    return dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(removeNotification())
        }, timeInSeconds*1000)
    }
}

export default notificationSlice.reducer