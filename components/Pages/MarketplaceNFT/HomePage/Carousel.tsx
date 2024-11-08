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
import ChevronDownIcon from "@/components/Icon/ChevronDown";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

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
    <div className="flex justify-center items-center w-full max-[768px]:mb-7">
      <div className="desktop:w-[480px] desktop:h-[480px] tablet:w-[340px] tablet:h-[340px] w-full h-[320px]">
        <Carousel
          showArrows={true}
          showThumbs={false}
          showIndicators={true}
          className="relative h-full"
          autoPlay={true}
          infiniteLoop
          stopOnHover={true}
          renderArrowPrev={(prev) => (
            <button
              onClick={prev}
              className="left-[10px] rotate-[90deg]  absolute w-[35px] h-[35px] bg-[rgba(255,255,255,0.6)] hover:bg-[white] rounded-full top-[50%] -translate-y-[25%] z-[10]"
            >
              <ChevronDownIcon className="scale-[0.6]" />
            </button>
          )}
          renderArrowNext={(next) => (
            <button
              onClick={next}
              className="right-[30px] z-[10] translate-x-[20px] rotate-[-90deg] absolute w-[35px] h-[35px] bg-[rgba(255,255,255,0.6)] hover:bg-[white] rounded-full top-[50%] -translate-y-[25%]"
            >
              <ChevronDownIcon className="scale-[0.6]" />
            </button>
          )}
        >
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className="flex aspect-square w-full  justify-center items-center"
            >
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
          ))}
        </Carousel>
      </div>
    </div>
  );
}
