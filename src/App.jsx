import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import Home from './pages/Home'
import Books from './pages/Books'
import Book from './pages/Book'
import Section from './pages/Section'
import Collaborators from './pages/Collaborators'
import Login from './pages/Login'
import Register from './pages/Register'
import { MainWrapper, AuthWrapper } from './components/Wrapper'

const queryClient = new QueryClient()

export const appRoutes = [
  { path: '/', page: <Home />, wrapper: 'main', access: ['author', 'collaborator']},
  { path: '/books', page: <Books />, wrapper: 'main', access: ['author', 'collaborator']},
  { path: '/books/:id', page: <Book />, wrapper: 'main', access: ['author', 'collaborator']},
  { path: '/sections/:id', page: <Section />, wrapper: 'main', access: ['author', 'collaborator']},
  { path: '/collaborators', page: <Collaborators />, wrapper: 'main', access: ['author']},
  { path: '/register', page: <Register />, wrapper: 'auth'},
  { path: '/login', page: <Login />, wrapper: 'auth'},
  { path: '/*', page: ( <div>not found</div> ), wrapper: null },
]

const router = createBrowserRouter(appRoutes.map(route => {
  const Wrapper =
    route.wrapper === 'auth'
    ? AuthWrapper
    : MainWrapper
  
  return { ...route, element: <Wrapper>{route.page}</Wrapper> }
}))

function App () {
  return <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
}

export default App
