import Text from '@/components/Text'
import React from 'react'
import { NFTMetadata } from '@/types'

export default function PropertiesTab({ metaData }: { metaData?: NFTMetadata }) {
  return (
    <div className="flex flex-col gap-4 py-7">
      {
        Array.isArray(metaData?.attributes) && metaData?.attributes?.length ? (
          <>
            <div className="flex items-center">
              <div className="flex-1">
                <Text className="text-secondary font-bold">Name</Text>
              </div>
              <div className="flex-1">
                <Text className="text-secondary font-bold">Value</Text>
              </div>
            </div>
            {
              Array.isArray(metaData?.attributes) && metaData?.attributes.map(trait => (
                <div key={trait.trait_type} className="flex items-center p-3 rounded-2xl border border-tertiary">
                  <div className="flex-1">
                    <Text className="text-secondary font-bold mb-1">{trait.trait_type}</Text>
                    {/*<Text className="text-body-16 font-bold">{trait.value}</Text>*/}
                  </div>
                  <div className="flex-1">
                    <Text className="text-body-16 font-bold">{trait.value}</Text>
                    {/*<Text className="text-body-16 font-bold">5%</Text>*/}
                  </div>
                </div>
              ))
            }
          </>
        ) : (
          <div className="p-7 rounded-2xl border border-disabled border-dashed">
            <Text className="text-secondary text-center text-body-18">Nothing to show</Text>
          </div>
        )
      }
    </div>
  )
}