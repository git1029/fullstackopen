import React from 'react'

const Persons = ({ persons, removePerson }) => (
  <>
    {persons.map(person =>
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>
          delete
        </button>
      </div>  
    )}
  </>
)

export default Persons