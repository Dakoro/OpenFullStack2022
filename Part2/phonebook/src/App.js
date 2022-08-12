import { useState, useEffect } from 'react' 
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personsService from './services/personsService'
import SuccesMessage from './components/SuccesMessage'
import ErrorMessage from './components/ErrorMessage'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filterName, setFilterName] = useState('')

  const buttons = persons.map(() => true)

  const [removeButton, setRemoveButton] = useState(buttons)

  const [succesMessage, setSuccesMessage] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
 
  const getData = () => {
    personsService
      .getAll()
      .then(initialsData => setPersons(initialsData))
  }

  useEffect(getData, [])
  console.log('render', persons.length, "persons")

  const nameToShow = persons.filter((val) => {
    if (val === '') {
      return val
    } else if (val.name.toLowerCase().includes(filterName.toLowerCase())) {
      return val
    }
  })

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (checkName(persons, newName) === false) {
          personsService
            .create(personObject)
            .then(newData => {
              setPersons(persons.concat(newData))
              setNewNumber('')
              setNewName('') 
          })
          return (
            setSuccesMessage(`${newName} has been added.`),
            setTimeout(() => setSuccesMessage(null), 5000)
          )
          
    }
  }
  
  const handleRemove = (id) => {
    const name = persons.filter(item => item.id === id).map(item => item.name)
    console.log(name)
    const message = window.confirm(`Do you want to delete ${name}`)
    const result = buttons
    if (buttons[id - 1] === true) result[id -1] = false
    setRemoveButton(result)
    if (message === true) {
      personsService
        .remove(id)
        .then(updateData => {
          console.log(updateData)
          setPersons(persons.filter(item => item.id !== id))
        })
      setSuccesMessage(`${name} was deleted`)
      setTimeout(() => setSuccesMessage(null), 5000)
    } else {
      setSuccesMessage(`${name} wasn't deleted`)
      setTimeout(() => setSuccesMessage(null), 5000)
    } 
  }

  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterName = (event) => {
    setFilterName(event.target.value)
  }
  
  const checkName = (arr, val) => {
    return arr.some((item) => {
      return item.name === val
    })
  }
  
  const handleChekName = () => {
    const index = persons.filter(item => item.name === newName).map(item => item.id)
    const id = index[0]
    const person = persons.find(item => item.id === id)
    const changedNumber = {...person, number: newNumber}
    
    if (checkName(persons, newName) === true) {
      console.log(checkName(persons, newName))
      const message = window.confirm(`${newName} is already in the phonebook, replace the old number with the new one ?`)
      if (message === true) {
        return (
          personsService
            .update(id, changedNumber)
            .then(updateData => {
              console.log(updateData)
              setPersons(persons.map(item => item.id !== id ? item : updateData))
              setNewNumber('')
              setNewName('')   
              setSuccesMessage(`${newName}'s phone number has been updated.`)
              setTimeout(() => setSuccesMessage(null), 5000)
              })
            .catch(()=> {
              setErrorMessage(`${newName} was already deleted from the server`)
              setTimeout(() => setErrorMessage(null), 5000)
              setPersons(persons.filter(item => item.id !== id))
            })
          )
        } else {
            return (
              setSuccesMessage(`${newName} hasn't been updated`),
              setTimeout(() => setSuccesMessage(null), 5000)   
          )
        }
      }
    }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <h3>add a new</h3>
      <PersonForm
        add={addPerson} 
        name={newName}
        number={newNumber}
        changeName={handleChangeName}
        changeNumber={handleChangeNumber}
        checkName={handleChekName}
      />
      <SuccesMessage succes={succesMessage} />
      <ErrorMessage error={errorMessage} />
      <h3>Numbers</h3>
      <Person filter={nameToShow} handleRemove={handleRemove} />
    </div>
  )
}

export default App