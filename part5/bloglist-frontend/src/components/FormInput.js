import React from 'react'
import PropTypes from 'prop-types'

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

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default FormInput