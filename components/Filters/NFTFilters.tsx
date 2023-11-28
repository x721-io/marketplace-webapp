import { Accordion, Label, Radio } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { ChangeEvent, useState } from 'react'

export type FilterType = 'price' | 'type' | 'status'

interface Props {
  filters?: FilterType[]
  onApplyFilters?: (filters: Record<string, any>) => void
}

export default function NFTFilters({ filters = ['price', 'type', 'status'], onApplyFilters }: Props) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    type: '',
    sellStatus: '',
    priceMax: '',
    priceMin: ''
  })

  const handleChange = (key: any, e: ChangeEvent<HTMLInputElement>) => {
    const _filters = { ...activeFilters }
    _filters[key] = e.target.value
    setActiveFilters(_filters)
    if (key !== 'priceMax' && key !== 'priceMin') {
      onApplyFilters?.(_filters)
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters?.(activeFilters)
  }

  return (
    <div className="w-72 flex flex-col gap-4">
      {filters.includes('type') && (
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Type</Accordion.Title>
            <Accordion.Content>
              <div className="flex items-center gap-7 flex-wrap">
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-all"
                    value=""
                    checked={activeFilters.type === ''}
                    onChange={e => handleChange('type', e)}
                  />
                  <Label htmlFor="type-all">All</Label>
                </div>
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-single"
                    value="ERC721"
                    checked={activeFilters.type === 'ERC721'}
                    onChange={e => handleChange('type', e)} />
                  <Label htmlFor="type-single">Single edition</Label>
                </div>
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-multiple"
                    value="ERC1155"
                    checked={activeFilters.type === 'ERC1155'}
                    onChange={e => handleChange('type', e)} />
                  <Label htmlFor="type-multiple">Multiple editions</Label>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}

      {filters.includes('status') && (
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Status</Accordion.Title>
            <Accordion.Content>
              <div className="flex items-center gap-7 flex-wrap">
                <div className="flex gap-3 items-center">
                  <Radio
                    id="status-all"
                    value=""
                    checked={activeFilters.sellStatus === ''}
                    onChange={e => handleChange('sellStatus', e)} />
                  <Label htmlFor="status-all">All</Label>
                </div>
                <div className="flex gap-3 items-center">
                  <Radio
                    id="status-buy"
                    value="AskNew"
                    checked={activeFilters.sellStatus === 'AskNew'}
                    onChange={e => handleChange('sellStatus', e)} />
                  <Label htmlFor="type-buy">Buy now</Label>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}

      {filters.includes('status') && (
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Price</Accordion.Title>
            <Accordion.Content>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  containerClass="w-24"
                  scale="sm"
                  placeholder="Min"
                  type="number"
                  onChange={e => handleChange('priceMin', e)} />
                <Text className="text-primary">
                  to
                </Text>
                <Input
                  containerClass="w-24"
                  scale="sm"
                  placeholder="Max"
                  type="number"
                  onChange={e => handleChange('priceMax', e)} />
              </div>

              <Button className="w-full" variant="secondary" onClick={handleApplyFilters}>
                Apply
              </Button>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}
    </div>
  )
}