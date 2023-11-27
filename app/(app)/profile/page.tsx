"use client"
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import MoreHorizontalIcon from '@/components/Icon/MoreHorizontal';
import Text from '@/components/Text';
import React, { useState } from 'react';
import Image from 'next/image'
import u2uWalletSvg from '@/assets/u2uWallet.svg'
import cryptoSvg from '@/assets/crypto.svg'
import UploadIcon from '@/components/Icon/Upload';
import { Tabs } from 'flowbite-react';
import useAuthStore from '@/store/auth/store';
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import { useForm, useFormContext } from 'react-hook-form';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
    const { onUpdateProfile } = useAuth()
    const { handleSubmit, register, setValue } = useForm()
    const username = useAuthStore(state => state.profile?.username?.toString()) || '';
    // const bio = useAuthStore(state => state.profile?.)
    // const linkurl = useAuthStore(state => state.profile?.)
    // const linktwitter = useAuthStore(state => state.profile?.)

    const onSubmitProfile = async (data: any) => {
        console.log('1', data)
        try {
            await onUpdateProfile({ username })
        } catch (e) {
            console.error('Error:', e)
        }
    }


    return (
        <div className="w-full relative flex flex-col items-center desktop:py-10 tablet:p-10 py-16 px-4">
            <div className="bg-cover rounded-2xl relative w-full h-[180px]"
                style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>
                <div className="absolute ml-6 block w-[120px] h-[120px] bottom-[-46px]">
                    <Image
                        className="rounded-2xl"
                        src={defaultAvatar}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                <div className='absolute right-2 top-2'>
                    <button className='bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl '>
                        <UploadIcon />
                    </button>
                </div>
            </div>
            <div className='w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0'>
                <Tabs.Group aria-label="Tabs with underline" style="underline">
                    <Tabs.Item active title="Profile">
                        <form onSubmit={handleSubmit(onSubmitProfile)}>
                            <div>
                                <div className='flex gap-8 mb-8'>
                                    <div className='desktop:mt-5 tablet:mt-5 mt-7 flex gap-8 w-full flex-col'>
                                        <div>
                                            <label className="block mb-2 font-semibold text-primary">Display name</label>
                                            <Input
                                                type='text'
                                                register={register('username', { required: true, value: username })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-base font-semibold text-primary">Username</label>
                                            <Input
                                                prependIcon='@'
                                                placeholder='Thuan Nguyen'
                                                register={register('username', { required: true, value: username })}
                                            />
                                            <Text className='text-tertiary mt-1' variant="body-12">Your profile will be available on rarible.com/[username]</Text>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-base font-semibold text-primary">Bio</label>
                                            <Textarea
                                                className='h-[160px] resize-none'
                                                register={register('bio', { required: true })}
                                            />
                                        </div>
                                        <div>
                                            <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold ">Social links</Text>
                                            <Text className='text-tertiary' variant="body-16">Add your existing social links to build a stronger reputation</Text>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-base font-semibold text-primary">Website URL</label>
                                            <Input
                                                placeholder='https:///'
                                                register={register('linkweb', { required: true })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-base font-semibold text-primary">X (Twitter)</label>
                                            <Input
                                                prependIcon={<Icon name='circle' />}
                                                placeholder='Link Twitter'
                                                register={register('linktwitter', { required: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full tablet:w-auto desktop:w-auto'>
                                    {/* <ConnectWalletButton> */}
                                    <Button
                                        type="submit"
                                        className="w-full tablet:w-auto desktop:w-auto">
                                        Save settings
                                    </Button>
                                    {/* </ConnectWalletButton> */}
                                </div>
                            </div>
                        </form>
                    </Tabs.Item>
                    <Tabs.Item active title="Account">
                        <div className='flex gap-8 mb-8 flex-col'>
                            <div className='desktop:mt-5 mt-7 flex gap-8 w-full flex-col'>
                                <div className='flex gap-1 flex-col'>
                                    <label className="block text-base font-semibold text-primary">Email</label>
                                    <Text className='text-tertiary' variant="body-12">Your email for marketplace notifications</Text>
                                    <Input placeholder='Email' />
                                    <Text className='text-tertiary' variant="body-12">Please check email and verify your email address.</Text>
                                    <Text className='text-tertiary flex items-center' variant="body-12">Still no email? <Text className='text-primary ml-1' variant="body-12">Resend</Text></Text>
                                </div>
                            </div>
                            <div className='flex gap-1 flex-col'>
                                <Text className='text-body-16 font-semibold'>Danger zone</Text>
                                <Text className='text-tertiary text-body-12'>Once you delete your account, there is no going back. Please be certain.</Text>
                            </div>
                            <div className='w-full tablet:w-auto desktop:w-auto'>
                                <Button className="w-full tablet:w-auto desktop:w-auto">Delete my account</Button>
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item active title="Wallet">
                        <div className='flex gap-8 mb-8 flex-col'>
                            <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold desktop:mt-5 mt-7">Manage Wallet</Text>
                            <div className='flex gap-3 w-full flex-col'>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex'>
                                        <Image width={40} height={40} src={u2uWalletSvg} alt="u2u-brand" className='rounded-full mr-3' />
                                        <div className='flex flex-col gap-1'>
                                            <Text className='text-body-16 text-primary'>Wallet3290</Text>
                                            <div className='bg-white rounded-lg text-center'>
                                                <Text className='text-body-12 text-secondary'>U2U Chain</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='w-12 h-12 bg-white rounded-xl p-3'>
                                        <MoreHorizontalIcon />
                                    </button>
                                </div>
                            </div>
                            <div className='flex gap-3 w-full flex-col'>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex'>
                                        <Image width={40} height={40} src={cryptoSvg} alt="u2u-brand" className='rounded-full mr-3' />
                                        <div className='flex flex-col gap-1'>
                                            <Text className='text-body-16 text-primary'>Wallet3290</Text>
                                            <div className='bg-white rounded-lg text-center'>
                                                <Text className='text-body-12 text-secondary'>Ethereum</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='w-12 h-12 bg-white rounded-xl p-3'>
                                        <MoreHorizontalIcon />
                                    </button>
                                </div>
                            </div>
                            <div className='w-full tablet:w-auto desktop:w-auto'>
                                <Button className="w-full tablet:w-auto desktop:w-auto">Link wallet</Button>
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item active title="Notification">
                        <div className='flex gap-8 mb-8 flex-col'>
                            <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold desktop:mt-5 mt-7">Notification</Text>
                            <div className='flex flex-col gap-3'>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Item sold</Text>
                                        <Text className='text-secondary text-body-12'>When someone purchased one of your items</Text>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" disabled />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Bid activity</Text>
                                        <Text className='text-secondary text-body-12'>When someone bids on one of your items</Text>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" disabled />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Price change</Text>
                                        <Text className='text-secondary text-body-12'>When an item you made an offer on changes in price</Text>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" disabled />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Auction expiration</Text>
                                        <Text className='text-secondary text-body-12'>When a timed auction you created ends</Text>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" disabled />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Outbid</Text>
                                        <Text className='text-secondary text-body-12'>When an offer you placed is exceeded by another user</Text>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" disabled />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-al peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                    <div className='flex gap-1.5 flex-col'>
                                        <Text className='font-medium'>Successful purchase</Text>
                                        <Text className='text-secondary text-body-12'>When you successfully buy an item</Text>
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
    )
}