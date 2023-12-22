'use client'

import { Dropdown, Tabs, TabsRef } from 'flowbite-react'
import Button from '@/components/Button'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import Input from '@/components/Form/Input'
import SliderIcon from '@/components/Icon/Sliders'
import CommandIcon from '@/components/Icon/Command'
import Icon from '@/components/Icon'
import { useExploreSectionFilters } from '@/hooks/useFilters'
import { useUIStore } from '@/store/ui/store'

export default function ExploreSectionNavbar() {
  const { handleToggleFilters, isFiltersVisible, routeKey, searchKey } = useExploreSectionFilters()
  const { setQueryString, queryString } = useUIStore(state => state)

  const pathname = usePathname()
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

  return (
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap">
      {
        routeKey !== 'profile' && (
          <div className="order-3 desktop:order-1">
            <Button
              onClick={handleToggleFilters}
              className={isFiltersVisible ? 'bg-white shadow desktop:h-[55px] tablet:h-[55px] h-[56px]' : `bg-surface-soft desktop:h-[55px] tablet:h-[55px] h-[56px]`}
              scale="lg"
              variant="secondary">
              Filters
              <span className="p-1 bg-surface-medium rounded-lg">
                <SliderIcon width={14} height={14} />
              </span>
            </Button>
          </div>
        )
      }

      <div className="order-1 w-full desktop:order-2 desktop:flex-none desktop:w-auto">
        <Tabs.Group onActiveTabChange={handleChangeTab} style="default" ref={tabsRef}>
          {tabs.map(tab => (
            <Tabs.Item
              active={pathname.includes(tab.href)}
              key={tab.href}
              title={tab.label}
            />
          ))}
        </Tabs.Group>
      </div>
      <div className="relative flex-1 order-2 desktop:order-3 min-w-[180px]">
        <Input
          onChange={e => setQueryString(searchKey, e.target.value)}
          value={queryString[searchKey]}
          className="py-4 h-14"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5" />
      </div>

      {/* {
        routeKey !== 'profile' && (
          <div className="order-4">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="bg-surface-soft flex items-center justify-center gap-3 rounded-2xl p-3 h-full cursor-pointer">
                  Price: Ascending
                  <div className="rounded-lg p-1 bg-surface-medium">
                    <Icon name="chevronDown" width={14} height={14} />
                  </div>
                </div>
              )}>
              <Dropdown.Item>Price: Ascending</Dropdown.Item>
              <Dropdown.Item>Price: Descending</Dropdown.Item>
              <Dropdown.Item>Date: Ascending</Dropdown.Item>
              <Dropdown.Item>Date: Descending</Dropdown.Item>
            </Dropdown>
          </div>
        )
      } */}
    </div>
  )
}