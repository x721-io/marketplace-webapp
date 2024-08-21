import { Label } from "flowbite-react";
import { FilterProps } from "@/components/Filters/NFTFilters";
import React from "react";
import Collapsible from "@/components/Collapsible";
import Input from "@/components/Form/Input";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { useNFTFilters } from "@/hooks/useFilters";
import Icon from "@/components/Icon";
import { DEFAULT_NFT_FILTERS_STATE } from "@/store/filters/items/store";
import Select from "../Form/Select";
import { tokenOptions } from "@/config/tokens";
import { Address } from "wagmi";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import MyRadio from "../X721UIKits/Radio";
import MyCheckbox from "../X721UIKits/Checkbox";

export default function MobileNFTFiltersModal({
  baseFilters = ["price", "type", "status"],
  activeFilters,
  onApplyFilters,
  onResetFilters,
  traitsFilter,
  show,
  onClose,
}: MyModalProps & FilterProps) {
  const {
    handleApplyFilters,
    localFilters,
    handleChange,
    isTraitSelected,
    handleSelectTrait,
  } = useNFTFilters(activeFilters, onApplyFilters);

  const handleCloseModal = () => {
    handleChange(activeFilters); // reset to previous state
    onClose?.();
  };

  return (
    <MyModal.Root
      onClose={handleCloseModal}
      show={show}
      className="flex items-center justify-center"
    >
      <MyModal.Header>NFT Filters</MyModal.Header>
      <MyModal.Body>
        {baseFilters.includes("type") && (
          <div className="mb-5">
            <Text className="text-secondary font-semibold mb-2">Type</Text>
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <MyRadio
                  id="type-all"
                  value=""
                  checked={localFilters.type === undefined}
                  onChange={() => handleChange({ type: undefined })}
                />
                <Label htmlFor="type-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <MyRadio
                  id="type-single"
                  value="ERC721"
                  checked={localFilters.type === "ERC721"}
                  onChange={() => handleChange({ type: "ERC721" })}
                />
                <Label htmlFor="type-single">Single</Label>
              </div>
              <div className="flex gap-3 items-center">
                <MyRadio
                  id="type-multiple"
                  value="ERC1155"
                  checked={localFilters.type === "ERC1155"}
                  onChange={() => handleChange({ type: "ERC1155" })}
                />
                <Label htmlFor="type-multiple">Multiple</Label>
              </div>
            </div>
          </div>
        )}
        {baseFilters.includes("status") && (
          <div className="mb-5">
            <Text className="text-secondary font-semibold mb-2">Status</Text>
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <MyRadio
                  id="status-all"
                  value=""
                  checked={localFilters.sellStatus === undefined}
                  onChange={() => handleChange({ sellStatus: undefined })}
                />
                <Label htmlFor="status-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <MyRadio
                  id="status-buy"
                  value="AskNew"
                  checked={localFilters.sellStatus === "AskNew"}
                  onChange={() => handleChange({ sellStatus: "AskNew" })}
                />
                <Label htmlFor="type-buy">Buy now</Label>
              </div>
            </div>
          </div>
        )}
        {baseFilters.includes("status") && (
          <div className="mb-5">
            <Text className="text-secondary font-semibold mb-2">Price</Text>

            <div className="flex items-center gap-4 mb-4">
              <Input
                containerClass="w-24"
                scale="sm"
                placeholder="Min"
                value={localFilters.priceMin}
                onChange={(e) => handleChange({ priceMin: e.target.value })}
              />
              <Text className="text-primary">to</Text>
              <Input
                containerClass="w-24"
                scale="sm"
                placeholder="Max"
                value={localFilters.priceMax}
                onChange={(e) => handleChange({ priceMax: e.target.value })}
              />
              <Select
                options={tokenOptions}
                containerClass="tablet:w-2/3 w-full"
                scale="sm"
                value={localFilters.quoteToken}
                onChange={(e) =>
                  handleChange({ quoteToken: e.target.value as Address })
                }
              />
            </div>
          </div>
        )}
        {!!traitsFilter?.length && (
          <div className="mb-5">
            <Text className="text-secondary font-semibold mb-2">Status</Text>

            {traitsFilter.map((item) => (
              <Collapsible
                key={item.key}
                header={
                  <Text variant="body-16">
                    {item.key}&nbsp;({item.count})
                  </Text>
                }
              >
                {item.traits.map((trait) => (
                  <div
                    key={trait.value}
                    className="flex items-center gap-2 py-2"
                  >
                    <MyCheckbox
                      id={`trait-${trait.value}`}
                      checked={isTraitSelected(item.key, trait.value) ?? false}
                      onChange={() => handleSelectTrait(item.key, trait.value)}
                    />
                    <Label
                      htmlFor={`trait-${trait.value}`}
                      className="flex-1 text-body-16 text-secondary font-semibold"
                    >
                      {trait.value}
                    </Label>
                    <Text>{trait.count}</Text>
                  </div>
                ))}
              </Collapsible>
            ))}
          </div>
        )}

        <Button
          className="w-full mb-5"
          variant="secondary"
          scale="sm"
          onClick={() => {
            onResetFilters?.();
            handleChange({ ...DEFAULT_NFT_FILTERS_STATE.filters });
          }}
        >
          Reset <Icon name="refresh" width={12} height={12} />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            scale="sm"
            className="flex-1"
            variant="outlined"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            scale="sm"
            className="flex-1"
            onClick={() => {
              handleApplyFilters();
              onClose?.();
            }}
          >
            Apply
          </Button>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
