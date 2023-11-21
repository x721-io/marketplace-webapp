"use client"
import PlusIcon from "@/components/Icon/Plus";
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import defaultCover from '@/assets/images/default-cover-user.png'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import Image from "next/image";
import Button from "@/components/Button";
import SilderIcon from "@/components/Icon/Sliders";
import Input from "@/components/Form/Input";
import CommandIcon from "@/components/Icon/Command";
import ChevronDownIcon from "@/components/Icon/ChevronDown";
import { Tabs } from "flowbite-react";

export default function ExploreUsersPage() {
    return (
        <div className="flex flex-col px-4 tablet:px-10 desktop:px-20">
            <div className="flex flex-col gap-4 desktop:gap-8 py-4 tablet:py-8 desktop:py-10 ">
                <div>
                    <Text className="text-body-18 tablet:text-body-24 desktop:text-body-32 font-semibold tablet:mb-1.5 desktop:mb-2">Explore Users</Text>
                    <Text className="text-secondary">Explore Users</Text>
                </div>
                {/* Fillter */}
                <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap">
                    <div className="order-3 desktop:order-1">
                        <Button className="py-4 h-14" variant="secondary">Filters <span className="p-1 bg-surface-medium rounded-lg"><SilderIcon width={14} height={14}/></span></Button>
                    </div>
                    <div className="order-1 w-full desktop:order-2 desktop:flex-none desktop:w-auto">
                        <Tabs.Group style="default">
                            <Tabs.Item active title="NFTs"></Tabs.Item>
                            <Tabs.Item active title="Collection"></Tabs.Item>
                            <Tabs.Item active title="Users"></Tabs.Item>
                        </Tabs.Group>
                    </div>
                    <div className="relative flex-1 order-2 desktop:order-3">
                        <Input className="py-4 h-14" appendIcon={<CommandIcon color="gray-500" width={14} height={14}/>} appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"/>
                    </div>
                    <div className="order-4">
                        <Button className="py-4 h-14" variant="secondary">Trending <span className="p-1 bg-surface-medium rounded-lg"><ChevronDownIcon color="gray-500" width={14} height={14}/></span></Button>
                    </div>
                </div>
            </div>
            <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
                <div className="flex flex-col rounded-xl" style={{border: '0.7px solid #E3E3E3'}}>
                    <div className="relative">
                        <Image
                            className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                            src={defaultCover}
                            alt="Cover"
                            style={{width: '100%', height: '100px'}}
                            />
                        <div className="absolute rounded-full" style={{width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff'}}>
                            <Image
                                className="cursor-pointer rounded-full object-fill"
                                src={defaultAvatar}
                                alt="Avatar"
                                style={{width: '100%', height: '100%'}}
                                />
                        </div>
                    </div>
                    <div className="pt-6 px-3 pb-4 flex justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <Text className="font-medium">Winter Madagascar</Text>
                                <VerifyIcon width={16} height={16}/>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="p-2 rounded-lg">
                                <PlusIcon width={36} height={36} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col rounded-xl" style={{border: '0.7px solid #E3E3E3'}}>
                    <div className="relative">
                        <Image
                            className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                            src={defaultCover}
                            alt="Cover"
                            style={{width: '100%', height: '100px'}}
                            />
                        <div className="absolute rounded-full" style={{width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff'}}>
                            <Image
                                className="cursor-pointer rounded-full object-fill"
                                src={defaultAvatar}
                                alt="Avatar"
                                style={{width: '100%', height: '100%'}}
                                />
                        </div>
                    </div>
                    <div className="pt-6 px-3 pb-4 flex justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <Text className="font-medium">Winter Madagascar</Text>
                                <VerifyIcon width={16} height={16}/>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="p-2 rounded-lg">
                                <PlusIcon width={36} height={36} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col rounded-xl" style={{border: '0.7px solid #E3E3E3'}}>
                    <div className="relative">
                        <Image
                            className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                            src={defaultCover}
                            alt="Cover"
                            style={{width: '100%', height: '100px'}}
                            />
                        <div className="absolute rounded-full" style={{width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff'}}>
                            <Image
                                className="cursor-pointer rounded-full object-fill"
                                src={defaultAvatar}
                                alt="Avatar"
                                style={{width: '100%', height: '100%'}}
                                />
                        </div>
                    </div>
                    <div className="pt-6 px-3 pb-4 flex justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <Text className="font-medium">Winter Madagascar</Text>
                                <VerifyIcon width={16} height={16}/>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                                <div className="flex gap-2">
                                    <Text className="text-body-12 font-medium">2k</Text>
                                    <Text className="text-body-12 text-secondary">Followers</Text>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="p-2 rounded-lg">
                                <PlusIcon width={36} height={36} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}