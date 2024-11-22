import { Input } from "antd"

function InputField (props) {
  const error = props.error

  return (
    <>
      <Input
        status={error ? 'error' : ''}
        onChange={event => props.setFieldValue(props.name, event.target.value)}
        value={props.value}
        {...props.spread}
      />
      { error ? <div className="validation-error">{error}</div> : '' }
    </>
  )
}

export default InputField
