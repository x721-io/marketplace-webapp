"use client"

import Text from '@/components/Text'
import { Carousel } from 'flowbite-react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { HEADER_HEIGHT } from '@/components/Layout/MainHeader'

export default function HomePageBanner() {
  return (
    <div className="flex items-stretch justify-center gap-12 bg-transparent flex-col desktop:flex-row tablet:flex-row tablet:w-full my-8 mx-4 tablet:mx-auto desktop:mx-auto">
      <div className="flex justify-center items-center">
        <div className="desktop:w-[611px] tablet:w-[408px] w-full tablet:pl-8">
          <Text className="desktop:text-heading-xl text-body-40 text-primary font-semibold mb-12">
            Discover digital art and Collect NFTs
          </Text>
          <div className="flex items-center gap-4 flex-col tablet:flex-row desktop:flex-row">
            <Button className="bg-purple-500 hover:bg-purple-500/80 w-full tablet:w-auto desktop:w-auto">
              Create your NFTs
              <Icon name="arrow-right" />
            </Button>
            <Button className='w-full tablet:w-auto desktop:w-auto' variant="secondary">
              Start exploring
              <Icon name="arrow-right" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="desktop:w-[480px] desktop:h-[480px] tablet:w-[340px] tablet:h-[340px] w-[320px] h-[320px] tablet:pr-8">
          <Carousel>
            <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
          </Carousel>
        </div>
      </div>
    </div>
  )
}