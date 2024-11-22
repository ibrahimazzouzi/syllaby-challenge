import { SECTIONS_ROUTE } from '.'

export {
  createSection,
  fetchSection,
  editSection
}

async function createSection (payload) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(SECTIONS_ROUTE, {
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

async function fetchSection (params) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const sectionId = params.queryKey[1]
    const response = await fetch(`${SECTIONS_ROUTE}/${sectionId}`, {
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

async function editSection (payload) {
  try {
    const storage = JSON.parse(localStorage.getItem('app-store'))
    const token = storage?.state?.user?.token
    if (!token) throw new Error('User is not authenticated')

    const response = await fetch(`${SECTIONS_ROUTE}/${payload.sectionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        parent_id: payload.parent_id,
        book_id: payload.book_id
      }),
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
