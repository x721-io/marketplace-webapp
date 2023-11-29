import Text from '@/components/Text'

export default function OverviewTab() {
  return (
    <div className="py-7">
      <Text className="text-primary font-bold mb-4" variant="body-16">
        Description
      </Text>
      <Text className='text-secondary mb-10' variant='body-16'>
        Nothing to show
      </Text>
      <div className='bg-surface-soft p-4 rounded-2xl'>
        <div>
          <Text className='text-primary font-bold' variant="body-16">Collection</Text>
        </div>
      </div>
    </div>
  )
}