
const Course = (props) => {
  const {course} = props
  const arrParts = course.parts.reduce((arr, part) => {
    arr.push(part.exercises)
    return arr
  }, [])

  const total = arrParts.reduce((sum, part) => {return sum + part}, 0)
  
  return (
    <>
      <Header course = {course.name} />
      <Content parts = {course.parts} />
      <Total sum = {total} />
    </>
  )
}
export default Course

const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = (props) => {
  const {part} = props
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = (props) => { 
  const {parts} = props
  return (
    <>
      {parts.map((value, index) => {
        return <Part key={index} part={value} />
      })}
    </>
  )
}

