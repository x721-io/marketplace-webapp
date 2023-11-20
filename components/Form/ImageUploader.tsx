"use client"

import Image from 'next/image'
import CloseIcon from '@/components/Icon/Close'
import { useMemo, useRef, useState } from 'react'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { classNames } from '@/utils/string'

interface Props {
  className?: string
  image?: string | Blob
  onInput?: (file: Blob | undefined) => void
}

export default function ImageUploader({ className, image, onInput }: Props) {
  const [file, setFile] = useState<Blob | undefined>()
  const inputRef = useRef<HTMLInputElement>(null)

  const previewImage = useMemo(() => {
    if (image) {
      if (typeof image === "string") return image;
      return URL.createObjectURL(image)
    }

    if (!file) return ""
    return URL.createObjectURL(file)
  }, [file, image])

  const handleInputImage = (files: FileList | null) => {
    if (files) {
      onInput && onInput(files[0])
      setFile(files[0]);
    } else {
      onInput && onInput(undefined)
      setFile(undefined)
    }
  }
  const handleBrowseFile = () => {
    if (file) return
    inputRef.current?.click()
  }

  const handleClearImage = () => {
    onInput && onInput(undefined)
    setFile(undefined)
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={classNames("relative cursor-pointer p-1 border border-tertiary border-dashed rounded-2xl w-full", className)}
      onClick={handleBrowseFile}>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={(e) => handleInputImage(e.target.files)}
      />

      {!!file ? (
        <Image
          src={previewImage}
          alt=""
          width={1}
          height={1}
          className="w-full h-auto object-cover rounded-2xl" />
      ) : (
        <div className="w-full px-10 py-20 flex flex-col justify-center items-center gap-6">
          <Text className="font-semibold text-secondary" variant="body-24">
            PNG, GIF, WEBP, MP4 or MP3. Max 100mb.
          </Text>
          <Button variant="primary">
            Choose File
          </Button>
        </div>
      )}

      {!!file && (
        <Button
          variant="icon"
          className="absolute right-0 top-[-18px]"
          onClick={handleClearImage}>
          <CloseIcon width={20} height={20} />
        </Button>
      )}
    </div>
  )
}