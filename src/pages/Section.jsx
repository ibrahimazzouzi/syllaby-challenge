import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Loader from '../components/Loader'
import { fetchSection } from "../api/sections"
import { createSection, editSection } from '../api/sections'
import { Button, Modal, Input } from "antd"
import { useAuth } from "../store/authStore"
import SectionsList from "../components/SectionsList"
import { hasAccess } from "../utils"
const { TextArea } = Input

const initialModalState = { show: false, title: '', content: '' }

function Section () {

  const { user } = useAuth()
  const { id: sectionId } = useParams()
  const queryClient = useQueryClient()
  const sectionQueryKey = ['section', sectionId]
  const [ globalError, setGlobalError ] = useState(null)

  const [ newSectionModal, setNewSectionModal ] = useState(initialModalState)
  const closeModalNewSection = () => setNewSectionModal(initialModalState)
  const openModalNewSection = () => setNewSectionModal({ ...initialModalState, show: true })

  const newSectionMutation = useMutation({
    mutationFn: createSection,
    onSettled: onSettledNewSection
  })

  const editSectionMutation = useMutation({
    mutationFn: editSection,
    onSettled: editSectionSettled
  })

  const { data, isLoading, error } = useQuery({
    queryFn: fetchSection,
    queryKey: sectionQueryKey
  })

  const [ editSectionModal, setEditSectionModal ] = useState({ show: false })

  const closeModalEditSection = () => (
    setEditSectionModal({ show: false })
  )

  const openModalEditSection = () => setEditSectionModal({
    show: true,
    title: data.body.title,
    content: data.body.content
  })

  useEffect(() => {
    return () => (
      queryClient.invalidateQueries(sectionQueryKey)
    )
  }, [])

  if (isLoading) return <Loader />
  if (error) return <p>Error fetching book</p>

  const section = data.body
  const hasSections = section?.sub_sections?.length

  const handleCreateSection = () => {
    if (!newSectionModal.title || !newSectionModal.content) {
      return setGlobalError('Title and content are required')
    }

    const { book_id } = section
    newSectionMutation.mutate({
      title: newSectionModal.title,
      content: newSectionModal.content,
      parent_id: sectionId,
      book_id,
    })
    closeModalNewSection()
    queryClient.invalidateQueries(sectionQueryKey)
  }

  function onSettledNewSection ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message)
    queryClient.invalidateQueries(sectionQueryKey)
    closeModalNewSection()
  }

  function editSectionSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message)
    queryClient.invalidateQueries(sectionQueryKey)
    closeModalEditSection()
  }

  const handleEditSection = () => {
    const book_id = section.book_id
    const parent_id = section.parent_id
    editSectionMutation.mutate({
      title: editSectionModal.title,
      content: editSectionModal.content,
      ...( parent_id ? { parent_id } : {} ),
      book_id,
      sectionId
    })
  }
  
  const newSectionModalContent = (
    <Modal centered title="Add new section" open={newSectionModal.show} footer={false} onCancel={closeModalNewSection}>
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
        <Button onClick={handleCreateSection} type="primary">Create</Button>
      </div>
    </Modal>
  )

  const editSectionModalContent = (
    <Modal centered title="Edit section" open={editSectionModal.show} footer={false} onCancel={closeModalEditSection}>
      <div className="modal-content">
        { globalError ? <div className="validation-error">{globalError}</div> : '' }
        <Input
          value={editSectionModal.title}
          onChange={e => setEditSectionModal({ ...editSectionModal, title: e.target.value })}
          placeholder="Section title"
        />
        <TextArea
          value={editSectionModal.content}
          onChange={e => setEditSectionModal({ ...editSectionModal, content: e.target.value })}
          placeholder="Section content"
          style={{ height: 200 }}
        />
        <Button onClick={handleEditSection} type="primary">Update</Button>
      </div>
    </Modal>
  )

  return (
    <div>
      { newSectionModal.show ? newSectionModalContent : '' }
      { editSectionModal.show ? editSectionModalContent : '' }
      { globalError ? <div className="validation-error">{globalError}</div> : '' }
      <div className="heading">
        <div className="section-title">{section.title}</div>
        <div className="actions">
          { hasAccess(user.role, 'edit') ? <Button onClick={openModalEditSection}>Edit section</Button> : '' }
          { hasAccess(user.role, 'create') ? <Button onClick={openModalNewSection}>New section</Button> : '' }
        </div>
      </div>
      <div className="section-content">
        {section.content}
      </div>
      <SectionsList
        sections={section.sub_sections}
        fallback="This section has no sub sections within it yet"
      />
    </div>
  )
}

export default Section
