"use client"
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image'
import u2uWalletSvg from '@/assets/u2uWallet.svg'
import cryptoSvg from '@/assets/crypto.svg'
import UploadIcon from '@/components/Icon/Upload';
import { Tabs } from 'flowbite-react';
import useAuthStore from '@/store/auth/store';
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import CloseIcon from '@/components/Icon/Close';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import AccountStep from './component/AccountStep';
import ProfileStep from './component/ProfileStep';
import WalletStep from './component/WalletStep';
import NotificationStep from './component/NotificationStep';


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
        <div className="bg-cover rounded-2xl relative w-full h-[180px]"
          style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>
          <div className="absolute ml-6 block w-[120px] h-[120px] bottom-[-46px]">
            <input
              className={!!file ? 'hidden' : `absolute left-0 right-0 w-full h-full opacity-0 cursor-pointer`}
              type="file"
              ref={inputRef}
              onChange={(e) => handleInputImage(e.target.files)}
            />
            {!!file ? (
              <Image
                className="rounded-2xl w-full h-auto object-cover"
                src={previewImage}
                alt="Avatar"
                width={1}
                height={1}
              />
            ) : (
              <Image
                className="rounded-2xl"
                src={defaultAvatar}
                alt="Avatar"
                style={{ width: '100%', height: '100%' }}
              />
            )}

            {!!file && (
              <Button
                variant="icon"
                className="absolute right-[-10px] top-[-18px]"
                onClick={handleClearImage}>
                <CloseIcon width={14} height={14} />
              </Button>
            )}
          </div>
          <div className="absolute right-2 top-2 bg-button-secondary rounded-xl w-12 h-12">
            <div className="absolute top-[33%] left-[31%]">
              {!fileCover && (
                <UploadIcon width={16} height={16} />
              )}
              {!!fileCover && (
                <Button
                  variant="icon"
                  className=" absolute top-[-16px] left-[-10px] w-12 h-12"
                  onClick={handleClearImageCover}>
                  <CloseIcon width={14} height={14} />
                </Button>
              )}
            </div>
            <input
              className={!!fileCover ? 'hidden' : `bg-button-secondary px-4 h-12 w-12 rounded-xl opacity-0`}
              type="file"
              ref={inputRefCover}
              onChange={(e) => handleInputImageCover(e.target.files)}
            />
          </div>
          {!!fileCover ? (
            <Image
              className="rounded-2xl w-full h-[180px] object-cover"
              src={previewImageCover}
              alt="Cover"
              width={1200}
              height={256}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
          <Tabs.Group aria-label="Tabs with underline" style="underline">
            <Tabs.Item active title="Profile">
              <ProfileStep username={username} bio={bio} webURL={webURL} twitterLink={twitterLink} isDirty={!isDirty} />
            </Tabs.Item>
            <Tabs.Item active title="Account">
              <AccountStep email={email} />
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