import ExploreUserList from './components/UserList'

export default function ExploreUsersPage() {

  return (
    <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
      <ExploreUserList />
    </div>
  )
}