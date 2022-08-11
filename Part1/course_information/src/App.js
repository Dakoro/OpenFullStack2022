const Header = (propHeader) => (
  <h2>{propHeader.course}</h2>
)

const Content = (propContent) => {
  return (
    <div>
      <Part part = {propContent.parts[0].name} exercice = {propContent.parts[0].exercices}  />
      <Part part = {propContent.parts[1].name} exercice = {propContent.parts[1].exercices}  />
      <Part part = {propContent.parts[2].name} exercice = {propContent.parts[2].exercices}  />
    </div>
  )
}
const Part = (prop) => (
  <p>{prop.part} {prop.exercice}</p>
)

const Total = (propTotal) => (
  <p>Numbers of exercices {propTotal.total}</p>
)
const App = () => {
  const course = {
    name: "Half Stack application developpement",
    parts: [
      {
        name: "Fundamentals of React",
        exercices: 10
      },
      {
        name: "Using props to pass data",
        exercices: 7
      },
      {
        name: "State of a component",
        exercices: 14
      }
    ]
  }
  return (
    <div>
      <Header course = {course.name} />
      <Content parts = {course.parts}  />
      <Total total = {course.parts[0].exercices + course.parts[1].exercices + course.parts[2].exercices} />
    </div>
  );
}

export default App;
