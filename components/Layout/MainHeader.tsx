import brandingSvg from '@/assets/branding.svg'
import Link from 'next/link'
import Image from 'next/image'
import Input from '@/components/Form/Input'
import { useState } from 'react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { Dropdown } from 'flowbite-react'

export const HEADER_HEIGHT = 88
export default function MainHeader() {
  const [searchString, setSearchString] = useState('')
  const navs = [
    { href: '/explore', label: 'Explore' },
    {
      label: 'Create',
      items: [
        { href: '/create/collection', label: 'Collection' },
        { href: '/create/nft', label: 'NFT' }
      ]
    },
    { label: 'Sell', items: [] }
  ]

  return (
    <nav className={`h-[${HEADER_HEIGHT}px] bg-white border-gray-200 dark:bg-gray-900 px-7`}>
      <div className="flex flex-wrap items-center justify-between mx-auto py-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image height={28} src={brandingSvg} alt="u2u-brand" />
          </Link>

          <Input
            containerClass="hidden tablet:block desktop:w-[420px] tablet:w-[280px]"
            value={searchString}
            placeholder="Type for collections, NFTs etc"
            onChange={event => setSearchString(event.target.value)}
          />

          <div className="hidden w-full tablet:block tablet:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navs.map((nav, index) => nav.items ?
                (
                  <Dropdown
                    label=""
                    key={index}
                    renderTrigger={() => (
                      <span className="block py-2 px-3 font-semibold text-secondary cursor-pointer">
                        {nav.label}
                      </span>)}>
                    {nav.items.map((item, i) => (
                      <Dropdown.Item key={i}>
                        <Link href={item.href}>{item.label}</Link>
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                ) : (
                  <li key={index}>
                    <Link
                      href={nav.href ?? ''}
                      className="block py-2 px-3 font-semibold text-secondary"
                      aria-current="page"
                    >
                      {nav.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="hidden tablet:flex gap-4 items-center">
          <ConnectWalletButton mode="link">
            <Image
              className="cursor-pointer"
              src={defaultAvatar}
              alt="Avatar"
              width={48}
              height={48} />
          </ConnectWalletButton>
          {/*<Button variant="icon"></Button>*/}
        </div>

        <div className="block tablet:hidden text-secondary">
          <Icon color="secondary" name="burger" width={20} height={20} />
        </div>
      </div>
    </nav>
  )
}