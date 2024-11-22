import { LOGIN_ROUTE, REGISTER_ROUTE } from '.'

export {
  register,
  login
}

async function register (payload) {
  try {
    const response = await fetch(REGISTER_ROUTE, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
  
    const responseBody = await response.json()
    return response.ok ? { body: responseBody } : { body: responseBody, error: true }
  } catch (err) {
    console.error(err)
    return { body: { message: err.message || 'Uknown error has accured' } }
  }
}

async function login (payload) {
  try {
    const response = await fetch(LOGIN_ROUTE, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
  
    const responseBody = await response.json()
    return response.ok ? { body: responseBody } : { body: responseBody, error: true }
  } catch (err) {
    console.error(err)
    return { body: { message: err.message || 'Uknown error has accured' } }
  }
}
