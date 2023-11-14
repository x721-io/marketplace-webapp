import brandingSvg from '@/assets/branding.svg'
import Link from 'next/link'
import Image from 'next/image'
import Input from '@/components/Form/Input'
import { useState } from 'react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

export default function MainHeader() {
  const [searchString, setSearchString] = useState('')
  const navs = [
    { href: '/explore', label: 'Explore' },
    { href: '/', label: 'Create' },
    { href: '/', label: 'Sell' }
  ]

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 px-7">
      <div className="flex flex-wrap items-center justify-between mx-auto py-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image height={28} src={brandingSvg} alt="u2u-brand" />
          </Link>

          <Input
            containerClass="hidden desktop:block !w-[420px]"
            value={searchString}
            placeholder="Type for collections, NFTs etc"
            onChange={event => setSearchString(event.target.value)}
          />

          <div className="hidden w-full desktop:block desktop:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navs.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="block py-2 px-3 font-semibold text-secondary rounded md:p-0 dark:text-white md:dark:text-blue-500"
                    aria-current="page"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden desktop:flex gap-4 items-center">
          <Button>Connect wallet</Button>
          {/*<Button variant="icon"></Button>*/}
        </div>

        <Button variant="text" className="block desktop:hidden text-secondary">
          <Icon name="burger" />
        </Button>
      </div>
    </nav>
  )
}