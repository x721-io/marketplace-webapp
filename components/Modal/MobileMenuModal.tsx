import {
  CustomFlowbiteTheme,
  Dropdown,
  Modal,
  ModalProps
} from 'flowbite-react'
import { navs } from '@/config/nav'
import Link from 'next/link'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import Accordion from '@/components/Accordion'
import Text from '@/components/Text'

const modalTheme: CustomFlowbiteTheme['modal'] = {
  root: {
    sizes: {
      "7xl": "max-w-7xl !p-0"
    }
  },
  content: {
    inner: 'relative bg-white flex flex-col h-screen'
  },
  body: {
    base: "p-0 flex-1 overflow-auto"
  }
}

export default function MobileMenuModal({ onClose, show }: ModalProps) {
  return (
    <Modal dismissible onClose={onClose} show={show} size="7xl" theme={modalTheme}>
      <Modal.Body>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <Link href="/" onClick={onClose}>
              <Icon name="u2u-logo-mobile" width={28} height={28} />
            </Link>
            <button onClick={onClose}>
              <Icon className="text-secondary" name="search" width={24} height={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Button className="w-12 !min-w-0 !p-2" variant="icon" disabled>
              <Icon name="shoppingBag" width={16} height={16} />
            </Button>
            <Button className="w-12 !min-w-0 !p-2" variant="text" onClick={onClose}>
              <Icon name="close" width={24} height={24} />
            </Button>
          </div>
        </div>

        <div className="flex-1">
          {navs.map(nav => {
            if (nav.items?.length) {
              return (
                <Accordion
                  key={nav.label}
                  header={(
                    <div className="flex items-center">
                      <Text className="text-primary" variant="body-18">{nav.label}</Text>
                    </div>
                  )}>
                  {nav.items.map(item => (
                    <Link href={item.href} key={item.label}>{item.label}</Link>
                  ))}
                </Accordion>
              )
            }
          })}
        </div>
      </Modal.Body>
    </Modal>
  )
}