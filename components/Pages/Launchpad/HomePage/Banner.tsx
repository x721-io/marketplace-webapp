'use client'
import React, {useEffect} from "react";
import ProjectSlide from './LaunchpadSlide';
import useSWR from 'swr'
import {useLaunchpadApi} from '@/hooks/useLaunchpadApi'
import Icon from "../../../Icon";
import Slider from "react-slick";


export default function HomePageBanner() {
  const api = useLaunchpadApi()
  const {data} = useSWR(
     'comingProjects',
     () => api.fetchProjects(),
     {revalidateOnFocus: false}
  )

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
       <Icon className="text-primary" name="arrow-right" width={32} height={32} />
    ),
    prevArrow: (
       <Icon className="text-primary" name="arrow-left" width={32} height={32} />
    )
  }

  return (
     <div className="w-full h-full mx-auto">
       <div className="text-heading-md text-body-16 text-white hidden " />
       <Slider {...settings}>
         {Array.isArray(data) && data.map(project => <ProjectSlide key={project.id} project={project} />)}
       </Slider>
     </div>
  )
}