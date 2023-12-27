'use client'

import { Accordion } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { APIParams } from '@/services/api/types'
import { useState } from 'react'

interface Props {
  visible: boolean
  onApplyFilters?: (filters: APIParams.FetchCollections) => void
}

export default function CollectionFilters({ onApplyFilters, visible }: Props) {
  const [activeFilters, setActiveFilters] = useState<APIParams.FetchCollections>({
    min: '',
    max: ''
  })
  const handleChange = (key: keyof typeof activeFilters, value: any) => {
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      const _filters = { ...activeFilters };
      _filters[key] = value;
      setActiveFilters(_filters);
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters?.(activeFilters)
    // onCloseModal?.()
  }

  if (!visible) return null

  return (
    <div className="w-72 flex flex-col gap-4">
      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Floor Price</Accordion.Title>
          <Accordion.Content>
            <div className="flex items-center gap-4 mb-4">
              <Input
                value={activeFilters.min as string}
                onChange={e => handleChange('min', e.target.value)}
                containerClass="w-24"
                scale="sm"
                placeholder="Min"
              />
              <Text className="text-primary">
                to
              </Text>
              <Input
                value={activeFilters.max as string}
                onChange={e => handleChange('max', e.target.value)}
                containerClass="w-24"
                scale="sm"
                placeholder="Max"
              />
            </div>

            <Button className="w-full" variant="secondary" onClick={handleApplyFilters}>
              Apply
            </Button>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  )
}