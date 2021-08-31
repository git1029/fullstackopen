import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    // Prevent empty entries
    if (newName.length === 0) {
      return window.alert('Name cannot be blank')
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    // Check for existing entry
    const person = persons.find(p => 
      p.name.toUpperCase() === newName.toUpperCase())

    // If exists confirm number update
    if (person) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (!confirmUpdate) return

      const updatedPerson = {
        ...person,
        number: newNumber
      }

      return personService
        .update(person.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => 
            p.id === person.id ? returnedPerson : p))
          setMessage({
            type: 'success',
            text: `Information for ${returnedPerson.name} updated successfully`
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {          
          if (error.response.status === 400) {
            setMessage({
              type: 'error',
              text: error.response.data.error
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          }
          else if (error.response.status === 404) {
            setMessage({
              type: 'error',
              text: `Information for for ${updatedPerson.name} has already been removed from server`
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== person.id))
          }
          else {
            setMessage({
              type: 'error',
              text: 'Oops, something went wrong'
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          }
        })
    }

    // If new create entry
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage({
          type: 'success',
          text: `Added ${returnedPerson.name}`
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage({
          type: 'error',
          text: error.response.data.error
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const removePerson = (id) => {
    const personToRemove = persons.find(p => p.id === id)
    
    const confirmRemove = window.confirm(`Delete ${personToRemove.name}?`)

    if (confirmRemove) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setMessage({
            type: 'error',
            text: `${personToRemove.name} already removed from server`
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
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

      <Notification message={message} />
      
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
        removePerson={removePerson}
      />
    </div>
  )
}

export default App