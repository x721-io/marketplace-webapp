import Button from "@/components/Button";
import Input from "@/components/Form/Input";
import Textarea from "@/components/Form/Textarea";
import Text from "@/components/Text";
import defaultUploadFile from '@/assets/images/default-uploadFile.png'
import Image from 'next/image'
import WrapIcon from "@/components/Icon/Wrap";
import VerifyIcon from "@/components/Icon/Verify";
import Select from "@/components/Form/Select";
import TagIcon from "@/components/Icon/Tag";
import LockIcon from "@/components/Icon/Lock";

export default function CreateNftPage () { 
    return( 
        <div className="w-full flex justify-center">
            <div className="flex gap-8 py-20 px-10" style={{width: '1140px'}}>
                <div className="flex flex-col gap-10 w-4/6">
                    <Text className="text-body-40 font-semibold mb-2.5">Create New Item</Text>
                    <div>
                        <Text className="text-base font-semibold mb-1">Upload file</Text>
                        <div className="relative">
                            <Image
                                className="cursor-pointer rounded-xl p-2 w-full"
                                src={defaultUploadFile}
                                alt="Avatar"
                                height={552}/>
                            <div className="absolute right-0" style={{top:"-18px"}}>
                                <button className="p-3.5 bg-surface-soft h-12 w-12 rounded-xl">
                                    <WrapIcon/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Text className="text-base font-semibold mb-1">Display name</Text>
                        <Input/>
                    </div>
                    <div>
                        <Text className="text-base font-semibold mb-1">Description</Text>
                        <Textarea className='h-[160px] resize-none'/>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between">
                            <div>
                                <Text className="text-lg font-semibold mb-2">Put on marketplace</Text>
                                <Text className="text-secondary">Enter price to allow users instantly purchase your NFT</Text>
                            </div>
                            <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button className="flex-1 flex gap-2.5 justify-center items-center" variant="outlined">
                                <TagIcon width={24} height={24}/>Fixed price
                            </Button>
                            <Button className="flex-1 flex gap-2.5 justify-center items-center" variant="outlined" disabled>
                                <LockIcon width={24} height={24}/>Timed auction
                            </Button>
                        </div>
                        <div>
                            <Text className="text-base font-semibold mb-1">Price</Text>
                            <Input/>
                        </div>
                        <div>
                            
                        <div className="flex">
                            <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                            <button id="dropdown-button" 
                                    data-dropdown-toggle="dropdown" 
                                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" 
                                    type="button">U2U 
                                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                            </button>
                            
                            <div className="relative w-full">
                                <input type="search" id="search-dropdown" className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-primary w-full border-none text-body-16 rounded-tr-2xl rounded-br-2xl" placeholder="99"/>
                            </div>
                        </div>


                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <Text className="text-lg font-semibold mb-2">Unlockable content</Text>
                            <Text className="text-secondary">Include Content that can only be revealed by the owner</Text>
                        </div>
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <Text className="text-base font-semibold mb-1">Blockchain</Text>
                        <Select options={[]}/>
                    </div>
                    <div>
                        <Text className="text-base font-semibold mb-1">Choose collection</Text>
                        <Select options={[]}/>
                    </div>
                    <div className="justify-end flex">
                        <Button>Finish</Button>
                    </div>
                </div>
                <div className="w-2/6">
                    <Text className="text-base font-semibold mb-4">Preview</Text>
                    <div className="flex flex-col rounded-2xl" style={{border: '1px solid #E3E3E3'}}>
                        <Image
                            className="cursor-pointer rounded-xl p-2 w-full"
                            src={defaultUploadFile}
                            alt="Avatar"
                            height={220} />
                        <div className="flex flex-col gap-2 pt-2 pb-3 px-3">
                            <div className="flex gap-1">
                                <VerifyIcon width={16} height={16}/>
                                <Text className="text-secondary text-xs">Winter Madagascar</Text>
                            </div>
                            <Text className="font-medium">Clown Ape</Text>
                            <Text className="text-xs">0.002 U2U</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) 
}