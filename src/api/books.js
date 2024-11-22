import { BOOKS_ROUTE } from '.'

export {
  createBook,
  fetchAllBooks,
  fetchBook,
  editBook
}

async function editBook (payload) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(`${BOOKS_ROUTE}/${payload.id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: payload.title }),
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

async function createBook (payload) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(BOOKS_ROUTE, {
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

async function fetchAllBooks () {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(BOOKS_ROUTE, {
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

async function fetchBook (params) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const bookId = params.queryKey[1]
    const response = await fetch(`${BOOKS_ROUTE}/${bookId}`, {
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
