import Input from "@/components/Form/Input";
import { APIParams } from "@/services/api/types";
import React, { useState } from "react";
import { classNames } from "@/utils/string";
import Collapsible from "@/components/Collapsible";
import useSWR from "swr";
import { useLayergApi } from "@/hooks/useLayerGApi";
import MyCheckbox from "@/components/X721UIKits/Checkbox";
import Checkbox from "@/components/X721UIKits/Checkbox/Checkbox";
import Image from "next/image";
import ImgCheckbox from "@/components/X721UIKits/Checkbox/ImgCheckbox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useLayerGNFTFilterStore } from "@/store/filters/byLayerG/store";

export interface CollectionProps {
  containerClass?: string;
}

export default function PageBuilderFilter({ containerClass }: CollectionProps) {
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useLayerGNFTFilterStore();

  const api = useLayergApi();
  const { data: categoryData } = useSWR("categories", api.getCategoryData, {
    refreshInterval: 50000,
  });

  const params = {
    page: 1,
    limit: 10,
    total: 100,
  };

  const { data: projectData } = useSWR(
    ["project", params],
    () => api.getProjectData(params),
    { refreshInterval: 50000 }
  );

  const paramsSMC = {
    networkID: 2484,
    page: 1,
    limit: 10,
    total: 100,
  };

  const { data: smcData } = useSWR(
    ["smcData", params],
    () => api.getSmartContractData(paramsSMC),
    { refreshInterval: 50000 }
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const isChecked = (name: string) => {
    return selectedCategory === name;
  };
  const isCheckedGame = (name: string) => {
    return selectedGame === name;
  };
  const isCheckedCollection = (name: string) => {
    return selectedCollection === name;
  };
  const handleSelectCategory = (name: string) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  };

  const handleSelectGame = (name: string) => {
    setSelectedGame((prev) => (prev === name ? null : name));
  };

  const handleSelectCollection = (name: string) => {
    setSelectedCollection((prev) => (prev === name ? null : name));
  };

  if (!showFilters) return null;

  return (
    <>
      <div
        className={classNames(
          "w-full tablet:w-72 flex flex-col rounded-2xl border",
          containerClass
        )}
      >
        <Collapsible header="Category">
          <div className="flex flex-col gap-3 max-h-full ">
            {categoryData &&
              categoryData.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between `}
                >
                  <Checkbox
                    checked={isChecked(item.name)}
                    onChange={() => handleSelectCategory(item.name)}
                    label={item.name}
                    className="extra-styles"
                  />
                </div>
              ))}
          </div>
        </Collapsible>
        <Collapsible header="Games">
          <Input
            type="text"
            containerClass="w-full "
            scale="sm"
            placeholder="game"
            className="mb-2"
          />
          <div className="flex flex-col max-h-full ">
            {projectData &&
              projectData.data.map((project, idx) => (
                <div
                  className="w-full h-full flex justify-between items-center"
                  key={project.id}
                >
                  <ImgCheckbox
                    imgSrc={project?.gameIcon}
                    checked={isCheckedGame(project.name)}
                    onChange={() => handleSelectGame(project.name)}
                    label={project.name}
                    className="extra-styles"
                  />
                </div>
              ))}
          </div>
        </Collapsible>
        <Collapsible header="Collections">
          <Input
            className="mb-2"
            type="text"
            containerClass="w-full "
            scale="sm"
            placeholder="text"
          />

          {smcData &&
            smcData.data.map((smc, idx) => (
              <div className="w-full h-full flex justify-between" key={smc.id}>
                <ImgCheckbox
                  contractAddress={smc.contractAddress}
                  imgSrc={smc?.collection?.avatarUrl}
                  checked={isCheckedCollection(smc.contractName)}
                  onChange={() => handleSelectCollection(smc.contractName)}
                  label={smc.contractName}
                  className="extra-styles"
                />
              </div>
            ))}
        </Collapsible>

        {/*<div className="p-4 bg-primary">*/}
        {/*  <Button*/}
        {/*      className="w-full"*/}
        {/*      variant="outlined"*/}
        {/*      scale="sm"*/}
        {/*      onClick={() => {*/}
        {/*        updateFilters();*/}
        {/*      }}*/}
        {/*  >*/}
        {/*    Apply*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <div className="p-4">
          <Button
            className="w-full"
            variant="outlined"
            scale="sm"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset <Icon name="refresh" width={12} height={12} />
          </Button>
        </div>
      </div>
    </>
  );
}
