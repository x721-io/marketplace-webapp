import React from 'react'
import Image from "next/image";
import {getUserCoverImage} from "@/utils/string";
import Maintenance from '@/assets/images/maintenance.jpeg';
import Text from "@/components/Text";



export default function MaintenancePage() {

  return (
     <div className="w-full h-screen flex gap-4 flex-col items-center justify-center">
       <Image
          className=" w-full h-full"
          src={Maintenance}
          alt=""
          style={{ width: '30%', height: '30%' }}
       />
       <Text className="text-heading-sm text-primary text-body-14"  >Website Under Maintenance</Text>
       <Text className="text-body-18">Sorry for the inconvenience. We are currently undergoing maintenance. Please check back later.</Text>
     </div>
  )
}