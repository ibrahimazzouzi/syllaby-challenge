export {
  trimString
}

const permissions = {
  'author': ['create', 'edit'],
  'collaborator': ['edit']
}

export const hasAccess = (role, action) => permissions[role].includes(action)

function trimString (string, max=22) {
  if (string.length > max) return `${string.substring(0, max - 1)}...`
  return string
}
