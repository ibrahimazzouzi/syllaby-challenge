import { Link } from "react-router-dom"
import { Card } from "antd"
import { formatDistanceToNow } from 'date-fns'
import { trimString } from "../utils"

function SectionCard ({ section }) {
  return (
    <Card
      title={trimString(section.title)}
      extra={<Link to={`/sections/${section.id}`}>open</Link>}
    >
      <p>Created : {formatDistanceToNow(section.created_at)}</p>
    </Card>
  )
}

export default SectionCard
