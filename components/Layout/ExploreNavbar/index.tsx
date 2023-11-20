'use client'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { Tabs, TabsRef } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function ExploreSectionNavbar() {
  const router = useRouter()
  const tabsRef = useRef<TabsRef>(null);
  const tabs = [
    { label: 'NFTs', href: '/explore/items' },
    { label: 'Collections', href: '/explore/collections' },
    { label: 'Users', href: '/explore/users' }
  ]

  const handleChangeTab = (activeTab: number) => {
    return router.push(tabs[activeTab].href)
  }

  const handleToggleFilters = () => {

  }

  return (
    <div className="flex gap-4 items-center">
      <Button scale="lg" className="bg-surface-soft" variant="secondary">
        Filters
        <div className="rounded-lg p-1 bg-surface-medium">
          <Icon name="slider" width={14} height={14} />
        </div>
      </Button>

      <Tabs.Group onActiveTabChange={handleChangeTab} style="default" ref={tabsRef}>
        {
          tabs.map(tab => (
            <Tabs.Item
              key={tab.href}
              title={tab.label}
            />
          ))
        }
      </Tabs.Group>
    </div>
  )
}