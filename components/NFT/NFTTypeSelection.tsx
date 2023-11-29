import Text from '@/components/Text'
import { classNames } from '@/utils/string'
import { AssetType } from '@/types'

interface Props {
  title: string,
  onSelect: (type: AssetType) => void
}

export default function NFTTypeSelection({ title, onSelect }: Props) {

  return (
    <div className="w-full flex flex-col items-center gap-6 justify-center py-10 tablet:py-20 desktop:py-20">
      <Text className="text-primary font-semibold text-body-32 desktop:text-body-40 tablet:text-body-40">
        {title}
      </Text>
      <Text className="text-secondary px-4" variant="body-14">
        Choose “Single” for one of a kind or “Multiple” if you want to sell one collectible multiple times
      </Text>
      <div className="flex gap-4 tablet:w-[550px] w-full px-4">
        <div
          onClick={() => onSelect('ERC721')}
          className={classNames(
            'flex flex-col justify-center items-center gap-2 flex-1 cursor-pointer rounded-2xl tablet:p-8 desktop:p-8 p-4',
            'hover:border-2 hover:border-primary hover:bg-white hover:text-primary border text-tertiary bg-surface-soft'
          )}>
          <Text className="desktop:text-heading-sm tablet:text-heading-sm text-body-24 font-bold text-primary text-center">Single Item</Text>
          <Text className="text-body-12 font-bold text-secondary text-center">If you want to highlight the uniqueness
            and individuality of your item</Text>
        </div>
        <div
          onClick={() => onSelect('ERC1155')}
          className={classNames(
            'flex flex-col justify-center items-center gap-2 flex-1 cursor-pointer rounded-2xl tablet:p-8 desktop:p-8 p-4',
            'hover:border-2 hover:border-primary hover:bg-white hover:text-primary border text-tertiary bg-surface-soft'
          )}>
          <Text className="desktop:text-heading-sm tablet:text-heading-sm text-body-24 font-bold text-primary text-center">Multiple Edition</Text>
          <Text className="text-body-12 font-bold text-secondary text-center">If you want to share your NFT with a large
            number of community members</Text>
        </div>
      </div>
    </div>
  )
}