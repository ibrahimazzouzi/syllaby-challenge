import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal, Spin } from "antd"
import { useEffect, useState } from "react"
import { createBook, fetchAllBooks } from '../api/books'
import BookCard from '../components/BookCard'
import { useAuth } from "../store/authStore"
import Loader from '../components/Loader'
import { hasAccess } from "../utils"

const allBooksQueryKey = ['books']
const initialModalState = { show: false, title: '' }

function Books () {

  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryFn: fetchAllBooks,
    queryKey: allBooksQueryKey
  })

  const newBookMutation = useMutation({
    mutationFn: createBook,
    onSettled
  })

  const [ globalError, setGlobalError ] = useState(null)
  const [ newBookModal, setNewBookModal ] = useState(initialModalState)
  const closeModal = () => setNewBookModal(initialModalState)
  const openModal = () => setNewBookModal({ ...initialModalState, show: true })

  useEffect(() => {
    return () => queryClient.invalidateQueries(allBooksQueryKey)
  }, [])

  const handleSubmit = () => {
    if (!newBookModal.title) return setGlobalError('Title is required')
    newBookMutation.mutate({ title: newBookModal.title })
  }

  function onSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message)
    queryClient.invalidateQueries(allBooksQueryKey)
    closeModal()
  }

  if (isLoading) return <Loader />
  if (error) return <p>Error fetching books</p>

  const newBookModalContent = newBookModal.show ? (
    <Modal centered title="Add new book" open={newBookModal.show} footer={false} onCancel={closeModal}>
      <div className="modal-content">
        { globalError ? <div className="validation-error">{globalError}</div> : '' }
        <Input
          value={newBookModal.title}
          onChange={e => setNewBookModal({ show: true, title: e.target.value })}
          placeholder="Book title"
        />
        <Button onClick={handleSubmit} type="primary">Create</Button>
      </div>
    </Modal>
  ) : ''

  const books = data.body

  return (
    <div>
      { newBookModalContent }
      <div className="heading">
        <h3>All books</h3>
        { hasAccess(user.role, 'create') ? <Button onClick={openModal}>New Book</Button> : '' }
      </div>
      <div className="list">
        {books.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  )
}

export default Books
