import ExploreCollectionList from './components/Collection'
import ExploreCollectionFilters from './components/Filters'

export default function ExploreCollectionsPage() {

  return (
    <div className="flex gap-6">
      <ExploreCollectionFilters />

      <div className="flex-1">
        <ExploreCollectionList />
      </div>
    </div>
  )
}