import { Spinner } from 'flowbite-react'

interface Props {
  loading?: boolean
  data?: any[]
}

export default function SearchCollectionTab({ loading, data }: Props) {
  if (loading) return (
    <Spinner size="xl" />
  )

  return (
    <div className="py-4">
      Collections
    </div>
  )
}