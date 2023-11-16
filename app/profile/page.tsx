
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import MoreHorizontalIcon from '@/components/Icon/MoreHorizontal';
import Text from '@/components/Text';
import React from 'react';
import Image from 'next/image'
import u2uWalletSvg from '@/assets/u2uWallet.svg'
import cryptoSvg from '@/assets/crypto.svg'
import UploadIcon from '@/components/Icon/Upload';


export default function ProfilePage () { 

    return(
        <div className="w-full relative flex flex-col items-center py-10 tablet:p-10 mobile:py-16 mobile:px-4">
            <div className="bg-cover rounded-2xl relative w-full h-[180px]" 
                style={{background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))'}}>
                <div className="rounded-2xl absolute ml-6 block w-[120px] h-[120px]"
                    style={{bottom: "-46px", background: 'var(--gradient-002, linear-gradient(86deg, #5D96FF 4.33%, #D466FF 99.12%))'}}></div>
                <div className='absolute right-2 top-2'>
                    <button className='bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl '>
                        <UploadIcon />
                    </button>
                </div>

            </div>
            <div className='w-full block mt-[78px] mobile:mt-[86px]'>

                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px">
                        <li className="me-2">
                            <a href="#" className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500">Profile</a>
                        </li>
                        <li className="me-2">
                            <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" aria-current="page">Account</a>
                        </li>
                        <li className="me-2">
                            <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Wallet</a>
                        </li>
                        <li className="me-2">
                            <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Notification</a>
                        </li>
                    </ul>
                </div>

                {/* Step Profile */}
                <div>
                    <div className='flex gap-8 mb-8'>
                        <div className='mt-8 flex gap-8 w-full flex-col mobile:mt-10'>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Display name</label>
                                <Input />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <Input prependIcon='@' placeholder='Thuan Nguyen' /> 
                                <Text  className='text-tertiary mt-1' variant="body-12">Your profile will be available on rarible.com/[username]</Text>                           
                            </div>
                            <div> 
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                                <Textarea className='h-[160px] resize-none'/>
                            </div>
                            <div>
                                <Text className='font-bold text-body-32 mobile:text-body-24'>Social links</Text>
                                <Text className='text-tertiary' variant="body-16">Add your existing social links to build a stronger reputation</Text>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
                                <Input placeholder='https:///' />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">X (Twitter)</label>
                                <Input prependIcon='' placeholder='Link Twitter' ></Input>
                            </div>
                            {/* <div>
                                <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">X (Twitter)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <Icon name='circle'/>
                                    </div>
                                    <input type="search" id="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Link Twitter"/>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className='mobile:w-full'>
                        <Button>Save settings</Button>
                    </div>
                </div>
                
                {/* Step Account */}
                <div>
                    <div className='flex gap-8 mb-8 flex-col'>
                        <div className='mt-8 flex gap-8 w-full flex-col mobile:mt-10'>
                            <div className='flex gap-1 flex-col'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <Text className='text-tertiary' variant="body-12">Your email for marketplace notifications</Text>  
                                <Input placeholder='Email' />
                                <Text className='text-tertiary' variant="body-12">Please check email and verify your email address.</Text>  
                                <Text className='text-tertiary flex items-center' variant="body-12">Still no email? <Text className='text-primary ml-1' variant="body-12">Resend</Text></Text>
                            </div>
                        </div>
                        <div>
                            <Button>Delete my account</Button>
                        </div>
                    </div>
                </div>

                {/* Step Wallet */}
                <div>
                    <div className='flex gap-8 mb-8 flex-col'>
                        <Text className='font-bold text-body-32 mobile:text-body-24'>Manage Wallet</Text>
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
                                    <MoreHorizontalIcon/>
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
                                    <MoreHorizontalIcon/>
                                </button>
                            </div>
                        </div>
                        <div>
                            <Button>Link wallet</Button>
                        </div>
                    </div>
                </div>

                {/* Notification */}
                <div>
                    <div className='flex gap-8 my-8 flex-col'>
                        <Text className='font-bold text-body-32 mobile:text-body-24'>Notification</Text>
                        <div className='flex flex-col gap-3'>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Item sold</Text>
                                    <Text className='text-secondary text-body-12'>When someone purchased one of your items</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" checked/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Bid activity</Text>
                                    <Text className='text-secondary text-body-12'>When someone bids on one of your items</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" checked/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Price change</Text>
                                    <Text className='text-secondary text-body-12'>When an item you made an offer on changes in price</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" checked/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Auction expiration</Text>
                                    <Text className='text-secondary text-body-12'>When a timed auction you created ends</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" checked/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Outbid</Text>
                                    <Text className='text-secondary text-body-12'>When an offer you placed is exceeded by another user</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='bg-surface-soft p-3 rounded-xl flex justify-between items-center'>
                                <div className='flex gap-1.5 flex-col'>
                                    <Text className='font-medium'>Successful purchase</Text>
                                    <Text className='text-secondary text-body-12'>When you successfully buy an item</Text>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" checked/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}