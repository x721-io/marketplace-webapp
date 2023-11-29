import { Spinner } from 'flowbite-react'

export default function LoadingScreen() {
  return (
    <div className="w-full h-96 flex justify-center items-center">
      <Spinner size="xl"/>
    </div>
  )
}