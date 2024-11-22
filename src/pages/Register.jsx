import { useAuth } from '../store/authStore'
import { Button, Select } from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup'
import InputField from '../components/InputField'
import { useMutation } from '@tanstack/react-query'
import { register } from '../api/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialValues = {
  name: '',
  email: '',
  password: '',
  role: 'author',
}

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required(),
  role: Yup.string().required()
})

function Register () {

  const { saveUser } = useAuth()
  const [ globalError, setGlobalError ] = useState(null)

  const registerMutation = useMutation({
    mutationFn: register,
    onSettled
  })

  const roleOptions = [
    { value: 'author', label: 'Author' },
    { value: 'collaborator', label: 'Collaborator' },
  ]

  const submit = (fields) => registerMutation.mutate(fields)

  function onSettled ({ body, error: isError }) {
    if (!isError) return saveUser(body)
    setGlobalError(body.message)
  }

  return (
    <div className='auth-container'>
      <h3>Register</h3>

      { globalError ? <div className="validation-error">{globalError}</div> : '' }

      <Formik initialValues={initialValues} onSubmit={submit} validationSchema={SignupSchema}>
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleSubmit
        }) => {
          return (
            <div className='form'>
              <InputField
                error={errors.name && touched.name ? errors.name : ''}
                name='name'
                value={values.name}
                setFieldValue={setFieldValue}
                spread={{ placeholder: 'Your name', type: 'text' }}
              />

              <InputField
                error={errors.email && touched.email ? errors.email : ''}
                name='email'
                value={values.email}
                setFieldValue={setFieldValue}
                spread={{ placeholder: 'Your email', type: 'text' }}
              />

              <InputField
                error={errors.password && touched.password ? errors.password : ''}
                name='password'
                value={values.password}
                setFieldValue={setFieldValue}
                spread={{ placeholder: 'Your password', type: 'password' }}
              />
              
              <Select
                status={errors.role && touched.role? 'error' : ''}
                options={roleOptions} defaultValue={roleOptions[0].value}
                onChange={value => setFieldValue('role', value)}
                value={values.role}
              />

              <Button onClick={handleSubmit}>Register</Button>
              <p>Already have an account ? <Link to={'/login'}>login here</Link></p>
            </div>
          )
        }}
      </Formik>
    </div>
  )
}

export default Register
