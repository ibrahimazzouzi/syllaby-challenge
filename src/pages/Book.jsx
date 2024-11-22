import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from '../components/Loader'
import { editBook, fetchBook } from '../api/books'
import { createSection } from '../api/sections'
import { Button, Modal, Input } from "antd"
import SectionsList from "../components/SectionsList"
import { hasAccess } from "../utils"
import { useAuth } from "../store/authStore"
const { TextArea } = Input

const initialModalState = { show: false, title: '', content: '' }

function Book () {

  const { user } = useAuth()
  const { id: bookId } = useParams()
  const queryClient = useQueryClient()
  const bookQueryKey = ['book', bookId]

  const [ globalError, setGlobalError ] = useState(null)
  const [ newSectionModal, setNewSectionModal ] = useState(initialModalState)
  const closeModal = () => setNewSectionModal(initialModalState)
  const openModal = () => setNewSectionModal({ ...initialModalState, show: true })

  const [ editBookModal, setEditBookModal ] = useState({ show: false })
  const closeEditBookModal = () => setEditBookModal({ show: false })

  const newSectionMutation = useMutation({
    mutationFn: createSection,
    onSettled
  })

  const editBookMutation = useMutation({
    mutationFn: editBook,
    onSettled: editBookSettled
  })

  const { data, isLoading, error } = useQuery({
    queryFn: fetchBook,
    queryKey: bookQueryKey
  })

  useEffect(() => {
    return () => (
      queryClient.invalidateQueries(bookQueryKey)
    )
  }, [])

  const loading = (
    isLoading ||
    editBookMutation.isLoading ||
    newSectionMutation.isLoading
  )

  if (loading) return <Loader />
  if (error) return <p>Error fetching book</p>

  const handleSubmit = () => {
    if (!newSectionModal.title || !newSectionModal.content) {
      return setGlobalError('Title and content are required')
    }

    newSectionMutation.mutate({
      title: newSectionModal.title,
      content: newSectionModal.content,
      book_id: bookId
    })
  }

  function onSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message)
    queryClient.invalidateQueries(bookQueryKey)
    closeModal()
  }

  function editBookSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message)
    queryClient.invalidateQueries(bookQueryKey)
    closeEditBookModal()
  }

  const handleSubmitEditBook = () => {
    editBookMutation.mutate({
      id: bookId,
      title: editBookModal.title
    })
  }

  const book = data.body
  
  const newSectionModalContent = newSectionModal.show ? (
    <Modal centered title="Add new section" open={newSectionModal.show} footer={false} onCancel={closeModal}>
      <div className="modal-content">
        { globalError ? <div className="validation-error">{globalError}</div> : '' }
        <Input
          value={newSectionModal.title}
          onChange={e => setNewSectionModal({ ...newSectionModal, title: e.target.value })}
          placeholder="Section title"
        />
        <TextArea
          value={newSectionModal.content}
          onChange={e => setNewSectionModal({ ...newSectionModal, content: e.target.value })}
          placeholder="Section content"
          style={{ height: 200 }}
        />
        <Button onClick={handleSubmit} type="primary">Create</Button>
      </div>
    </Modal>
  ) : ''

  const editBookModalContent = editBookModal.show ? (
    <Modal centered title="Edit book" open={editBookModal.show} footer={false} onCancel={closeEditBookModal}>
      <div className="modal-content">
        { globalError ? <div className="validation-error">{globalError}</div> : '' }
        <Input
          value={editBookModal.title}
          onChange={e => setEditBookModal({ ...editBookModal, title: e.target.value })}
          placeholder="Book title"
        />
        <Button onClick={handleSubmitEditBook} type="primary">Save</Button>
      </div>
    </Modal>
  ) : ''

  return (
    <div>

      { newSectionModalContent }
      { editBookModalContent }

      <div className="heading">
        <div className="section-title">{book.title}</div>
        <div className="actions">
          { hasAccess(user.role, 'edit') ? <Button onClick={() => setEditBookModal({ show: true, title: book.title })}>Edit book</Button> : '' }
          { hasAccess(user.role, 'create') ? <Button onClick={openModal}>Create section</Button> : '' }
        </div>
      </div>

      <SectionsList
        sections={book.sections}
        fallback="This book doesn't have sections yet."
      />

    </div>
  )
}

export default Book
