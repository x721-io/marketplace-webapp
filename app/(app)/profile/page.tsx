"use client"
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import MoreHorizontalIcon from '@/components/Icon/MoreHorizontal';
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
import ImageUploader from '@/components/Form/ImageUploader';
import CloseIcon from '@/components/Icon/Close';
import { url } from 'inspector';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';

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
  const api = useMarketplaceApi()
  const { handleSubmit, register, formState: { errors, isDirty } } = useForm<FormState>()

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
    const toastId = toast.loading('Uploading Profile...', { type: 'info' })
    if (!imageAvt || !imageCover) return
    try {
      const { fileHashes } = await api.uploadFile([imageAvt, imageCover])
      await onUpdateProfile({
        username,
        bio,
        webURL,
        twitterLink,
        avatar: fileHashes[0],
        coverImage: fileHashes[1],
        shortLink: username
      })
      toast.update(toastId, { render: 'Profile updated successfully', type: 'success', isLoading: false })
    } catch (e) {
      console.error('Error:', e)
      toast.update(toastId, { render: `Profile updating: ${e}`, type: 'error', isLoading: false })
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
              width={1}
              height={1}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
          <Tabs.Group aria-label="Tabs with underline" style="underline">
            <Tabs.Item active title="Profile">
              <div>
                <div className="flex gap-8 mb-8">
                  <div className="desktop:mt-5 tablet:mt-5 mt-7 flex gap-8 w-full flex-col">
                    <div>
                      <label className="block mb-2 font-semibold text-primary">Display name</label>
                      <Input
                        type="text"
                        register={register('username', { required: true, value: username })}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-base font-semibold text-primary">Username</label>
                      <Input
                        prependIcon="@"
                        placeholder="Thuan Nguyen"
                        register={register('username', { required: true, value: username })}
                      />
                      <Text className="text-tertiary mt-1" variant="body-12">Your profile will be available on
                        rarible.com/[username]</Text>
                    </div>
                    <div>
                      <label className="block mb-2 text-base font-semibold text-primary">Bio</label>
                      <Textarea
                        className="h-[160px] resize-none"
                        register={register('bio', { value: bio })}
                      />
                    </div>
                    <div>
                      <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold ">Social
                        links</Text>
                      <Text className="text-tertiary" variant="body-16">Add your existing social links to build a
                        stronger reputation</Text>
                    </div>
                    <div>
                      <label className="block mb-2 text-base font-semibold text-primary">Website URL</label>
                      <Input
                        placeholder="https://"
                        register={register('webURL', { value: webURL })}
                        className="console.error"
                      />
                      {/* {errors.webURL && <p role="alert">Invalid</p>} */}
                    </div>
                    <div>
                      <label className="block mb-2 text-base font-semibold text-primary">X (Twitter)</label>
                      <Input
                        prependIcon={<Icon name="circle" />}
                        placeholder="Link Twitter"
                        register={register('twitterLink', { value: twitterLink })}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full tablet:w-auto desktop:w-auto">
                  <Button
                    type="submit"
                    disabled={!isDirty}
                    className="w-full tablet:w-auto desktop:w-auto">
                    Save settings
                  </Button>
                </div>
              </div>
            </Tabs.Item>
            <Tabs.Item active title="Account">
              <div className="flex gap-8 mb-8 flex-col">
                <div className="desktop:mt-5 mt-7 flex gap-8 w-full flex-col">
                  <div className="flex gap-1 flex-col">
                    <label className="block text-base font-semibold text-primary">Email</label>
                    <Text className="text-tertiary" variant="body-12">Your email for marketplace notifications</Text>
                    <Input
                      placeholder="Email"
                      register={register('email', { required: true, value: email })}
                    />

                    <Text className="text-tertiary" variant="body-12">Please check email and verify your email
                      address.</Text>
                    <Text className="text-tertiary flex items-center" variant="body-12">Still no
                      email? <Text className="text-primary ml-1" variant="body-12">Resend</Text></Text>
                  </div>
                </div>
                <div className="flex gap-1 flex-col">
                  <Text className="text-body-16 font-semibold">Danger zone</Text>
                  <Text className="text-tertiary text-body-12">Once you delete your account, there is no going back.
                    Please be certain.</Text>
                </div>
                <div className="w-full tablet:w-auto desktop:w-auto">
                  <Button className="w-full tablet:w-auto desktop:w-auto" disabled>Delete my account</Button>
                </div>
              </div>
            </Tabs.Item>
            <Tabs.Item active title="Wallet">
              <div className="flex gap-8 mb-8 flex-col">
                <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold desktop:mt-5 mt-7">Manage
                  Wallet</Text>
                <div className="flex gap-3 w-full flex-col">
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex">
                      <Image width={40} height={40} src={u2uWalletSvg} alt="u2u-brand" className="rounded-full mr-3" />
                      <div className="flex flex-col gap-1">
                        <Text className="text-body-16 text-primary">Wallet3290</Text>
                        <div className="bg-white rounded-lg text-center">
                          <Text className="text-body-12 text-secondary">U2U Chain</Text>
                        </div>
                      </div>
                    </div>
                    {/* <button className='w-12 h-12 bg-white rounded-xl p-3'>
                     <MoreHorizontalIcon />
                     </button> */}
                  </div>
                </div>
                <div className="flex gap-3 w-full flex-col">
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex">
                      <Image width={40} height={40} src={cryptoSvg} alt="u2u-brand" className="rounded-full mr-3" />
                      <div className="flex flex-col gap-1">
                        <Text className="text-body-16 text-primary">Wallet3290</Text>
                        <div className="bg-white rounded-lg text-center">
                          <Text className="text-body-12 text-secondary">Ethereum</Text>
                        </div>
                      </div>
                    </div>
                    {/* <button className='w-12 h-12 bg-white rounded-xl p-3'>
                     <MoreHorizontalIcon />
                     </button> */}
                  </div>
                </div>
                {/* <div className='w-full tablet:w-auto desktop:w-auto'>
                 <Button className="w-full tablet:w-auto desktop:w-auto">Link wallet</Button>
                 </div> */}
              </div>
            </Tabs.Item>
            <Tabs.Item active title="Notification">
              <div className="flex gap-8 mb-8 flex-col">
                <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold desktop:mt-5 mt-7">Notification</Text>
                <div className="flex flex-col gap-3">
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Item sold</Text>
                      <Text className="text-secondary text-body-12">When someone purchased one of your items</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Bid activity</Text>
                      <Text className="text-secondary text-body-12">When someone bids on one of your items</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Price change</Text>
                      <Text className="text-secondary text-body-12">When an item you made an offer on changes in
                        price</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Auction expiration</Text>
                      <Text className="text-secondary text-body-12">When a timed auction you created ends</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Outbid</Text>
                      <Text className="text-secondary text-body-12">When an offer you placed is exceeded by another
                        user</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-al peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
                    <div className="flex gap-1.5 flex-col">
                      <Text className="font-medium">Successful purchase</Text>
                      <Text className="text-secondary text-body-12">When you successfully buy an item</Text>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </form>

  )
}