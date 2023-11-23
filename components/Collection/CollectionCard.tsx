import Image from 'next/image'
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import { APIResponse } from '@/services/api/types'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  collection: APIResponse.Collection
}

export default function CollectionCard({ collection, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-6 border border-disabled rounded-2xl p-4" {...rest}>
      <div className="flex items-center gap-3">
        <Image className="rounded-xl" src="https://fakeimg.pl/300/" alt="" width={48} height={48} />
        <div>
          <div className="flex items-center gap-2">
            <Text className="text-primary font-semibold" variant="body-16">
              {collection.name}
            </Text>
            <Icon name="verified" width={16} height={16} />
          </div>

          <Text className="text-secondary font-semibold" variant="body-16">
            {0} U2U
          </Text>
        </div>
      </div>

      {/* Collection stats */}
      <div className="flex w-fit items-center gap-10 px-6 py-3 rounded-2xl bg-surface-soft">
        <div>
          <Text className="text-secondary mb-2">Floor</Text>
          <Text variant="body-16">
            <span className="text-primary font-semibold">{0}</span>
            &nbsp;
            <span className="text-secondary">U2U</span>
          </Text>
        </div>

        <div>
          <Text className="text-secondary mb-2">Volume</Text>
          <Text variant="body-16">
            <span className="text-primary font-semibold">{0}</span>
            &nbsp;
            <span className="text-secondary">U2U</span>
          </Text>
        </div>

        <div>
          <Text className="text-secondary mb-2">Items</Text>
          <Text className="text-primary font-semibold" variant="body-16">
            {0}
          </Text>
        </div>

        <div>
          <Text className="text-secondary mb-2">Owner</Text>
          <Text className="text-primary font-semibold" variant="body-16">
            {collection.creators[0]?.username}
          </Text>
        </div>

        {/*<div>*/}
        {/*  <Text className="text-secondary mb-2">Royalties</Text>*/}
        {/*  <Text className="text-primary font-semibold" variant="body-16">*/}
        {/*    {0}%*/}
        {/*  </Text>*/}
        {/*</div>*/}
      </div>

      {/* Highlighted NFTs */}
      <div className="flex gap-3 max-w-full overflow-y-auto">
        {
          Array.from(Array(20)).map((item, index) => (
            <Image
              className="rounded-xl"
              key={index}
              width={220}
              height={200}
              src="https://fakeimg.pl/220x200/"
              alt="" />
          ))
        }
      </div>
    </div>
  )
}