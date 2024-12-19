import React from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";

export default function MobileFiltersModal({ show, onClose }: MyModalProps) {
  const handleCloseModal = () => {
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
        <Button className="w-full mb-5" variant="secondary" scale="sm">
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
          <Button scale="sm" className="flex-1">
            Apply
          </Button>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
