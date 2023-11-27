import { Spinner } from 'flowbite-react'

export default function LoadingScreen() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Spinner size="xl"/>
    </div>
  )
}