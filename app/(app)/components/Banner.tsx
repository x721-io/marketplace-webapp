"use client"

import Text from '@/components/Text'
import { Carousel } from 'flowbite-react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { HEADER_HEIGHT } from '@/components/Layout/MainHeader'
import Image from 'next/image'
import defaultSlider1 from '@/assets/images/default-slider-1.png'
import defaultSlider2 from '@/assets/images/default-slider-2.png'
import defaultSlider3 from '@/assets/images/default-slider-3.png'
import defaultSlider4 from '@/assets/images/default-slider-4.png'
import defaultSlider5 from '@/assets/images/default-slider-5.png'
import { useRouter } from "next/navigation";

export default function HomePageBanner() {
  const router = useRouter()

  return (
    <div className="flex items-stretch justify-center gap-12 bg-transparent flex-col desktop:flex-row tablet:flex-row tablet:w-full my-8 mx-4 tablet:mx-auto desktop:mx-auto">
      <div className="flex justify-center items-center order-2 tablet:order-1">
        <div className="desktop:w-[611px] w-full tablet:pl-8">
          <Text className="desktop:text-heading-xl text-body-40 text-primary font-semibold mb-12">
            Discover digital art and Collect NFTs
          </Text>
          <div className="flex items-center gap-4 flex-col tablet:flex-row desktop:flex-row">
            <Button
              onClick={() => router.push('/create/nft')}
              className="bg-purple-500 hover:bg-purple-500/80 w-full tablet:w-auto desktop:w-auto">
              Create your NFTs
              <Icon name="arrowRight" />
            </Button>
            <Button
              onClick={() => router.push('/explore/items')}
              className="w-full tablet:w-auto desktop:w-auto"
              variant="secondary">
              Start exploring
              <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center order-1 tablet:order-2">
        <div className="desktop:w-[480px] desktop:h-[480px] tablet:w-[340px] tablet:h-[340px] w-full h-[320px] tablet:pr-8">
          <Carousel>
            <Image
              className="rounded-tl-xl rounded-tr-xl object-cover"
              src={defaultSlider1}
              alt="Cover"
              style={{ width: '100%', height: '100%' }}
            />
            <Image
              className="rounded-tl-xl rounded-tr-xl object-cover"
              src={defaultSlider2}
              alt="Cover"
              style={{ width: '100%', height: '100%' }}
            />
            <Image
              className="rounded-tl-xl rounded-tr-xl object-cover"
              src={defaultSlider3}
              alt="Cover"
              style={{ width: '100%', height: '100%' }}
            />
            <Image
              className="rounded-tl-xl rounded-tr-xl object-cover"
              src={defaultSlider4}
              alt="Cover"
              style={{ width: '100%', height: '100%' }}
            />
            <Image
              className="rounded-tl-xl rounded-tr-xl object-cover"
              src={defaultSlider5}
              alt="Cover"
              style={{ width: '100%', height: '100%' }}
            />
          </Carousel>
        </div>
      </div>
    </div>
  )
}