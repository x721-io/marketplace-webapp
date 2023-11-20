'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Text from '@/components/Text'
import ExploreSectionNavbar from '@/components/Layout/ExploreNavbar'

export default function ExploreLayout({ children }: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const title = useMemo(() => {
    switch (true) {
      case pathname.includes('collections'):
        return 'Collections'
      case pathname.includes('items'):
        return 'NFTs'
      case pathname.includes('users'):
        return 'Users'
    }
  }, [pathname])

  return (
    <div className="w-full py-10 px-20">
      <div className="mb-6">
        <Text className="font-semibold text-primary mb-3" variant="heading-md">
          Explore Collections
        </Text>
        <Text className="text-secondary" variant="body-14">
          Discover and collect crypto art
        </Text>
      </div>

      <ExploreSectionNavbar />

      <div>
        {children}
      </div>
    </div>
  )
}