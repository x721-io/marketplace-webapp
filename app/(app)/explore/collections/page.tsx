import CollectionCard from '@/components/Collection/CollectionCard'

export default function ExploreCollectionsPage() {
  const collections = [
    {
      id: '1',
      name: 'Extraordinary Ape',
      owners: 20,
      items: 100,
      floorPrice: 20,
      royalties: 2,
      volume: 1000
    },
    {
      id: '2',
      name: 'Extraordinary Ape',
      owners: 20,
      items: 100,
      floorPrice: 20,
      royalties: 2,
      volume: 1000
    },
    {
      id: '3',
      name: 'Extraordinary Ape',
      owners: 20,
      items: 100,
      floorPrice: 20,
      royalties: 2,
      volume: 1000
    },
  ]
  return (
    <div className="flex flex-col gap-6">
      {collections.map(collection => (
        <CollectionCard {...collection} key={collection.id} />
      ))}
    </div>
  )
}