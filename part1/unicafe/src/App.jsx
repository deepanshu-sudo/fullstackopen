import { useState } from "react"

const Header = ({text}) => <h1>{text}</h1>
const Button = ({setter,value,text}) => <button onClick={() => setter(value+1)}>{text}</button>
const StatisticLine = ({text,value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({good,neutral,bad}) => {
  const all = good+neutral+bad

  if(all === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  const average = ((good*1)+(bad*-1))/all
  const positive = good*100/all
  return (
    <>
      <Header text='statistics' />
      <table>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive} />
      </table>
    </>
  )
}

const App = () => {
  const [ good, setGood ] = useState(0)
  const [ neutral, setNeutral ] = useState(0)
  const [ bad, setBad ] = useState(0)

  return (
    <>
      <Header text='give feedback' />
      <Button setter={setGood} value={good} text='good'/>
      <Button setter={setNeutral} value={neutral} text='neutral'/>
      <Button setter={setBad} value={bad} text='bad'/>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  )
}

export default App