import { APIResponse } from '@/services/api/types'
import Text from '@/components/Text'
import React from 'react'

export default function PropertiesTab({ metaData }: { metaData?: APIResponse.NFTMetaData }) {
  return (
    <div className="flex flex-col gap-4 py-7">
      {
        metaData?.data.traits?.length ? (
          <>
            <div className="flex items-center">
              <div className="flex-1">
                <Text className="text-secondary font-bold">Name</Text>
              </div>
              <div className="flex-1">
                <Text className="text-secondary font-bold">Rarity</Text>
              </div>
            </div>
            {
              Array.isArray(metaData?.data.traits) && metaData?.data.traits.map(trait => (
                <div key={trait.trait_type} className="flex items-center p-3 rounded-2xl border border-tertiary">
                  <div className="flex-1">
                    <Text className="text-secondary font-bold mb-1">{trait.trait_type}</Text>
                    <Text className="text-body-16 font-bold">{trait.value}</Text>
                  </div>
                  <div className="flex-1">
                    <Text className="text-body-16 font-bold">5%</Text>
                  </div>
                </div>
              ))
            }
          </>
        ) : (
          <div className="p-7 rounded-2xl border border-disabled border-dashed">
            <Text className="text-secondary text-center text-sm">Nothing to show</Text>
          </div>
        )
      }

    </div>
  )
}