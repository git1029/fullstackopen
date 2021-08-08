import React from 'react'
// import Country from '../components/Country'

const Results = ({ filter, results, handleShowClick }) => {
  if (filter === '' || results.length === 1) return null
  
  if (results.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  else if (results.length > 1) {
    return (
      <>
        {results.map(country => 
          <div key={country.alpha3Code}>
            {`${country.name} `}
            <button 
              onClick={handleShowClick(country)}>
                show
            </button>
          </div>
        )}
      </>
    )
  }
  else return <div>No matches found</div>
}

export default Results