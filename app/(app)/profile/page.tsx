"use client"
import React, { useMemo, useRef, useState } from 'react';
import { Tabs } from 'flowbite-react';
import useAuthStore from '@/store/auth/store';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import AccountStep from './component/AccountStep';
import ProfileStep from './component/ProfileStep';
import WalletStep from './component/WalletStep';
import NotificationStep from './component/NotificationStep';
import SectionCover from './component/SectionCover';


interface FormState {
  bio: string
  username: string
  linkweb: string
  linktwitter: string
  email: string
  twitterLink: string
  webURL: string
  facebookLink: string
  telegramLink: string
  discordLink: string
  avatar: string
  coverImage: string
}

export default function ProfilePage() {
  const { onUpdateProfile } = useAuth()
  const { setProfile } = useAuthStore()

  const api = useMarketplaceApi()
  const { handleSubmit, register, formState: { errors, isDirty } } = useForm<FormState>()
  const profile = useAuthStore(state => state.profile)
  const username = useAuthStore(state => state.profile?.username?.toString()) || '';
  const email = useAuthStore(state => state.profile?.email) || '';
  const bio = useAuthStore(state => state.profile?.bio) || '';
  const webURL = useAuthStore(state => state.profile?.webURL) || '';
  const twitterLink = useAuthStore(state => state.profile?.twitterLink) || '';

  const [imageAvt, setImageAvt] = useState<Blob | undefined>()
  const [imageCover, setImageCover] = useState<Blob | undefined>()
  const [file, setFile] = useState<Blob | undefined>()
  const [fileCover, setFileCover] = useState<Blob | undefined>()
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRefCover = useRef<HTMLInputElement>(null)

  const previewImage = useMemo(() => {
    if (imageAvt) {
      if (typeof imageAvt === "string") return imageAvt;
      return URL.createObjectURL(imageAvt)
    }

    if (!file) return ""
    return URL.createObjectURL(file)
  }, [file, imageAvt])

  const previewImageCover = useMemo(() => {
    if (imageCover) {
      if (typeof imageCover === "string") return imageCover;
      return URL.createObjectURL(imageCover)
    }

    if (!fileCover) return ""
    return URL.createObjectURL(fileCover)
  }, [fileCover, imageCover])

  const handleInputImage = (files: FileList | null) => {
    if (files) {
      setImageAvt(files[0])
      setFile(files[0])
    } else {
      setImageAvt(undefined)
      setFile(undefined)
    }
  }

  const handleInputImageCover = (files: FileList | null) => {
    if (files) {
      setImageCover(files[0])
      setFileCover(files[0])
    } else {
      setImageCover(undefined)
      setFileCover(undefined)
    }
  }

  const handleClearImage = () => {
    setImageAvt(undefined)
    setFile(undefined)
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const handleClearImageCover = () => {
    setImageCover(undefined)
    setFileCover(undefined)
    if (inputRefCover && inputRefCover.current) {
      inputRefCover.current.value = ""
    }
  }

  const onSubmitProfile = async ({ bio, username, webURL, twitterLink }: FormState) => {
    if (!imageAvt || !imageCover) return

    const toastId = toast.loading('Uploading Profile...', { type: 'info' })

    try {
      const { fileHashes } = await api.uploadFile([imageAvt, imageCover])
      const params = {
        username,
        bio,
        webURL,
        twitterLink,
        avatar: fileHashes[0],
        coverImage: fileHashes[1],
        shortLink: username
      }
      await onUpdateProfile(params)

      if (profile) {
        setProfile({
          ...profile,
          ...params
        })
      }

      toast.update(toastId, { render: 'Profile updated successfully', type: 'success', isLoading: false, autoClose: 1000 })
    } catch (e) {
      console.error('Error:', e)
      toast.update(toastId, { render: `Profile updating: ${e}`, type: 'error', isLoading: false, autoClose: 1000 })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitProfile)}>

      <div className="w-full relative flex flex-col items-center desktop:py-10 tablet:p-10 py-16 px-4">
        <SectionCover
          file={file}
          fileCover={fileCover}
          inputRef={inputRef}
          inputRefCover={inputRefCover}
          onHandleInputImage={handleInputImage}
          onPreviewImage={previewImage}
          onHandleClearImage={handleClearImage}
          onHandleClearImageCover={handleClearImageCover}
          onHandleInputImageCover={handleInputImageCover}
          onPreviewImageCover={previewImageCover}
        />
        <div className="w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
          <Tabs.Group aria-label="Tabs with underline" style="underline">
            <Tabs.Item active title="Profile">
              <ProfileStep
                isDirty={!isDirty}
                registerUsername={register('username', { required: true, value: username })}
                registerBio={register('bio', { value: bio })}
                registerWebURL={register('webURL', { value: webURL })}
                registerTwitterLink={register('twitterLink', { value: twitterLink })}
              />
            </Tabs.Item>
            <Tabs.Item active title="Account">
              <AccountStep
                registerEmail={register('email', { required: true, value: email })}
              />
            </Tabs.Item>
            <Tabs.Item active title="Wallet">
              <WalletStep />
            </Tabs.Item>
            <Tabs.Item active title="Notification">
              <NotificationStep />
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </form>

  )
}