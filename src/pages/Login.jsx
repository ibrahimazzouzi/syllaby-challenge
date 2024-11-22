import { useAuth } from '../store/authStore'
import { Button, Select } from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup'
import InputField from '../components/InputField'
import { useMutation } from '@tanstack/react-query'
import { login } from '../api/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialValues = {
  email: '',
  password: ''
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required()
})

function Login () {

  const { saveUser } = useAuth()
  const [ globalError, setGlobalError ] = useState(null)

  const loginMutation = useMutation({
    mutationFn: login,
    onSettled
  })

  const submit = (fields) => loginMutation.mutate(fields)

  function onSettled ({ body, error: isError }) {
    if (!isError) return saveUser(body)
    setGlobalError(body.error || body.message)
  }

  return (
    <div className='auth-container'>
      <h3>Login</h3>

      { globalError ? <div className="validation-error">{globalError}</div> : '' }

      <Formik initialValues={initialValues} onSubmit={submit} validationSchema={LoginSchema}>
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

              <Button onClick={handleSubmit}>Login</Button>
              <p>Do not have an account yet ? <Link to={'/register'}>register here</Link></p>
            </div>
          )
        }}
      </Formik>
    </div>
  )
}

export default Login
