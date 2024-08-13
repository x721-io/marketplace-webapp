'use client';

import Text from '@/components/Text';
import { classNames } from '@/utils/string';
import CheckCircleIcon from '../Icon/CheckCircle';
import MultiSelectIcon from '../Icon/MultiSelect';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
  mode: 'collection' | 'nft';
}

export default function AssetTypeSelection({ title, mode }: Props) {
  const t = useTranslations('CreateNft');

  return (
    <div className='w-full flex flex-col items-center gap-6 justify-center py-10 tablet:py-10 tablet:px-20 desktop:py-10 desktop:px-20'>
      <div className='w-full flex flex-col items-center gap-2 tablet:gap-4 desktop:gap-4 justify-center'>
        <Text className='text-primary font-semibold text-body-32 desktop:text-body-40 tablet:text-body-40'>
          {t(`Title.${mode}`)}
        </Text>
        <Text
          className='text-secondary w-[190px] desktop:w-full tablet:w-full text-center'
          variant='body-14'
        >
          {t('Description')}
        </Text>
      </div>

      <div className='flex flex-col tablet:flex-row desktop:flex-row gap-6 justify-center items-center w-full py-0 tablet:p-0 desktop:py-4 desktop:px-20'>
        <div>
          <Link
            href={`${mode}/ERC721`}
            className={classNames(
              'flex flex-col justify-center items-center gap-2 flex-1 cursor-pointer rounded-2xl p-6',
              'border hover:border-primary hover:bg-surface-soft text-tertiary'
            )}
          >
            <CheckCircleIcon width={34} height={34} />
            <Text className='text-heading-xs font-bold text-primary text-center'>
              {t('Type.Single.Title')}
            </Text>
            <Text className='text-body-14 font-bold text-secondary text-center w-[200px]'>
              {t('Type.Single.Description')}
            </Text>
          </Link>
        </div>
        <div>
          <Link
            href={`${mode}/ERC1155`}
            className={classNames(
              'flex flex-col justify-center items-center gap-2 flex-1 cursor-pointer rounded-2xl p-6',
              'border hover:border-primary hover:bg-surface-soft text-tertiary'
            )}
          >
            <MultiSelectIcon width={34} height={34} />
            <Text className='text-heading-xs font-bold text-primary text-center'>
              {t('Type.Mutiple.Title')}
            </Text>
            <Text className='text-body-14 font-bold text-secondary text-center w-[200px]'>
              {t('Type.Mutiple.Description')}
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
}
