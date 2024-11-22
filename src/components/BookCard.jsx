import { Link } from "react-router-dom"
import { Card } from "antd"
import { formatDistanceToNow } from 'date-fns'
import { trimString } from "../utils"

function BookCard ({ book }) {
  return (
    <Card
      title={trimString(book.title)}
      extra={<Link to={`/books/${book.id}`}>open</Link>}
    >
      <p>Created : {formatDistanceToNow(book.created_at)}</p>
    </Card>
  )
}

export default BookCard
