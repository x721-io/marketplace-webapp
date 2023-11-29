interface NavItem {
  label: string
  href?: string
  items?: NavItem[]
}

export const navs: NavItem[] = [
  {
    label: 'Explore',
    items: [
      { href: '/explore/collections', label: 'Collections' },
      { href: '/explore/items', label: 'NFTs' },
      { href: '/explore/users', label: 'Users' }
    ]
  },
  {
    label: 'Create',
    items: [
      { href: '/create/collection', label: 'Collection' },
      { href: '/create/nft', label: 'NFT' }
    ]
  },
  // { label: 'Sell', href: '#' }
]