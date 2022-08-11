import { useState } from "react"
const Feedback = (props) => {
  return (
    <div>
      <h2>give feedbak</h2>
      <Button text = "good" clickType = {props.goodClick} />
      <Button text = "neutral" clickType = {props.neutralClick} />
      <Button text = "bad" clickType = {props.badClick} />
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.clickType}>{props.text}</button>
  )
}

const Statistics = (props) => {
  if (props.goodCount === 0 && props.badCount === 0 && props.neutralCount === 0){
    return (
    <div>
      <h2>statistics</h2>
      <p>No feedback given</p>
    </div>
    )
  }

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <StatisticLine text = "good" value = {props.goodCount} />
        <StatisticLine text = "neutral" value = {props.neutralCount} />
        <StatisticLine text = "bad" value = {props.badCount} />
        <StatisticLine text = "all" value = {props.total} />
        <StatisticLine text = "average" value = {props.average} />
        <StatisticLine text = "positive" value = {props.positive} />
      </table>
    </div>
  )
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (
      <tr>
        <td>{props.text}</td> 
        <td>{props.value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + bad + neutral
  const average = (good - bad) / total
  const handleClickGood = () => {
    setGood(good + 1)
  }

  const handleClickNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleClickBad = () => {
    setBad(bad + 1)
  }
  return (
    <div>
      <Feedback 
      goodClick = {handleClickGood} 
      neutralClick = {handleClickNeutral} 
      badClick = {handleClickBad}  
      />
      <Statistics 
        goodCount = {good} 
        neutralCount = {neutral} 
        badCount = {bad} 
        total = {total} 
        positive = {(good / total)*100}
        average = {average}
      />
    </div>
  )
}

export default App;