'use client'

import { Checkbox, Label, Radio } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import React, { useCallback, useState } from 'react'
import { APIParams, APIResponse } from '@/services/api/types'
import { Trait } from '@/types'
import Collapsible from '../Collapsible'
import { classNames } from '@/utils/string'
import { BrowserView, MobileView, isMobile } from 'react-device-detect'

export type FilterType = 'price' | 'type' | 'status'

export interface FilterProps {
  baseFilters?: FilterType[]
  onApplyFilters?: (filters: APIParams.FetchNFTs) => void
  traitsFilter?: APIResponse.CollectionDetails['traitAvailable']
  containerClass?: string
  onCloseModal?: () => void // For mobile modal
}

export default function NFTFilters({
  baseFilters = ['price', 'type', 'status'],
  traitsFilter,
  onApplyFilters,
  containerClass,
  onCloseModal
}: FilterProps) {
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
    if (key !== 'priceMax' && key !== 'priceMin' && !isMobile) {
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
    onApplyFilters?.(activeFilters)
    onCloseModal?.()
  }

  return (
    <>
      <div className={classNames('w-72 flex flex-col rounded-2xl border', containerClass)}>
        {baseFilters.includes('type') && (
          <Collapsible header="Type">
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <Radio
                  id="type-all"
                  value=""
                  checked={activeFilters.type === undefined}
                  onChange={() => handleChange('type', undefined)}
                />
                <Label htmlFor="type-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio
                  id="type-single"
                  value="ERC721"
                  checked={activeFilters.type === 'ERC721'}
                  onChange={() => handleChange('type', 'ERC721')} />
                <Label htmlFor="type-single">Single edition</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio
                  id="type-multiple"
                  value="ERC1155"
                  checked={activeFilters.type === 'ERC1155'}
                  onChange={() => handleChange('type', 'ERC1155')} />
                <Label htmlFor="type-multiple">Multiple editions</Label>
              </div>
            </div>
          </Collapsible>
        )}
        {baseFilters.includes('status') && (
          <Collapsible header="Status">
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <Radio
                  id="status-all"
                  value=""
                  checked={activeFilters.sellStatus === undefined}
                  onChange={() => handleChange('sellStatus', undefined)} />
                <Label htmlFor="status-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio
                  id="status-buy"
                  value="AskNew"
                  checked={activeFilters.sellStatus === 'AskNew'}
                  onChange={() => handleChange('sellStatus', 'AskNew')} />
                <Label htmlFor="type-buy">Buy now</Label>
              </div>
            </div>
          </Collapsible>
        )}
        {baseFilters.includes('status') && (
          <Collapsible header="Price">
            <div className="flex items-center gap-4 mb-4">
              <Input
                containerClass="w-24"
                scale="sm"
                placeholder="Min"
                value={activeFilters.priceMin as string}
                onChange={e => handleChange('priceMin', e.target.value)} />
              <Text className="text-primary">
                to
              </Text>
              <Input
                containerClass="w-24"
                scale="sm"
                placeholder="Max"
                value={activeFilters.priceMax as string}
                onChange={e => handleChange('priceMax', e.target.value)} />
            </div>
            <BrowserView>
              <Button className="w-full" variant="secondary" onClick={handleApplyFilters}>
                Apply
              </Button>
            </BrowserView>
            {/*{*/}
            {/*  !isMobile && (*/}
            {/*    <Button className="w-full" variant="secondary" onClick={handleApplyFilters}>*/}
            {/*      Apply*/}
            {/*    </Button>*/}
            {/*  )*/}
            {/*}*/}
          </Collapsible>
        )}
        {
          !!traitsFilter?.length && (
            <Collapsible header="Properties">
              {
                traitsFilter.map(item => (
                  <Collapsible key={item.key} header={<Text variant="body-16">{item.key}&nbsp;({item.count})</Text>}>
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
                  </Collapsible>
                ))
              }
            </Collapsible>
          )
        }
      </div>

      <MobileView>
        <Button className="w-full mt-6" variant="secondary" onClick={handleApplyFilters}>
          Apply
        </Button>
        <Button className="w-full mt-3" variant="text" onClick={onCloseModal}>
          Cancel
        </Button>
      </MobileView>
    </>
  )
}