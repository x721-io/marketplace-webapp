'use client'

import { Dropdown, Tabs, TabsRef } from 'flowbite-react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import Input from '@/components/Form/Input'
import { useUIStore } from '@/store/ui/store'

export default function ExploreSectionNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { showFilters, toggleFilter } = useUIStore(state => state)
  const tabsRef = useRef<TabsRef>(null);
  const tabs = [
    { label: 'NFTs', href: '/explore/items' },
    { label: 'Collections', href: '/explore/collections' },
    { label: 'Users', href: '/explore/users' }
  ]

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

  const handleChangeTab = (activeTab: number) => {
    return router.push(tabs[activeTab].href)
  }

  const handleToggleFilters = () => {
    if (!routeKey) return
    toggleFilter(routeKey)
  }

  return (
    <div className="flex gap-4 items-center">
      <Button
        scale="lg"
        className={isFiltersVisible ? 'bg-white shadow' : `bg-surface-soft`}
        variant="secondary"
        onClick={handleToggleFilters}>
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

      <Input
        placeholder="Type for NFTs"
        scale="lg"
        containerClass="flex-1"
        appendIcon={
          <div className="rounded-lg p-1 bg-surface-medium text-secondary w-6 h-6 flex justify-center items-center">/</div>
        }
      />

      <div>
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <Button scale="lg" className="w-60 bg-surface-soft" variant="secondary">
              Price: Ascending
              <div className="rounded-lg p-1 bg-surface-medium">
                <Icon name="chevronDown" width={14} height={14} />
              </div>
            </Button>
          )}>
          <Dropdown.Item>Price: Ascending</Dropdown.Item>
          <Dropdown.Item>Price: Descending</Dropdown.Item>
          <Dropdown.Item>Date: Ascending</Dropdown.Item>
          <Dropdown.Item>Date: Descending</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  )
}