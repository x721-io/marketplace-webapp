import { Spinner } from 'flowbite-react'

interface Props {
  loading?: boolean
  data?: any[]
}

export default function SearchUserTab({ loading, data }: Props) {
  if (loading) return (
    <Spinner size="xl"/>
  )


  return (
    <div>
      User
    </div>
  )
}