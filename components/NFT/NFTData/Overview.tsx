import Text from '@/components/Text'
import React from 'react'
import { APIResponse } from '@/services/api/types'

export default function OverviewTab({ metaData }: { metaData?: APIResponse.NFTMetaData }) {

  return (
    <div className="py-7">
      <Text className="text-primary font-bold mb-4" variant="body-16">
        Description
      </Text>
      {
        !metaData?.description ? (
          <div className="p-7 rounded-2xl border border-disabled border-dashed">
            <Text className="text-secondary text-center text-sm">
              Nothing to show
            </Text>
          </div>
        ) : (
          <Text className="text-secondary text-sm">
            {metaData?.description}
          </Text>
        )
      }
    </div>
  )
}