import React from 'react'

const FormInput = (props) => {
  const {
    label, name, type, value, onChange
  } = props

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input 
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default FormInput