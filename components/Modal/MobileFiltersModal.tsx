import { Modal, ModalProps } from 'flowbite-react'
import NFTFilters, { FilterProps } from '@/components/Filters/NFTFilters'
import Button from '@/components/Button'
import React from 'react'

export default function MobileFiltersModal({
  baseFilters,
  onApplyFilters,
  traitsFilter,
  show,
  onClose
}: ModalProps & FilterProps) {
  return (
    <Modal
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
          onCloseModal={onClose} />
      </Modal.Body>
    </Modal>
  )
}