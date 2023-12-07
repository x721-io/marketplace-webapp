'use client'

import { Accordion, Checkbox, Label, Radio } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { ChangeEvent, useCallback, useState } from 'react'
import { APIParams, APIResponse } from '@/services/api/types'
import { Trait } from '@/types'

export type FilterType = 'price' | 'type' | 'status'

interface Props {
  baseFilters?: FilterType[]
  onApplyFilters?: (filters: APIParams.FetchNFTs) => void
  traitsFilter?: APIResponse.CollectionDetails['traitAvailable']
}

export default function NFTFilters({ baseFilters = ['price', 'type', 'status'], traitsFilter, onApplyFilters }: Props) {
  const [activeFilters, setActiveFilters] = useState<APIParams.FetchNFTs>({
    type: undefined,
    sellStatus: undefined,
    priceMax: '',
    priceMin: '',
    traits: []
  })

  const handleChange = (key: keyof typeof activeFilters, value: any) => {
    const _filters = { ...activeFilters }
    _filters[key] = value
    setActiveFilters(_filters)
    if (key !== 'priceMax' && key !== 'priceMin') {
      onApplyFilters?.(_filters)
    }
  }

  const isTraitSelected = useCallback((key: string, value: string) => {
    const traits = activeFilters.traits
    return traits?.some((t: Trait) => {
      return t.trait_type === key && t.value === value
    })
  }, [activeFilters])

  const handleSelectTrait = (key: string, value: any) => {
    const _traits = activeFilters.traits ? [...activeFilters.traits] : []
    const isExist = isTraitSelected(key, value)

    if (isExist) {
      const index = _traits.findIndex(t => t.trait_type === key)
      _traits.splice(index, 1)
    } else {
      _traits.push({
        trait_type: key,
        value
      })
    }

    handleChange('traits', _traits)
  }

  const handleApplyFilters = () => {
    console.log(activeFilters)
    onApplyFilters?.(activeFilters)
  }

  return (
    <div className="w-72 flex flex-col gap-4">
      {baseFilters.includes('type') && (
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Type</Accordion.Title>
            <Accordion.Content>
              <div className="flex items-center gap-7 flex-wrap">
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-all"
                    value=""
                    checked={activeFilters.type === undefined}
                    onChange={e => handleChange('type', e)}
                  />
                  <Label htmlFor="type-all">All</Label>
                </div>
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-single"
                    value="ERC721"
                    checked={activeFilters.type === 'ERC721'}
                    onChange={e => handleChange('type', e.target.value)} />
                  <Label htmlFor="type-single">Single edition</Label>
                </div>
                <div className="flex gap-3 items-center">
                  <Radio
                    id="type-multiple"
                    value="ERC1155"
                    checked={activeFilters.type === 'ERC1155'}
                    onChange={e => handleChange('type', e.target.value)} />
                  <Label htmlFor="type-multiple">Multiple editions</Label>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}

      {baseFilters.includes('status') && (
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Status</Accordion.Title>
            <Accordion.Content>
              <div className="flex items-center gap-7 flex-wrap">
                <div className="flex gap-3 items-center">
                  <Radio
                    id="status-all"
                    value=""
                    checked={activeFilters.sellStatus === undefined}
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

      {baseFilters.includes('status') && (
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
                  onChange={e => handleChange('priceMin', e.target.value)} />
                <Text className="text-primary">
                  to
                </Text>
                <Input
                  containerClass="w-24"
                  scale="sm"
                  placeholder="Max"
                  type="number"
                  onChange={e => handleChange('priceMax', e.target.value)} />
              </div>

              <Button className="w-full" variant="secondary" onClick={handleApplyFilters}>
                Apply
              </Button>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}

      {
        !!traitsFilter?.length && (
          <div>
            <Text className="mb-3">Properties</Text>
            <Accordion collapseAll>
              {
                traitsFilter.map(item => (
                  <Accordion.Panel key={item.key}>
                    <Accordion.Title>
                      <Text variant="body-16">{item.key}&nbsp;({item.count})</Text>
                    </Accordion.Title>
                    <Accordion.Content>
                      {
                        item.traits.map(trait => (
                          <div key={trait.value} className="flex items-center gap-2 py-2">
                            <Checkbox
                              id={`trait-${trait.value}`}
                              checked={isTraitSelected(item.key, trait.value)}
                              onChange={() => handleSelectTrait(item.key, trait.value)}
                            />
                            <Label
                              htmlFor={`trait-${trait.value}`}
                              className="flex-1 text-body-16 text-secondary font-semibold">
                              {trait.value}
                            </Label>
                            <Text>
                              {trait.count}
                            </Text>
                          </div>
                        ))
                      }
                    </Accordion.Content>
                  </Accordion.Panel>
                ))
              }
            </Accordion>
          </div>
        )
      }
    </div>
  )
}