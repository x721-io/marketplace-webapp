'use client'

import Button from "@/components/Button";
import Input from "@/components/Form/Input";
import Textarea from "@/components/Form/Textarea";
import Text from "@/components/Text";
import ImageUploader from '@/components/Form/ImageUploader'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from '@/components/Form/Select'
import { classNames } from '@/utils/string'
import Icon from '@/components/Icon'

export default function CreateNftPage() {
  const [useU2U, setUseU2U] = useState(true)
  const { handleSubmit, register } = useForm({
    defaultValues: {
      // image: '',
      name: '',
      description: ''
    }
  })

  const [image, setImage] = useState<Blob | undefined>()
  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="w-full flex justify-center py-10 tablet:py-20 desktop:py-20">

      <div className="flex flex-col tablet:w-[550px] w-full">
        <Text className="text-body-32 tablet:text-body-40 desktop:text-body font-semibold mb-6 tablet:mb-10 desktop:mb-10">
          Create New Item
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-10">
            {/* Upload file */}
            <div>
              <Text className="text-base font-semibold mb-1">Upload file</Text>
              <ImageUploader
                image={image}
                onInput={setImage}
              />
            </div>
            {/* Name */}
            <div>
              <Text className="text-base font-semibold mb-1">Display name</Text>
              <Input
                {...register('name')}
              />
            </div>
            {/* Description */}
            <div>
              <Text className="text-base font-semibold mb-1">Description</Text>
              <Textarea
                className="h-[160px] resize-none"
                {...register('description')}
              />
            </div>

            {/* Choose collection */}
            <div>
              <Text className="text-base font-semibold mb-1">Choose collection</Text>
              <div className="flex items-stretch gap-6">
                <div className="flex-1 flex flex-col justify-center items-center gap-2 cursor-pointer rounded-2xl p-8 border border-secondary">
                  <Icon name="plusCircle" width={32} height={32} />
                  <Text className="text-body-14 font-bold text-primary">Create</Text>
                  <Text className="text-body-12 font-bold text-secondary">ERC-721</Text>
                </div>
                <div
                  onClick={() => setUseU2U(true)}
                  className={classNames(
                    'flex flex-col justify-center items-center gap-2 flex-1 cursor-pointer rounded-2xl p-8',
                    useU2U ? 'border-2 border-primary text-primary' : 'text-tertiary bg-surface-soft'
                  )}>
                  <Icon name="u2u-logo" width={32} height={32} />
                  <Text className="text-body-14 font-bold text-primary">Unicorn Ultra</Text>
                  <Text className="text-body-12 font-bold text-secondary">U2U</Text>
                </div>
              </div>
            </div>

            {/* Button finish */}
            <div className="justify-end flex">
              <Button type="submit" className="w-full tablet:w-auto desktop:w-auto">Finish</Button>
            </div>

            {/* Put on marketplace */}
            {/*<div className="flex flex-col gap-6">*/}
            {/*  <div className="flex justify-between">*/}
            {/*    <div>*/}
            {/*      <Text className="text-lg font-semibold mb-2">Put on marketplace</Text>*/}
            {/*      <Text className="text-secondary">Enter price to allow users instantly purchase your NFT</Text>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*      <label className="relative inline-flex items-center cursor-pointer">*/}
            {/*        <input type="checkbox" value="" className="sr-only peer" />*/}
            {/*        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
            {/*      </label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="flex gap-4 w-full">*/}
            {/*    <Button className="flex-1 flex gap-2.5 justify-center items-center" variant="outlined">*/}
            {/*      <TagIcon width={24} height={24} />Fixed price*/}
            {/*    </Button>*/}
            {/*    <Button className="flex-1 flex gap-2.5 justify-center items-center" variant="outlined" disabled>*/}
            {/*      <LockIcon width={24} height={24} />Timed auction*/}
            {/*    </Button>*/}
            {/*  </div>*/}
            {/*  /!* Price *!/*/}
            {/*  <div>*/}
            {/*    <Text className="text-base font-semibold mb-1">Price</Text>*/}
            {/*    <div className="flex">*/}
            {/*      <button id="dropdown-button"*/}
            {/*              data-dropdown-toggle="dropdown"*/}
            {/*              className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"*/}
            {/*              type="button">U2U*/}
            {/*        <svg className="w-2.5 h-2.5 ms-2.5"*/}
            {/*             aria-hidden="true"*/}
            {/*             xmlns="http://www.w3.org/2000/svg"*/}
            {/*             fill="none"*/}
            {/*             viewBox="0 0 10 6">*/}
            {/*          <path stroke="currentColor"*/}
            {/*                strokeLinecap="round"*/}
            {/*                strokeLinejoin="round"*/}
            {/*                strokeWidth="2"*/}
            {/*                d="m1 1 4 4 4-4" />*/}
            {/*        </svg>*/}
            {/*      </button>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <input type="text"*/}
            {/*               id="search-dropdown"*/}
            {/*               className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"*/}
            {/*               placeholder="99" />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  /!* Minimum bid *!/*/}
            {/*  <div>*/}
            {/*    <Text className="text-base font-semibold mb-1">Minimum bid</Text>*/}
            {/*    <div className="flex">*/}
            {/*      <button id="dropdown-button"*/}
            {/*              data-dropdown-toggle="dropdown"*/}
            {/*              className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"*/}
            {/*              type="button">U2U*/}
            {/*        <svg className="w-2.5 h-2.5 ms-2.5"*/}
            {/*             aria-hidden="true"*/}
            {/*             xmlns="http://www.w3.org/2000/svg"*/}
            {/*             fill="none"*/}
            {/*             viewBox="0 0 10 6">*/}
            {/*          <path stroke="currentColor"*/}
            {/*                strokeLinecap="round"*/}
            {/*                strokeLinejoin="round"*/}
            {/*                strokeWidth="2"*/}
            {/*                d="m1 1 4 4 4-4" />*/}
            {/*        </svg>*/}
            {/*      </button>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <input type="text"*/}
            {/*               id="search-dropdown"*/}
            {/*               className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"*/}
            {/*               placeholder="99" />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  /!* Starting Date *!/*/}
            {/*  <div>*/}
            {/*    <Text className="text-base font-semibold mb-1">Starting Date</Text>*/}
            {/*    <Select options={[]} />*/}
            {/*  </div>*/}
            {/*  /!* End date *!/*/}
            {/*  <div>*/}
            {/*    <Text className="text-base font-semibold mb-1">End date</Text>*/}
            {/*    <div className="flex">*/}
            {/*      <button id="dropdown-button"*/}
            {/*              data-dropdown-toggle="dropdown"*/}
            {/*              className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"*/}
            {/*              type="button">7 days*/}
            {/*        <svg className="w-2.5 h-2.5 ms-2.5"*/}
            {/*             aria-hidden="true"*/}
            {/*             xmlns="http://www.w3.org/2000/svg"*/}
            {/*             fill="none"*/}
            {/*             viewBox="0 0 10 6">*/}
            {/*          <path stroke="currentColor"*/}
            {/*                strokeLinecap="round"*/}
            {/*                strokeLinejoin="round"*/}
            {/*                strokeWidth="2"*/}
            {/*                d="m1 1 4 4 4-4" />*/}
            {/*        </svg>*/}
            {/*      </button>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <input type="text"*/}
            {/*               id="search-dropdown"*/}
            {/*               className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"*/}
            {/*               placeholder="99" />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/* Unlockable content */}
            {/*<div className="flex justify-between">*/}
            {/*  <div>*/}
            {/*    <Text className="text-lg font-semibold mb-2">Unlockable content</Text>*/}
            {/*    <Text className="text-secondary">Include Content that can only be revealed by the owner</Text>*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <label className="relative inline-flex items-center cursor-pointer">*/}
            {/*      <input type="checkbox" value="" className="sr-only peer" />*/}
            {/*      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
            {/*    </label>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*/!* Blockchain *!/*/}
            {/*<div>*/}
            {/*  <Text className="text-base font-semibold mb-1">Blockchain</Text>*/}
            {/*  <Select options={[]} />*/}
            {/*</div>*/}

          </div>
        </form>
      </div>
    </div>
  )
}