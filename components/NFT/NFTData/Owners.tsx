import React, { useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { formatEther } from "ethers";
import Link from "next/link";
import useAuthStore from "@/store/auth/store";
import BuyNFTModal from "@/components/Modal/BuyNFTModal";
import { formatDisplayedBalance } from "@/utils";
import { NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import Text from "@/components/Text";
import { getUserAvatarImage } from "@/utils/string";
import BidNFTModal from "@/components/Modal/BidNFTModal";
import { findTokenByAddress } from "@/utils/token";

export default function OwnersTab({
  nft,
  marketData,
}: {
  nft: NFT;
  marketData?: APIResponse.NFTMarketData;
}) {
  const [modals, setModals] = useState<Record<string, any>>({});
  const userWallet = useAuthStore((state) => state.profile?.publicKey);
  const [showBidModal, setShowBidModal] = useState(false);
  const token = useMemo(() => findTokenByAddress( marketData?.sellInfo[0]?.quoteToken), [ marketData?.sellInfo[0]?.quoteToken]);

  const owners = useMemo(() => {
    if (!marketData) return [];
    return marketData.owners
      .map((owner) => {
        const sellInfo = marketData.sellInfo.find((item) => {
          return (
            item.from?.signer?.toLowerCase() === owner.publicKey?.toLowerCase()
          );
        });
        return {
          ...owner,
          sellInfo,
        };
      })
      .sort((a, b) => {
        return !!a.sellInfo ? -1 : 0;
      });
  }, [marketData]);

  const myBid = useMemo(() => {
    if (!marketData) return;
    return marketData.bidInfo?.find((bid) => {
      return (
        !!bid.to?.publicKey &&
        !!userWallet &&
        bid.to?.publicKey?.toLowerCase() === userWallet?.toLowerCase()
      );
    });
  }, [marketData, userWallet]);

  return (
    <div className="w-full py-7">
      <div className="w-full p-7 flex flex-col desktop:gap-4 tablet:gap-4 gap-6 rounded-2xl border border-disabled border-dashed">
        {!marketData || !owners.length ? (
          <Text className="text-secondary font-semibold text-body-4 text-center">
            Nothing to show
          </Text>
        ) : (
          owners.map((owner) => {
            return (
              <div
                className="flex desktop:items-center tablet:items-center items-start justify-between flex-col desktop:flex-row tablet:flex-row"
                key={owner.id}
              >
                <Link
                  href={`/user/${owner.id}`}
                  className="flex items-center gap-4"
                >
                  <Image
                    className="w-12 h-12 rounded-2xl"
                    width={80}
                    height={80}
                    src={getUserAvatarImage(owner)}
                    alt="avatar"
                  />
                  <div>
                    <p className="font-medium">{owner.username}</p>
                    {!!owner.sellInfo ? (
                      <p className="text-secondary text-body-14 font-semibold break-all">
                        {owner.sellInfo.quantity} / {owner.quantity} item(s) on
                        sale for
                        <span className="text-primary">
                          {" "}
                          {formatDisplayedBalance(
                            formatEther(owner.sellInfo.price),
                            2,
                          )}{" "}
                          {token?.symbol}
                        </span>{" "}
                        each
                      </p>
                    ) : (
                      <p className="flex items-center gap-1">
                        <p className="text-secondary font-semibold text-body-14  break-all w-auto overflow-hidden whitespace-nowrap block max-w-[150px] text-ellipsis ">
                          {formatDisplayedBalance(owner.quantity, 0)}
                        </p>
                        <p className="text-secondary font-semibold text-body-14">
                          {" "}
                          edition(s) -
                        </p>{" "}
                        <span className="font-bold"> Not for sale</span>
                      </p>
                    )}
                  </div>
                </Link>

                {owner.publicKey.toLowerCase() === userWallet?.toLowerCase() ? (
                  <div className="text-body-14 font-medium text-secondary p-2 rounded-lg bg-surface-soft w-[120px] text-center">
                    This is me
                  </div>
                ) : !!owner.sellInfo ? (
                  <Button
                    scale="sm"
                    onClick={() => setModals({ ...modals, [owner.id]: true })}
                  >
                    Buy now
                  </Button>
                ) : myBid ? (
                  <Button scale="sm" onClick={() => setShowBidModal(true)}>
                    Place a bid
                  </Button>
                ) : (
                  ""
                )}
                <BuyNFTModal
                  saleData={owner.sellInfo}
                  nft={nft}
                  show={modals[owner.id]}
                  onClose={() => setModals({ ...modals, [owner.id]: false })}
                />
              </div>
            );
          })
        )}
      </div>
      <BidNFTModal
        marketData={marketData}
        nft={nft}
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
      />
    </div>
  );
}
