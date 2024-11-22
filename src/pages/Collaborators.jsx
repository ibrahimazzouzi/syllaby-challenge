import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import { fetchAllCollabs, createNewCollab } from '../api/collabs'
import { useAuth } from "../store/authStore"
import Loader from '../components/Loader'
import { removeCollab } from "../api/collabs"
import { hasAccess } from '../utils'

const allCollabsQueryKey = ['colabs']
const initialModalState = { show: false, email: '' }

function Collaborators () {

  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryFn: fetchAllCollabs,
    queryKey: allCollabsQueryKey
  })

  const newCollabMutation = useMutation({
    mutationFn: createNewCollab,
    onSettled
  })

  const removeCollabMutation = useMutation({
    mutationFn: removeCollab,
    onSettled: removeCollabSettled
  })

  const [ globalError, setGlobalError ] = useState(null)
  const [ newCollab, setNewCollab ] = useState(initialModalState)
  const closeModal = () => setNewCollab(initialModalState)
  const openModal = () => setNewCollab({ ...initialModalState, show: true })

  const [ removeModal, setReomveModal ] = useState(null)

  useEffect(() => {
    return () => (
      queryClient.invalidateQueries(allCollabsQueryKey)
    )
  }, [])

  const handleSubmit = () => {
    if (!newCollab.email) return setGlobalError('Email is required')
    newCollabMutation.mutate({ email: newCollab.email })
  }

  function onSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message || body.error)
    queryClient.invalidateQueries(allCollabsQueryKey)
    closeModal()
  }

  function removeCollabSettled ({ body, error: isError }) {
    if (isError) return setGlobalError(body.message || body.error)
    queryClient.invalidateQueries(allCollabsQueryKey)
    setReomveModal(null)
  }

  const handleRemoveCollaborator = () => (
    removeCollabMutation.mutate({ id: removeModal.id })
  )

  if (isLoading) return <Loader />
  if (error) return <p>Error fetching colabs</p>

  const newCollabContent = newCollab.show ? (
    <Modal
      centered
      title="Add new collaborator"
      open={newCollab.show}
      footer={false}
      onCancel={closeModal}
    >
      <div className="modal-content">
        { globalError ? <div className="validation-error">{globalError}</div> : '' }
        <Input
          value={newCollab.email}
          onChange={e => setNewCollab({ show: true, email: e.target.value })}
          placeholder="Collaborator email"
        />
        <Button onClick={handleSubmit} type="primary">Add</Button>
      </div>
    </Modal>
  ) : ''

  const removeModalContent = removeModal ? (
    <Modal
        title="Remove collaborator"
        open={removeModal}
        onOk={handleRemoveCollaborator}
        onCancel={() => setReomveModal(null)}
        okText="Remove"
      >
        <p>Are you sure you want to remove this collaborator ?</p>
      </Modal>
  ) : ''

  const collabs = data.body

  return (
    <div>
      { newCollabContent }
      { removeModalContent }
      <div className="heading">
        <h3>All collaborators</h3>
        { hasAccess(user.role, 'create') ? <Button onClick={openModal}>New Collaborator</Button> : '' }
      </div>
      <div className="collabs">
        {collabs.map(collab => (
          <div key={collab.id} className="collab">
            <span>{collab.email}</span>
            <Button danger onClick={() => setReomveModal({ id: collab.id })}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collaborators
