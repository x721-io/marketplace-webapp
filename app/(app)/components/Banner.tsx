"use client"

import Text from '@/components/Text'
import { Carousel } from 'flowbite-react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { HEADER_HEIGHT } from '@/components/Layout/MainHeader'

export default function HomePageBanner() {
  return (
    <div className="flex items-stretch justify-center gap-12 bg-transparent" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <div className="flex justify-center items-center">
        <div className="w-[600px]">
          <Text className="text-heading-xl text-primary font-semibold mb-12">
            Discover digital art and Collect NFTs
          </Text>
          <div className="flex items-center gap-4">
            <Button className="bg-purple-500 hover:bg-purple-500/80">
              Create your NFTs
              <Icon name="arrowRight" />
            </Button>
            <Button variant="secondary">
              Start exploring
              <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-[480px] h-[480px]">
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