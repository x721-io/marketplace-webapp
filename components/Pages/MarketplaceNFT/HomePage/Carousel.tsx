"use client";

import Button from "@/components/Button";
import Image from "next/image";
import defaultSlider1 from "@/assets/images/default-slider-1.png";
import defaultSlider2 from "@/assets/images/default-slider-2.png";
import defaultSlider3 from "@/assets/images/default-slider-3.png";
import defaultSlider4 from "@/assets/images/default-slider-4.png";
import defaultSlider5 from "@/assets/images/default-slider-5.png";
import Link from "next/link";
import { CAMPAIGN_URL } from "@/config/constants";
import { MyCarousel } from "@/components/X721UIKits/Carousel";

export default function CarouselBanner() {
  const sliderImages = [
    {
      src: defaultSlider1,
      alt: "Slide 1",
      showButton: false,
      link: CAMPAIGN_URL,
    },
    { src: defaultSlider2, alt: "Slide 2", showButton: false, link: "" },
    { src: defaultSlider3, alt: "Slide 3", showButton: false, link: "" },
    { src: defaultSlider4, alt: "Slide 4", showButton: false, link: "" },
    { src: defaultSlider5, alt: "Slide 5", showButton: false, link: "" },
  ];

  return (
    <div className="flex justify-center items-center w-full">
      <div className="desktop:w-[480px] desktop:h-[480px] tablet:w-[340px] tablet:h-[340px] w-full h-[320px] ">
        <MyCarousel.Root pauseOnHover autoPlay slideIntervalInMs={5000}>
          {sliderImages.map((image, index) => (
            <MyCarousel.Item key={index}>
              <div className="flex h-full w-full  justify-center items-center">
                <Image
                  className="rounded-2xl object-cover w-full h-full"
                  src={image.src}
                  alt={image.alt}
                  width={500}
                />
                {image.showButton && (
                  <div className="absolute bottom-8 px-10 w-full">
                    <Link target="_blank" href={image.link}>
                      <Button
                        className="w-full flex items-center justify-center  shadow-2xl shadow-cyan-500/50 opacity-70 hover:opacity-100"
                        scale="lg"
                        variant="secondary"
                      >
                        <span className="text-black">Discover</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </MyCarousel.Item>
          ))}
        </MyCarousel.Root>
      </div>
    </div>
  );
}
