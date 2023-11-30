import Text from '@/components/Text'
import { useEffect } from 'react'
import { APIResponse } from '@/services/api/types'

export default function OverviewTab({ metaData }: { metaData?: APIResponse.NFTMetaData }) {

  return (
    <div className="py-7">
      <Text className="text-primary font-bold mb-4" variant="body-16">
        Description
      </Text>
      <Text className="text-secondary mb-10" variant="body-16">
        {metaData?.data?.description || 'Nothing to show'}
      </Text>
    </div>
  )
}