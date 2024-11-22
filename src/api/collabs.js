import { COLLABS_ROUTE } from '.'

export {
  fetchAllCollabs,
  createNewCollab,
  removeCollab
}

async function createNewCollab (payload) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(COLLABS_ROUTE, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  
    const responseBody = await response.json()
    return response.ok ? { body: responseBody } : { body: responseBody, error: true }
  } catch (err) {
    console.error(err)
    return { body: { message: err.message || 'Uknown error has accured' } }
  }
}

async function removeCollab ({ id: collabId }) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(`${COLLABS_ROUTE}/${collabId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  
    const responseBody = await response.json()
    return response.ok ? { body: responseBody } : { body: responseBody, error: true }
  } catch (err) {
    console.error(err)
    return { body: { message: err.message || 'Uknown error has accured' } }
  }
}

async function fetchAllCollabs () {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(COLLABS_ROUTE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  
    const responseBody = await response.json()
    return response.ok ? { body: responseBody } : { body: responseBody, error: true }
  } catch (err) {
    console.error(err)
    return { body: { message: err.message || 'Uknown error has accured' } }
  }
}
