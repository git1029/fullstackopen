import React from 'react'

const Persons = ({ persons }) => (
  <>
    {persons.map(person =>
      <div key={person.name}>
        {person.name} {person.number}
      </div>  
    )}
  </>
)

export default Persons