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

export default function CreateNftPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-8 py-10 tablet:py-20 desktop:py-20" style={{ width: '1140px' }}>
        <div className="flex flex-col w-full tablet:w-4/6 desktop:w-4/6">
          <Text className="text-body-32 tablet:text-body-40 desktop:text-body font-semibold mb-6 tablet:mb-10 desktop:mb-10">Create
            New Item</Text>
          <div className="flex flex-col gap-10">
            {/* Upload file */}
            <div>
              <Text className="text-base font-semibold mb-1">Upload file</Text>
              <div className="relative">
                <Image
                  className="cursor-pointer rounded-xl p-2 w-full"
                  src={defaultUploadFile}
                  alt="Avatar"
                  height={552} />
                <div className="absolute right-0" style={{ top: "-18px" }}>
                  <button className="p-3.5 bg-surface-soft h-12 w-12 rounded-xl">
                    <WrapIcon />
                  </button>
                </div>
              </div>
            </div>
            {/* Name */}
            <div>
              <Text className="text-base font-semibold mb-1">Display name</Text>
              <Input />
            </div>
            {/* Description */}
            <div>
              <Text className="text-base font-semibold mb-1">Description</Text>
              <Textarea className="h-[160px] resize-none" />
            </div>
            {/* Put on marketplace */}
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
                  <TagIcon width={24} height={24} />Fixed price
                </Button>
                <Button className="flex-1 flex gap-2.5 justify-center items-center" variant="outlined" disabled>
                  <LockIcon width={24} height={24} />Timed auction
                </Button>
              </div>
              {/* Price */}
              <div>
                <Text className="text-base font-semibold mb-1">Price</Text>
                <div className="flex">
                  <button id="dropdown-button"
                          data-dropdown-toggle="dropdown"
                          className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"
                          type="button">U2U
                    <svg className="w-2.5 h-2.5 ms-2.5"
                         aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 10 6">
                      <path stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <div className="relative w-full">
                    <input type="text"
                           id="search-dropdown"
                           className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"
                           placeholder="99" />
                  </div>
                </div>
              </div>
              {/* Minimum bid */}
              <div>
                <Text className="text-base font-semibold mb-1">Minimum bid</Text>
                <div className="flex">
                  <button id="dropdown-button"
                          data-dropdown-toggle="dropdown"
                          className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"
                          type="button">U2U
                    <svg className="w-2.5 h-2.5 ms-2.5"
                         aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 10 6">
                      <path stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <div className="relative w-full">
                    <input type="text"
                           id="search-dropdown"
                           className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"
                           placeholder="99" />
                  </div>
                </div>
              </div>
              {/* Starting Date */}
              <div>
                <Text className="text-base font-semibold mb-1">Starting Date</Text>
                <Select options={[]} />
              </div>
              {/* End date */}
              <div>
                <Text className="text-base font-semibold mb-1">End date</Text>
                <div className="flex">
                  <button id="dropdown-button"
                          data-dropdown-toggle="dropdown"
                          className=" focus:border-surfacehard focus:border rounded-tl-2xl rounded-bl-2xl flex-shrink-0 inline-flex items-center p-3 h-12 text-sm font-medium text-center bg-gray-100 text-primary focus-visible:ring-[0.5px] focus:ring-primary"
                          type="button">7 days
                    <svg className="w-2.5 h-2.5 ms-2.5"
                         aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 10 6">
                      <path stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <div className="relative w-full">
                    <input type="text"
                           id="search-dropdown"
                           className="bg-surface-soft outline-none placeholder:text-tertiary text-primary focus-visible:ring-[0.5px] focus:ring-primary w-full border-none text-body-14 rounded-tr-2xl rounded-br-2xl p-3 h-12"
                           placeholder="99" />
                  </div>
                </div>
              </div>
            </div>
            {/* Unlockable content */}
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
            {/* Blockchain */}
            <div>
              <Text className="text-base font-semibold mb-1">Blockchain</Text>
              <Select options={[]} />
            </div>
            {/* Choose collection */}
            <div>
              <Text className="text-base font-semibold mb-1">Choose collection</Text>
              <Select options={[]} />
            </div>
            {/* Button finish */}
            <div className="justify-end flex">
              <Button className="w-full tablet:w-auto desktop:w-auto">Finish</Button>
            </div>
          </div>
        </div>
        <div className="w-2/6 hidden tablet:block desktop:block">
          <Text className="text-base font-semibold mb-4">Preview</Text>
          <div className="flex flex-col rounded-2xl" style={{ border: '1px solid #E3E3E3' }}>
            <Image
              className="cursor-pointer rounded-xl p-2 w-full"
              src={defaultUploadFile}
              alt="Avatar"
              height={220} />
            <div className="flex flex-col gap-2 pt-2 pb-3 px-3">
              <div className="flex gap-1">
                <VerifyIcon width={16} height={16} />
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