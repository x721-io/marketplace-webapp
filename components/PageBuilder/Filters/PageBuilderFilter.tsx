import React, { useState } from "react";
import Input from "@/components/Form/Input";
import Collapsible from "@/components/Collapsible";
import useSWR from "swr";
import { useLayergApi } from "@/hooks/useLayerGApi";
import Checkbox from "@/components/X721UIKits/Checkbox/Checkbox";
import ImgCheckbox from "@/components/X721UIKits/Checkbox/ImgCheckbox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { classNames } from "@/utils/string";
import { useLayerGNFTFilterStore } from "@/store/filters/layerg/byLayerG/store";
import { useLayergBaseFilterStore } from "@/store/filters/layerg/byBaseFilter/store";
import { MyModal } from "@/components/X721UIKits/Modal";
import { isMobile } from "react-device-detect";

export interface CollectionProps {
  containerClass?: string;
}

export default function PageBuilderFilter({ containerClass }: CollectionProps) {
  const { showFilters, updateFilters, resetFilters, toggleFilter } =
    useLayerGNFTFilterStore();
  const {
    categoryFilters,
    projectFilters,
    collectionFilters,
    setStatusFilters,
    setCategoryFilters,
    updateCollectionFilters,
    updateProjectFilters,
    updateStatusFilters,
    resetFilters: resetBaseFilters,
  } = useLayergBaseFilterStore();

  const api = useLayergApi();

  const { data: categoryData } = useSWR(
    ["category", categoryFilters],
    () => api.getCategoryData(categoryFilters),
    { refreshInterval: 50000 }
  );

  const { data: projectData } = useSWR(
    ["project", projectFilters],
    () => api.getProjectData(projectFilters),
    { refreshInterval: 50000 }
  );

  const { data: smcData } = useSWR(
    ["smcData", collectionFilters],
    () => api.getSmartContractData(collectionFilters),
    { refreshInterval: 50000 }
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCollection, setSelectedCollection] = useState({
    name: "",
    address: "",
  });
  const [selectedStatus, setSelectedStatus] = useState({
    orderStatus: "",
    orderType: "",
  });

  const handleSelectCategory = (name: string) => {
    setSelectedCategory((prev) => (prev === name ? "" : name));
    setCategoryFilters({ name: name });
  };

  const handleSelectGame = (name: string, projectId: string) => {
    setSelectedGame((prev) => (prev === name ? "" : name));
    updateProjectFilters({ name: name });

    if (name) {
      updateCollectionFilters({ projectId });
    }
  };

  const handleSelectCollection = (name: string, address: string) => {
    setSelectedCollection((prev) =>
      prev.name === name && prev.address === address
        ? { name: "", address: "" }
        : { name, address }
    );
    setCategoryFilters({
      name: name,
    });
  };

  const handleSelectStatus = (orderStatus: string, orderType: string) => {
    setSelectedStatus((prev) =>
      prev.orderStatus === orderStatus && prev.orderType === orderType
        ? {
            orderStatus: "",
            orderType: "",
          }
        : { orderStatus, orderType }
    );
    updateFilters({ status: { orderStatus, orderType } });
  };

  const handleInputCollection = (value: string) => {
    if (value.startsWith("0x")) {
      updateCollectionFilters({ contractAddress: value });
    } else {
      updateCollectionFilters({ contractName: value });
    }
  };

  const handleApplyFilters = () => {
    updateFilters({
      collectionAddress: selectedCollection.address || "",
      collectionName: selectedGame || "",
      categoryName: selectedCategory || "",
    });
    toggleFilter(false);
  };

  const handleClearSelected = () => {
    setSelectedCategory("");
    setSelectedStatus({ orderStatus: "", orderType: "" });
    setSelectedGame("null");
    setSelectedCollection({ name: "", address: "" });
    resetFilters();
    resetBaseFilters();
    toggleFilter(false);
  };

  if (!showFilters) return null;

  const statusOptions = [
    { id: 1, name: "On Sale", orderStatus: "OPEN", orderType: "SINGLE" },
  ];

  return (
    <>
      {isMobile ? (
        <MyModal.Root
          onClose={() => toggleFilter(false)}
          show={showFilters}
          className="flex items-center justify-center "
        >
          <MyModal.Header>NFT Filters</MyModal.Header>
          <MyModal.Body>
            <div className="overflow-y-auto h-[300px]">
              <Collapsible header="Status">
                <div className="flex flex-col gap-3 max-h-full">
                  {statusOptions.map((item) => (
                    <Checkbox
                      key={item.id}
                      checked={
                        selectedStatus.orderStatus === item.orderStatus &&
                        selectedStatus.orderType === item.orderType
                      }
                      onChange={() =>
                        handleSelectStatus(item.orderStatus, item.orderType)
                      }
                      label={item.name}
                      className="extra-styles"
                    />
                  ))}
                </div>
              </Collapsible>
              <Collapsible header="Category">
                <div className="flex flex-col gap-3 max-h-full">
                  {categoryData?.map((item) => (
                    <Checkbox
                      key={item.id}
                      checked={selectedCategory === item.name}
                      onChange={() => handleSelectCategory(item.name)}
                      label={item.name}
                      className="extra-styles"
                    />
                  ))}
                </div>
              </Collapsible>

              <Collapsible header="Games">
                <Input
                  type="text"
                  className="p-3"
                  scale="sm"
                  placeholder="Search Game"
                  onChange={(e) =>
                    updateProjectFilters({ name: e.target.value })
                  }
                />
                <div className="flex flex-col max-h-full mt-3">
                  {projectData?.data?.map((project) => (
                    <ImgCheckbox
                      key={project.id}
                      imgSrc={project.gameIcon}
                      checked={selectedGame === project.name}
                      onChange={() =>
                        handleSelectGame(project.name, project.id)
                      }
                      label={project.name}
                      className="extra-styles"
                    />
                  ))}
                </div>
              </Collapsible>

              <Collapsible header="Collections">
                <Input
                  type="text"
                  className="p-3 mb-3"
                  scale="sm"
                  placeholder="Search Category"
                  onChange={(e) => handleInputCollection(e.target.value)}
                />
                {smcData?.data?.map((smc) => (
                  <ImgCheckbox
                    key={smc.id}
                    imgSrc={smc.collection?.avatarUrl}
                    checked={
                      selectedCollection.name === smc.contractName &&
                      selectedCollection.address === smc.contractAddress
                    }
                    onChange={() =>
                      handleSelectCollection(
                        smc.contractName,
                        smc.contractAddress
                      )
                    }
                    label={smc.contractName}
                    className="extra-styles"
                  />
                ))}
              </Collapsible>
            </div>

            <Button
              className="w-full mb-5"
              variant="secondary"
              scale="sm"
              onClick={handleClearSelected}
            >
              Reset <Icon name="refresh" width={12} height={12} />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                scale="sm"
                className="flex-1"
                variant="outlined"
                onClick={() => toggleFilter(false)}
              >
                Cancel
              </Button>
              <Button
                scale="sm"
                className="flex-1"
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
            </div>
          </MyModal.Body>
        </MyModal.Root>
      ) : (
        <div
          className={classNames(
            "w-full tablet:w-72 flex flex-col rounded-2xl border",
            containerClass
          )}
        >
          <Collapsible header="Status">
            <div className="flex flex-col gap-3 max-h-full">
              {statusOptions.map((item) => (
                <Checkbox
                  key={item.id}
                  checked={
                    selectedStatus.orderStatus === item.orderStatus &&
                    selectedStatus.orderType === item.orderType
                  }
                  onChange={() =>
                    handleSelectStatus(item.orderStatus, item.orderType)
                  }
                  label={item.name}
                  className="extra-styles"
                />
              ))}
            </div>
          </Collapsible>
          <Collapsible header="Category">
            <div className="flex flex-col gap-3 max-h-full">
              {categoryData?.map((item) => (
                <Checkbox
                  key={item.id}
                  checked={selectedCategory === item.name}
                  onChange={() => handleSelectCategory(item.name)}
                  label={item.name}
                  className="extra-styles"
                />
              ))}
            </div>
          </Collapsible>
          <Collapsible header="Games">
            <Input
              type="text"
              className="p-3"
              scale="sm"
              placeholder="Search Game"
              onChange={(e) => updateProjectFilters({ name: e.target.value })}
            />
            <div className="flex flex-col max-h-full mt-3">
              {projectData?.data?.map((project) => (
                <ImgCheckbox
                  key={project.id}
                  imgSrc={project.gameIcon}
                  checked={selectedGame === project.name}
                  onChange={() => handleSelectGame(project.name, project.id)}
                  label={project.name}
                  className="extra-styles"
                />
              ))}
            </div>
          </Collapsible>
          <Collapsible header="Collections">
            <Input
              type="text"
              className="p-3 mb-3"
              scale="sm"
              placeholder="Search Category"
              onChange={(e) => handleInputCollection(e.target.value)}
            />
            {smcData?.data?.map((smc) => (
              <ImgCheckbox
                key={smc.id}
                imgSrc={smc.collection?.avatarUrl}
                checked={
                  selectedCollection.name === smc.contractName &&
                  selectedCollection.address === smc.contractAddress
                }
                onChange={() =>
                  handleSelectCollection(smc.contractName, smc.contractAddress)
                }
                label={smc.contractName}
                className="extra-styles"
              />
            ))}
          </Collapsible>
          <div className="p-4">
            <Button
              scale="sm"
              className="w-full"
              variant="primary"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </div>
          <div className="p-4">
            <Button
              className="w-full"
              variant="outlined"
              scale="sm"
              onClick={handleClearSelected}
            >
              Reset <Icon name="refresh" width={12} height={12} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
