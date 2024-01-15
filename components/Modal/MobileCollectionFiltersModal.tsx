import {CustomFlowbiteTheme, Modal} from 'flowbite-react'
import React from 'react'
import CollectionFilters from "@/components/Filters/CollectionFilters";

const modalTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col tablet:h-auto h-auto desktop:h-auto ",
    base: "relative w-full p-10 desktop:h-auto tablet:h-auto max-h-[90vh]",
  }
}

export default function MobileCollectionFiltersModal({handleApplyFilters, isFiltersVisible, onClose,showModal}) {
  return (
     <Modal
        theme={modalTheme}
        position="center"
        onClose={onClose}
        show={showModal}
        size="md"
        className="bg-black flex items-center justify-center">
       <Modal.Header>Filters</Modal.Header>
       <Modal.Body>
         <CollectionFilters visible={isFiltersVisible} onApplyFilters={handleApplyFilters} onCloseModal={isFiltersVisible}/>
       </Modal.Body>
     </Modal>
  )
}