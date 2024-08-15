"use client";
import Icon from "@/components/Icon";
import InputDropdown from "@/components/Form/InputDropdown";
import Button from "@/components/Button";
import { useEffect } from "react";
import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import SearchUserTab from "./UserTab";
import SearchCollectionTab from "./CollectionTab";
import SearchNFTTab from "./NFTTab";
import { isMobile } from "react-device-detect";
// import { useSearch, useSearchCollection, useSearchNft, useSearchUser } from "@/hooks/useSearch";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWRMutation from "swr/mutation";
import { useSearch } from "@/hooks/useSearch";
import { useTranslations } from "next-intl";
import { MyTabs } from "@/components/X721UIKits/Tabs";

const modalTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner:
      "relative rounded-lg bg-white shadow flex flex-col tablet:h-full h-full desktop:h-auto ",
    base: "relative w-full p-3 desktop:p-10 tablet:p-10 desktop:h-auto h-full tablet:h-full max-h-[85vh]",
  },
  body: {
    base: "p-0 flex-1 overflow-auto",
  },
};

export default function SearchInput() {
  const t = useTranslations("Header");
  const {
    activeTab,
    setActiveTab,
    handleTextInput,
    searchKey,
    text,
    tabsRef,
    openModal,
    setOpenModal,
    searchString,
  } = useSearch();

  const api = useMarketplaceApi();

  const {
    trigger: searchCollection,
    data: collectionSearchData,
    isMutating: searchingCollection,
    reset: resetCollection,
  } = useSWRMutation(text.collection || null, (text) =>
    api.searchCollections(text)
  );

  const {
    trigger: searchNFTs,
    data: nftSearchData,
    isMutating: searchingNFT,
    reset: resetNft,
  } = useSWRMutation(text.nft || null, (text) => api.searchNFTs(text));

  const {
    trigger: searchUsers,
    data: userSearchData,
    isMutating: searchingUser,
    reset: resetUser,
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

  useEffect(() => {
    // Lazy search
    resetCollection();
    resetNft();
    resetUser();
    const timeOutId = setTimeout(handleSearch, 200);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, text]);

  const getComponentByCurrTabIndex = () => {
    switch (activeTab) {
      case 0:
        return (
          <SearchCollectionTab
            loading={searchingCollection}
            data={collectionSearchData}
            onClose={() => setOpenModal(false)}
          />
        );
      case 1:
        return (
          <SearchNFTTab
            loading={searchingNFT}
            data={nftSearchData}
            onClose={() => setOpenModal(false)}
          />
        );
      case 2:
        return (
          <SearchUserTab
            loading={searchingUser}
            data={userSearchData}
            onClose={() => setOpenModal(false)}
          />
        );
    }
  };

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
                placeholder={t("SearchBar.Placeholder")}
                onChange={(event) => handleTextInput(event.target.value)}
                renderDropdown={(onclose) => (
                  <>
                    <MyTabs.Group
                      onActiveTabChange={(tab) => setActiveTab(tab)}
                      style="underline"
                    >
                      <MyTabs.Item tabIndex={0} active={activeTab === 0}>
                        <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                          Collections
                        </div>
                      </MyTabs.Item>
                      <MyTabs.Item tabIndex={1} active={activeTab === 1}>
                        <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                          NFTs
                        </div>
                      </MyTabs.Item>
                      <MyTabs.Item tabIndex={2} active={activeTab === 2}>
                        <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                          Users
                        </div>
                      </MyTabs.Item>
                    </MyTabs.Group>
                    {getComponentByCurrTabIndex()}
                  </>
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
          placeholder={t("SearchBar.Placeholder")}
          onChange={(event) => handleTextInput(event.target.value)}
          renderDropdown={(onclose) => (
            <>
              <MyTabs.Group
                onActiveTabChange={(tab) => setActiveTab(tab)}
                style="underline"
              >
                <MyTabs.Item tabIndex={0} active={activeTab === 0}>
                  <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                    Collections
                  </div>
                </MyTabs.Item>
                <MyTabs.Item tabIndex={1} active={activeTab === 1}>
                  <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                    NFTs
                  </div>
                </MyTabs.Item>
                <MyTabs.Item tabIndex={2} active={activeTab === 2}>
                  <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
                    Users
                  </div>
                </MyTabs.Item>
              </MyTabs.Group>
              {getComponentByCurrTabIndex()}
            </>
          )}
        />
      )}
    </>
  );
}
