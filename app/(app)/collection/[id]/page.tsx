import UploadIcon from '@/components/Icon/Upload'
import React from 'react'

export default function CollectionPage() {
  return (
    <div className="w-full relative">
      <div className="bg-cover rounded-2xl relative w-full h-[180px]"
           style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>
        <div className="rounded-2xl absolute ml-6 block w-[120px] h-[120px]"
             style={{ bottom: "-46px", background: 'var(--gradient-002, linear-gradient(86deg, #5D96FF 4.33%, #D466FF 99.12%))' }}></div>
        <div className='absolute right-2 top-2'>
          <button className='bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl '>
            <UploadIcon />
          </button>
        </div>
      </div>
    </div>
  )
}