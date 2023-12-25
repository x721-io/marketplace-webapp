"use client"
import Icon from '@/components/Icon'
import InputDropdown from '@/components/Form/InputDropdown'
import Button from '@/components/Button'
import { useMemo, useRef, useState } from 'react'
import { Tabs, TabsRef } from 'flowbite-react'
import useSWR from 'swr'
import SearchUserTab from './UserTab'
import SearchCollectionTab from './CollectionTab'
import SearchNFTTab from './NFTTab'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { Modal } from 'flowbite-react'
import Input from '@/components/Form/Input'
import { isMobile } from 'react-device-detect'
import { tabbable } from 'tabbable'

export default function SearchInput() {
  const api = useMarketplaceApi()
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState({
    collection: '',
    nft: '',
    user: ''
  })
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
    }
  }, [activeTab])

  const { data: collectionSearchData, isLoading: searchingCollection } = useSWR(
    (mode === 'COLLECTION') ? text.collection : null,
    (text) => api.searchCollections(text),
    { revalidateOnFocus: false }
  )
  const { data: nftSearchData, isLoading: searchingNFT } = useSWR(
    (mode === 'NFT') ? text.nft : null,
    (text) => api.searchNFTs(text),
    { revalidateOnFocus: false }
  )
  const { data: userSearchData, isLoading: searchingUser } = useSWR(
    (mode === 'USER') ? text.user : null,
    (text) => api.searchUsers(text),
    { revalidateOnFocus: false }
  )

  const searchKey = useMemo(() => {
    switch (activeTab) {
      case 0:
        return 'collection'
      case 1:
        return 'nft'
      case 2:
        return 'user'
    }
  }, [activeTab])

  const searchString = useMemo(() => searchKey ? text[searchKey] : '', [searchKey, text])

  const handleTextInput = (value: string) => {
    if (!searchKey) return
    setText({
      ...text,
      [searchKey]: value
    })
  }

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
                <Input placeholder="Type for collections, NFTs etc" />
              </Modal.Body>
            </Modal>
          </>
        ) : (
          <InputDropdown
            closeOnClick
            className=""
            containerClass="desktop:w-[420px] tablet:w-[280px]"
            scale="sm"
            value={searchString}
            placeholder="Type for collections, NFTs etc"
            onChange={event => handleTextInput(event.target.value)}
            renderDropdown={onclose => (
              <Tabs.Group style="underline" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
                <Tabs.Item title="Collections">
                  <SearchCollectionTab loading={searchingCollection} data={collectionSearchData} onClose={onclose} />
                </Tabs.Item>
                <Tabs.Item title="NFTs">
                  <SearchNFTTab loading={searchingNFT} data={nftSearchData} onClose={onclose} />
                </Tabs.Item>
                <Tabs.Item title="Users">
                  <SearchUserTab loading={searchingUser} data={userSearchData} onClose={onclose} />
                </Tabs.Item>
              </Tabs.Group>
            )}
          />
        )
      }
    </>
  )
}
