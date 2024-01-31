import { CustomFlowbiteTheme, Modal, ModalProps } from "flowbite-react";
import React from "react";
import CollectionFilters, {
  CollectionProps,
} from "@/components/Filters/CollectionFilters";
import { useExploreSectionFilters } from "@/hooks/useFilters";
import { APIParams } from "@/services/api/types";

const modalTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner:
      "relative rounded-lg bg-white shadow flex flex-col h-auto max-h-[600px] desktop:max-h-[800px] tablet:max-h-[800px]",
    base: "relative w-full desktop:p-10 tablet:p-6 p-4 ",
  },
  body: {
    base: "p-0 flex-1 overflow-auto",
  },
};

interface Props {
  closeFilter?: () => void;
  showFilter: boolean;
  onApplyFilters?: (filters: APIParams.FetchCollections) => void;
}

export default function MobileCollectionFiltersModal({
  closeFilter,
  showFilter,
  onApplyFilters,
}: Props) {
  const { isFiltersVisible } = useExploreSectionFilters();
  return (
    <Modal
      theme={modalTheme}
      position="center"
      onClose={closeFilter}
      show={showFilter}
      size="md"
      className="bg-black flex items-center justify-center"
    >
      <Modal.Header>Filters</Modal.Header>
      <Modal.Body>
        <CollectionFilters
          visible={isFiltersVisible}
          onApplyFilters={onApplyFilters}
          onCloseModal={closeFilter}
          containerClass="w-full"
        />
      </Modal.Body>
    </Modal>
  );
}
