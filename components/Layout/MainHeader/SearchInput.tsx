"use client"
import Icon from '@/components/Icon'
import InputDropdown from '@/components/Form/InputDropdown'
import Button from '@/components/Button'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Tabs, TabsRef } from 'flowbite-react'
import useSWR from 'swr'
import SearchUserTab from './UserTab'
import SearchCollectionTab from './CollectionTab'
import SearchNFTTab from './NFTTab'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { Modal } from 'flowbite-react'

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

  const [isMobile, setIsMobile] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <>
      {
        isMobile ? (
          <>
            <Button onClick={() => setOpenModal(true)} variant="icon">
              <Icon className="text-secondary" name="search" width={24} height={24} />
            </Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Search</Modal.Header>
              <Modal.Body>
                <InputDropdown
                  closeOnClick
                  className=""
                  containerClass="desktop:w-[420px] tablet:w-[280px]"
                  scale="sm"
                  value={text}
                  placeholder="Type for collections, NFTs etc"
                  onChange={event => setText(event.target.value)}
                  renderDropdown={onclose => (
                    <Tabs.Group style="underline" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
                      <Tabs.Item title="Collections">
                        <SearchCollectionTab loading={isLoading} data={data} onClose={onclose} />
                      </Tabs.Item>
                      <Tabs.Item title="NFTs">
                        <SearchNFTTab loading={isLoading} data={data} onClose={onclose} />
                      </Tabs.Item>
                      <Tabs.Item title="Users">
                        <SearchUserTab loading={isLoading} data={data} onClose={onclose} />
                      </Tabs.Item>
                    </Tabs.Group>
                  )}
                />
              </Modal.Body>
            </Modal>
          </>
        ) : (
          <InputDropdown
            closeOnClick
            className=""
            containerClass="desktop:w-[420px] tablet:w-[280px]"
            scale="sm"
            value={text}
            placeholder="Type for collections, NFTs etc"
            onChange={event => setText(event.target.value)}
            renderDropdown={onclose => (
              <Tabs.Group style="underline" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
                <Tabs.Item title="Collections">
                  <SearchCollectionTab loading={isLoading} data={data} onClose={onclose} />
                </Tabs.Item>
                <Tabs.Item title="NFTs">
                  <SearchNFTTab loading={isLoading} data={data} onClose={onclose} />
                </Tabs.Item>
                <Tabs.Item title="Users">
                  <SearchUserTab loading={isLoading} data={data} onClose={onclose} />
                </Tabs.Item>
              </Tabs.Group>
            )}
          />
        )
      }
    </>
  )
}
