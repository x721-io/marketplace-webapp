"use client";
import Icon from "@/components/Icon";
import InputDropdown from "@/components/Form/InputDropdown";
import Button from "@/components/Button";
import { useEffect, useMemo, useRef, useState } from "react";
import { CustomFlowbiteTheme, Tabs, TabsRef } from "flowbite-react";
import SearchUserTab from "./UserTab";
import SearchCollectionTab from "./CollectionTab";
import SearchNFTTab from "./NFTTab";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { Modal } from "flowbite-react";
import Input from "@/components/Form/Input";
import { isMobile } from "react-device-detect";
import useSWRMutation from "swr/mutation";

const modalTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner:
      "relative rounded-lg bg-white shadow flex flex-col tablet:h-full h-full desktop:h-auto ",
    base: "relative w-full p-4 desktop:p-10 tablet:p-10 desktop:h-auto h-full tablet:h-full max-h-[90vh]",
  },
  body: {
    base: "p-0 flex-1 overflow-auto",
  },
};

export default function SearchInput() {
  const api = useMarketplaceApi();
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState({
    collection: "",
    nft: "",
    user: "",
  });
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const searchKey = useMemo(() => {
    switch (activeTab) {
      case 0:
        return "collection";
      case 1:
        return "nft";
      case 2:
        return "user";
    }
  }, [activeTab]);

  const searchString = useMemo(
    () => (searchKey ? text[searchKey] : ""),
    [searchKey, text],
  );

  const {
    trigger: searchCollection,
    data: collectionSearchData,
    isMutating: searchingCollection,
  } = useSWRMutation(text.collection || null, (text) =>
    api.searchCollections(text),
  );

  const {
    trigger: searchNFTs,
    data: nftSearchData,
    isMutating: searchingNFT,
  } = useSWRMutation(text.nft || null, (text) => api.searchNFTs(text));

  const {
    trigger: searchUsers,
    data: userSearchData,
    isMutating: searchingUser,
  } = useSWRMutation(text.user || null, (text) => api.searchUsers(text));

  const handleSearch = () => {
    if (!searchKey || !text[searchKey]) return;
    switch (searchKey) {
      case "collection":
        return searchCollection();
      case "nft":
        return searchNFTs();
      case "user":
        return searchUsers();
    }
  };

  const handleTextInput = async (value: string) => {
    if (!searchKey) return;
    setText({
      ...text,
      [searchKey]: value,
    });
  };

  useEffect(() => {
    // Lazy search
    const timeOutId = setTimeout(handleSearch, 200);
    return () => clearTimeout(timeOutId);
  }, [searchString]);

  return (
    <>
      {isMobile ? (
        <>
          <Button onClick={() => setOpenModal(true)} variant="icon">
            <Icon
              className="text-secondary"
              name="search"
              width={24}
              height={24}
            />
          </Button>
          <Modal
            theme={modalTheme}
            show={openModal}
            onClose={() => setOpenModal(false)}
          >
            <Modal.Header>Search</Modal.Header>
            <Modal.Body>
              <InputDropdown
                closeOnClick
                className=""
                containerClass="desktop:w-[420px] tablet:w-[280px]"
                scale="sm"
                value={searchString}
                placeholder="Type for collections, NFTs etc"
                onChange={(event) => handleTextInput(event.target.value)}
                renderDropdown={(onclose) => (
                  <Tabs.Group
                    style="underline"
                    ref={tabsRef}
                    onActiveTabChange={(tab) => setActiveTab(tab)}
                  >
                    <Tabs.Item title="Collections">
                      <SearchCollectionTab
                        loading={searchingCollection}
                        data={collectionSearchData}
                        onClose={() => setOpenModal(false)}
                      />
                    </Tabs.Item>
                    <Tabs.Item title="NFTs">
                      <SearchNFTTab
                        loading={searchingNFT}
                        data={nftSearchData}
                        onClose={() => setOpenModal(false)}
                      />
                    </Tabs.Item>
                    <Tabs.Item title="Users">
                      <SearchUserTab
                        loading={searchingUser}
                        data={userSearchData}
                        onClose={() => setOpenModal(false)}
                      />
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
          value={searchString}
          placeholder="Type for collections, NFTs etc"
          onChange={(event) => handleTextInput(event.target.value)}
          renderDropdown={(onclose) => (
            <Tabs.Group
              style="underline"
              ref={tabsRef}
              onActiveTabChange={(tab) => setActiveTab(tab)}
            >
              <Tabs.Item title="Collections">
                <SearchCollectionTab
                  loading={searchingCollection}
                  data={collectionSearchData}
                  onClose={onclose}
                />
              </Tabs.Item>
              <Tabs.Item title="NFTs">
                <SearchNFTTab
                  loading={searchingNFT}
                  data={nftSearchData}
                  onClose={onclose}
                />
              </Tabs.Item>
              <Tabs.Item title="Users">
                <SearchUserTab
                  loading={searchingUser}
                  data={userSearchData}
                  onClose={onclose}
                />
              </Tabs.Item>
            </Tabs.Group>
          )}
        />
      )}
    </>
  );
}
