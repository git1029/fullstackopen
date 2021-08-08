import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        const persons = response.data
        setPersons(persons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    // Prevent empty entries
    if (newName.length === 0) {
      return window.alert('Name cannot be blank')
    }

    // Prevent duplicate entries
    if (persons
      .map(person => person.name)
      .includes(newName)
    ) {
      return window.alert(
        `${newName} is already added to phonebook`
      )
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name
          .toUpperCase()
          .includes(filter.toUpperCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange} 
      />

      <h2>add a new</h2>
      
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
      />
    </div>
  )
}

export default App