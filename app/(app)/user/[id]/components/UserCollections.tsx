import CollectionsList from '@/components/List/CollectionsList'

export default function UserCollections() {
  return (
    <div className="w-full py-7 overflow-x-auto">
      <CollectionsList collections={[]} />
    </div>
  )
}