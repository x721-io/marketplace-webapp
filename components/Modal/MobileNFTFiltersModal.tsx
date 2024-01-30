import { CustomFlowbiteTheme, Modal, ModalProps } from "flowbite-react";
import NFTFilters, { FilterProps } from "@/components/Filters/NFTFilters";
import React from "react";

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

export default function MobileNFTFiltersModal({
  baseFilters,
  onApplyFilters,
  traitsFilter,
  show,
  onClose,
}: ModalProps & FilterProps) {
  return (
    <Modal
      theme={modalTheme}
      position="center"
      onClose={onClose}
      show={show}
      size="md"
      className="bg-black flex items-center justify-center"
    >
      <Modal.Header>Filters</Modal.Header>
      <Modal.Body>
        <NFTFilters
          baseFilters={baseFilters}
          onApplyFilters={onApplyFilters}
          containerClass="w-full"
          traitsFilter={traitsFilter}
          onCloseModal={onClose}
        />
      </Modal.Body>
    </Modal>
  );
}
