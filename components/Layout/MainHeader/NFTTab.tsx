import { Spinner } from 'flowbite-react'

interface Props {
  loading?: boolean
  data?: any[]
}

export default function SearchNFTTab({ loading, data }: Props) {
  if (loading) return (
    <Spinner size="xl"/>
  )

  return (
    <div>
      NFT
    </div>
  )
}