import React from 'react'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    find countries <input 
      value={filter}
      onChange={handleFilterChange}
    />
  </div>
)

export default Filter