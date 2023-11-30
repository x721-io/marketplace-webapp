import Text from '@/components/Text'
import React, { useEffect } from 'react'
import { APIResponse } from '@/services/api/types'

export default function OverviewTab({ metaData }: { metaData?: APIResponse.NFTMetaData }) {

  return (
    <div className="py-7">
      <Text className="text-primary font-bold mb-4" variant="body-16">
        Description
      </Text>
      <div className="p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary text-center text-sm">
          {metaData?.data?.description || 'Nothing to show'}
        </Text>
      </div>
    </div>
  )
}