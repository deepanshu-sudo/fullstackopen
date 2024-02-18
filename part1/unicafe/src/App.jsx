import { useState } from "react"

const Header = ({name}) => <h1>{name}</h1>

const Button = ({handleClick,text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text,value}) => {
  if(text === "positive") {
    return (
      <tr>
      <td>{text}</td>
      <td>{value} %</td>
    </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({clicks}) => {
  const total = clicks.good + clicks.neutral + clicks.bad
  const average = (clicks.good * 1 + clicks.bad * - 1) / total
  const positive = clicks.good * (100/total)

  if(total === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <StatisticLine text="good" value={clicks.good} />
      <StatisticLine text="neutral" value={clicks.neutral} />
      <StatisticLine text="bad" value={clicks.bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
    </table>
  )
}

const App = () => {
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0
  })

  const handleGoodClick = () => {
    setClicks({...clicks, good: clicks.good+1})
  }

  const handleBadClick = () => {
    setClicks({...clicks, bad: clicks.bad+1})
  }

  const handleNeutralClick = () => {
    setClicks({...clicks, neutral: clicks.neutral+1})
  }

  return (
    <>
      <Header name="give feedback" />
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Header name="statistics" />
      <Statistics clicks={clicks} />
    </>
  )
}

export default App