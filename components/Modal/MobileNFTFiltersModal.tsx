import {CustomFlowbiteTheme, Modal, ModalProps} from 'flowbite-react'
import NFTFilters, {FilterProps} from '@/components/Filters/NFTFilters'
import React from 'react'

const modalTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col tablet:h-auto h-auto desktop:h-auto ",
    base: "relative w-full p-10 desktop:h-auto tablet:h-auto max-h-[90vh]",
  }
}

export default function MobileNFTFiltersModal({
                                                baseFilters,
                                                onApplyFilters,
                                                traitsFilter,
                                                show,
                                                onClose
                                              }: ModalProps & FilterProps) {
  return (
     <Modal
        theme={modalTheme}
        position="center"
        onClose={onClose}
        show={show}
        size="md"
        className="bg-black flex items-center justify-center">
       <Modal.Header>Filters</Modal.Header>
       <Modal.Body>
         <NFTFilters
            baseFilters={baseFilters}
            onApplyFilters={onApplyFilters}
            containerClass="w-full"
            traitsFilter={traitsFilter}
            onCloseModal={onClose}/>
       </Modal.Body>
     </Modal>
  )
}