import { CustomFlowbiteTheme, Modal, ModalProps } from 'flowbite-react'
import React from 'react'
import CollectionFilters, { CollectionProps } from "@/components/Filters/CollectionFilters";
import { useExploreSectionFilters } from '@/hooks/useFilters';
import { APIParams } from '@/services/api/types';

const modalTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col tablet:h-auto h-auto desktop:h-auto ",
    base: "relative w-full p-10 desktop:h-auto tablet:h-auto max-h-[90vh]",
  }
}

interface Props {
  closeFilter?: () => void
  showFilter: boolean
  onApplyFilters?: (filters: APIParams.FetchCollections) => void
}

export default function MobileCollectionFiltersModal({
  closeFilter,
  showFilter,
  onApplyFilters,
}: Props) {
  const { isFiltersVisible } = useExploreSectionFilters()
  return (
    <Modal
      theme={modalTheme}
      position="center"
      onClose={closeFilter}
      show={showFilter}
      size="md"
      className="bg-black flex items-center justify-center">
      <Modal.Header>Filters</Modal.Header>
      <Modal.Body>
        <CollectionFilters 
          visible={isFiltersVisible} 
          onApplyFilters={onApplyFilters} 
          onCloseModal={closeFilter} 
          containerClass="w-full"/>
      </Modal.Body>
    </Modal>
  )
}