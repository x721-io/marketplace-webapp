import brandingSvg from "@/assets/branding.svg";
import Button from "@/components/Button";
import ConnectWalletButton from "@/components/Button/ConnectWalletButton";
import Collapsible from "@/components/Collapsible";
import Icon from "@/components/Icon";
import Text from "@/components/Text";
import { navs } from "@/config/nav";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import MenuAccountInformation from "./AccountInformation";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { isMobile } from "react-device-detect";

export default function MenuModal({ onClose, show }: MyModalProps) {
  const { isValidSession } = useAuth();

  return (
    <MyModal.Root
      onClose={onClose}
      show={show}
      position="top-right"
      bodyContainerStyle={{
        width: isMobile ? "100%" : "400px",
      }}
    >
      <MyModal.Body className="flex flex-col gap-4 h-[100vh] pb-[50px] px-[40px] pt-[10px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div className="hidden tablet:block">
              <Link href="/" onClick={onClose} className="w-fit">
                <Image
                  className="h-7 object-contain w-fit"
                  height={100}
                  src={brandingSvg}
                  alt="u2u-brand"
                />
              </Link>
            </div>
            <div className="block tablet:hidden">
              <Link href="/">
                <Icon name="u2u-logo-mobile" width={28} height={28} />
              </Link>
            </div>
            <button className="tablet:hidden" onClick={onClose}>
              <Icon
                className="text-secondary"
                name="search"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="flex flex-1 justify-end items-center gap-4">
            <Button className="w-12 !min-w-0 !p-2" variant="icon" disabled>
              <Icon name="shoppingBag" width={16} height={16} />
            </Button>
            <button onClick={onClose}>
              <Icon name="close" width={24} height={24} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {isValidSession ? (
            <MenuAccountInformation onClose={onClose} />
          ) : (
            <>
              {navs.map((nav) => {
                if (nav.items?.length) {
                  return (
                    <Collapsible
                      key={nav.label}
                      className="!p-0"
                      header={
                        <Text
                          className="text-primary font-semibold"
                          variant="body-18"
                        >
                          {nav.label}
                        </Text>
                      }
                    >
                      <div className="flex flex-col gap-2 px-2">
                        {nav.items.map((item) => (
                          <Link
                            className="text-secondary font-semibold text-body-16"
                            onClick={onClose}
                            href={item.href}
                            key={item.label}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </Collapsible>
                  );
                }

                return (
                  <Link
                    key={nav.label}
                    className="text-secondary font-semibold text-body-18"
                    onClick={onClose}
                    href={nav.href}
                  >
                    {nav.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>

        <ConnectWalletButton showConnectButton />
      </MyModal.Body>
    </MyModal.Root>
  );
}
