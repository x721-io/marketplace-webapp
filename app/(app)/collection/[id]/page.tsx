'use client'

import React from 'react'
import BannerSectionCollection from './component/BannerSection'
import InformationSectionCollection from './component/InformationSection'
import ListSectionCollection from './component/ListCollectionSection'

export default function CollectionPage() {
  return (
    <div className="w-full relative">
      <BannerSectionCollection />
      <InformationSectionCollection />
      <ListSectionCollection />
    </div>
  )
}