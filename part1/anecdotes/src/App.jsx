import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button> 

const Header = ({name}) => <h1>{name}</h1>

const Anecdote = ({text,votes}) => {
  return (
    <p>{text} <br /> has {votes} votes</p>
  )
}

const Winner = ({anecdotes,votes}) => {
  const maxVotes = Math.max(...votes)
  const winner = anecdotes[votes.indexOf(maxVotes)]

  if(maxVotes === 0) {
    return (
      <p>no winner yet.</p>
    )
  }

  return (
    <Anecdote text={winner} votes={maxVotes} />
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const getRandomInt = (max) => Math.floor(Math.random()*max)

  const handleNextAnecdote = () => setSelected(getRandomInt(anecdotes.length))

  const handleVote = () => {
    const updatedVotes = [...votes]
    updatedVotes[selected] += 1
    setVotes(updatedVotes)
  }

  return (
    <>
      <div>
        <Header name='Anecdote of the day' />
        <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
        <Button text='vote' onClick={handleVote} />
        <Button text='next anecdote' onClick={handleNextAnecdote} />

        <Header name='Anecdote with most votes' />
        <Winner anecdotes={anecdotes} votes={votes} />
      </div>
    </>
  )
}

export default App
