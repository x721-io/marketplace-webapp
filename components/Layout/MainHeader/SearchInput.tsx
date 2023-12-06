import Icon from '@/components/Icon'
import InputDropdown from '@/components/Form/InputDropdown'
import Button from '@/components/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Tabs, TabsRef } from 'flowbite-react'
import useSWR from 'swr'
import SearchUserTab from './UserTab'
import SearchCollectionTab from './CollectionTab'
import SearchNFTTab from './NFTTab'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export default function SearchInput() {
  const api = useMarketplaceApi()
  const [text, setText] = useState('')
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0)

  const mode = useMemo(() => {
    switch (activeTab) {
      case 0:
        return 'COLLECTION'
      case 1:
        return 'NFT'
      case 2:
        return 'USER'
      default:
        return 'NFT'
    }
  }, [activeTab])

  const { data, isLoading } = useSWR(
    !!text ? [text, mode] : null,
    ([text, mode]) => api.search({ text, mode }),
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <>
      <InputDropdown
        className="hidden desktop:block"
        containerClass="desktop:w-[420px] tablet:w-[280px]"
        scale="sm"
        value={text}
        placeholder="Type for collections, NFTs etc"
        onChange={event => setText(event.target.value)}
      >
        <div>
          <Tabs.Group style="underline" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
            <Tabs.Item active title="Collections">
              <SearchCollectionTab loading={isLoading} />
            </Tabs.Item>
            <Tabs.Item active title="NFTs">
              <SearchNFTTab loading={isLoading} />
            </Tabs.Item>
            <Tabs.Item active title="Users">
              <SearchUserTab loading={isLoading} />
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </InputDropdown>

      <Button className="hidden tablet:block desktop:hidden" variant="icon">
        <Icon className="text-secondary" name="search" width={24} height={24} />
      </Button>
    </>
  )
}