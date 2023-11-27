import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/store/ui/store'

export const useFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { showFilters, toggleFilter } = useUIStore(state => state)

  const routeKey = useMemo(() => {
    switch (true) {
      case pathname.includes('collections'):
        return 'collections'
      case pathname.includes('items'):
        return 'nfts'
      case pathname.includes('profile'):
        return 'profile'
    }
  }, [pathname])

  const isFiltersVisible = useMemo(() => {
    if (!routeKey) return false
    return showFilters[routeKey]
  }, [showFilters, routeKey])

  return { isFiltersVisible }
}