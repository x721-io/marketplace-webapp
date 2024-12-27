"use client";

import ERC1155 from "@/abi/ERC1155";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { ADDRESS_ZERO } from "@/config/constants";
import {
  contractNFTTransferProxy,
  exchangeSignedDomain,
} from "@/hooks/useMarketplaceV2";
import { nextAPI } from "@/services/api";
import { Web3Functions } from "@/services/web3";
import { useUserStore } from "@/store/users/store";
import { Collection, daysRanges, NFT } from "@/types";
import { genRandomNumber } from "@/utils";
import { parseUnits } from "ethers";
import { get } from "http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Address, erc721Abi } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import MultiApproveForAllModal from "./MultiApproveForAllModal";
import ListingModal from "./ListingModal";

const BulkList = () => {
  const [errorStep, setErrorStep] = useState<{
    stepIndex: number;
    reason: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { address } = useAccount();
  const [notApprovedForAllCollections, setNotApprovedForAllCollections] =
    useState<Collection[]>([]);
  const [isOpenMultiApproveModal, setOpenMultiApproveModal] = useState(false);
  const [isOpenListingModal, setOpenListingModal] = useState(false);
  const { signTypedDataAsync } = useSignTypedData();
  const {
    bulkOrders,
    removeBulkOrdersItem,
    upsertBulkOrdersItem,
    removeAllBulkOrderItems,
  } = useUserStore();

  const checkIfApprovedForAll = async (collection: Collection) => {
    if (!address) return false;
    if (!collection.type) return false;
    const isApprovedForAll = await Web3Functions.readContract({
      abi: collection.type === "ERC721" ? erc721Abi : ERC1155,
      functionName: "isApprovedForAll",
      address: collection.address,
      args: [address, contractNFTTransferProxy],
    });
    return isApprovedForAll;
  };

  const columnClassName = "text-left p-3";
  const headerTextClassName =
    "uppercase text-heading-sm !text-[0.9rem] text-[rgba(0,0,0,0.75)] tracking-wide";

  const getNotApprovedForAllCollections = async (): Promise<Collection[]> => {
    const notApprovedForAllCollections: Collection[] = [];
    await Promise.all(
      bulkOrders.map(async (order) => {
        if (order.nft) {
          if (order.nft.collection.type) {
            const isApprovedForAll = await checkIfApprovedForAll(
              order.nft.collection
            );
            const isExisted = notApprovedForAllCollections.find(
              (collection) => collection.id === order.nft!.collection.id
            );
            if (!isApprovedForAll && !isExisted) {
              notApprovedForAllCollections.push(order.nft.collection);
            }
          }
        }
      })
    );
    return notApprovedForAllCollections;
  };

  const signListingData = async (root: Address, salt: string) => {
    if (!address) return null;
    try {
      const types = {
        BulkOrder: [
          { name: "maker", type: "address" },
          { name: "root", type: "bytes32" },
          { name: "salt", type: "uint256" },
        ],
      } as const;
      const sig = await signTypedDataAsync({
        account: address,
        domain: exchangeSignedDomain,
        types,
        primaryType: "BulkOrder",
        message: {
          maker: address,
          root,
          salt: BigInt(salt),
        },
      });
      return sig;
    } catch (err) {
      return null;
    }
  };

  const generateBulkData = async (skipCheckApprove: boolean = false) => {
    if (!address) return false;
    if (!skipCheckApprove) {
      const notApprovedForAllCollections =
        await getNotApprovedForAllCollections();
      if (notApprovedForAllCollections.length > 0) {
        setOpenMultiApproveModal(true);
        setNotApprovedForAllCollections(notApprovedForAllCollections);
        return;
      }
    }
    setOpenListingModal(true);
    const salt = genRandomNumber(8, 10).toString();
    const body = bulkOrders
      .map((order, i) => {
        if (!order.nft) return null;
        const { collection } = order.nft;
        const { address: collectionAddress } = collection;
        const { end, price, quantity, quoteToken, start } = order;
        const makeAsset = {
          assetType: 3,
          contractAddress: collectionAddress,
          value: BigInt(quantity).toString(),
          id: order.nft.u2uId ?? order.nft.id,
        };
        const takeAsset = {
          assetType: 1,
          contractAddress: quoteToken,
          value: parseUnits(order.totalPrice.toString(), 18),
          id: BigInt(0).toString(),
        };
        const {
          assetType: make_asset_type,
          contractAddress: make_asset_address,
          value: make_asset_value,
          id: make_asset_id,
        } = makeAsset;
        const {
          assetType: take_asset_type,
          contractAddress: take_asset_address,
          value: take_asset_value,
          id: take_asset_id,
        } = takeAsset;
        return {
          makeAssetType: make_asset_type,
          makeAssetId: make_asset_id.toString(),
          makeAssetAddress: make_asset_address,
          makeAssetValue: make_asset_value.toString(),
          taker: ADDRESS_ZERO,
          takeAssetType: take_asset_type,
          takeAssetAddress: take_asset_address,
          takeAssetValue: take_asset_value.toString(),
          takeAssetId: take_asset_id.toString(),
          salt,
          start: Math.floor(start / 1000).toString(),
          end: Math.floor(end / 1000).toString(),
          orderType: "BULK",
          price: parseUnits(price.toString(), 18).toString(),
          totalPice: take_asset_value.toString(),
          netPrice: parseUnits(order.netPrice.toString(), 18).toString(),
          index: i,
          nft: order.nft,
          quantity: 1,
          quoteToken: ADDRESS_ZERO,
        };
      })
      .filter((item) => item !== null);
    const response = await nextAPI.post("/order/generate-bulk-data", {
      orders: body,
    });

    // const types = {
    //   BulkOrder: [
    //     { name: "maker", type: "address" },
    //     { name: "root", type: "bytes32" },
    //     { name: "salt", type: "uint256" },
    //   ],
    // } as const;
    // const sig = await signTypedDataAsync({
    //   account: address,
    //   domain: exchangeSignedDomain,
    //   types,
    //   primaryType: "BulkOrder",
    //   message: {
    //     maker: address,
    //     root: response.data.data.root,
    //     salt: BigInt(salt),
    //   },
    // });

    const sig = await signListingData(response.data.data.root, salt);
    if (!sig) {
      setErrorStep({
        stepIndex: 0,
        reason: "Sign listing data failed. Please try again",
      });
      return;
    }

    try {
      const body2 = body
        .map((order: any, i: number) => {
          const {
            makeAssetType,
            makeAssetId,
            makeAssetAddress,
            makeAssetValue,
            taker,
            takeAssetType,
            takeAssetAddress,
            takeAssetValue,
            takeAssetId,
            salt,
            start,
            end,
            orderType,
            price,
            totalPice,
            netPrice,
            index,
            nft,
            quantity,
            quoteToken,
          } = order;
          return {
            makeAssetType,
            makeAssetId,
            makeAssetAddress,
            makeAssetValue,
            taker,
            takeAssetType,
            takeAssetAddress,
            takeAssetValue,
            takeAssetId,
            salt,
            start,
            end,
            orderType,
            price,
            totalPice,
            netPrice,
            index,
            nft,
            quantity,
            quoteToken,
            sig,
            root: response.data.data.root,
            proof: response.data.data.proof[i],
          };
        })
        .filter((item) => item !== null);
      await nextAPI.post("/order/bulk", { orders: body2 });
      removeAllBulkOrderItems();
    } catch (err) {}
  };

  const onRetry = async () => {
    setErrorStep(null);
    setCurrentStep(0);
    generateBulkData(true);
  };

  return (
    <div className="w-[70%] mx-auto pt-5 flex flex-col h-[750px] overflow-y-auto">
      <div className="w-full font-bold text-[2rem]">List for sale</div>
      <div className="w-full font-medium text-[1.1rem]">
        {bulkOrders.length} {bulkOrders.length > 1 ? "items" : "item"}
      </div>
      <div className="w-full mt-6">
        <table className="w-full">
          <tr className="w-full border-solid border-t-[1px] border-b-[1px]">
            <th className={columnClassName + " w-[37%] " + headerTextClassName}>
              Item
            </th>
            <th className={columnClassName + " w-[12%] " + headerTextClassName}>
              Quantity
            </th>
            <th className={columnClassName + " w-[20%] " + headerTextClassName}>
              Price per unit
            </th>
            <th className={columnClassName + " w-[20%] " + headerTextClassName}>
              Expiration
            </th>
            <th className={columnClassName}></th>
          </tr>
          {bulkOrders.map((o, i) => (
            <tr key={o.nft?.id ?? i}>
              <td className={columnClassName + " flex flex-col"}>
                <div
                  onClick={() =>
                    router.push(
                      `/item/${o.nft?.collection.address}/${o.nft?.id}`
                    )
                  }
                  className="text-heading-xs !text-[1.1rem] hover:underline cursor-pointer"
                >
                  {o.nft?.name}
                </div>
                <div
                  onClick={() =>
                    router.push(`/collection/${o.nft?.collection.id}`)
                  }
                  className="text-[rgba(0,0,0,0.5)] hover:underline cursor-pointer"
                >
                  {o.nft?.collection.name}
                </div>
              </td>
              <td className={columnClassName}>
                <input
                  type="number"
                  disabled={o.nft?.collection.type !== "ERC1155"}
                  onChange={(e) => {
                    if (Number(e.target.value) <= 0) return;
                    const updatedOrder = structuredClone(o);
                    if (o.nft?.collection.type === "ERC1155") {
                      updatedOrder.quantity = Number(e.target.value);
                      upsertBulkOrdersItem(updatedOrder);
                    }
                  }}
                  value={o.quantity}
                  className="rounded-md w-[60%] disabled:cursor-not-allowed disabled:brightness-95 text-center"
                />
              </td>
              <td className={columnClassName}>
                <input
                  type="number"
                  onChange={(e) => {
                    const updatedOrder = structuredClone(o);
                    updatedOrder.price = Number(e.target.value);
                    const netPrice =
                      parseFloat(updatedOrder.price.toString()) -
                      parseFloat(updatedOrder.price.toString()) * 0.0125;
                    const totalPrice =
                      parseFloat(updatedOrder.price.toString()) +
                      parseFloat(updatedOrder.price.toString()) * 0.0125;
                    updatedOrder.totalPrice = totalPrice;
                    updatedOrder.netPrice = netPrice;
                    upsertBulkOrdersItem(updatedOrder);
                  }}
                  value={o.price}
                  className="p-2 rounded-md w-[80%]"
                />
              </td>
              <td className={columnClassName}>
                <Dropdown.Root
                  dropdownContainerClassName="w-full"
                  label=""
                  icon={
                    <div className="w-[100%] relative bg-surface-soft flex items-center justify-center gap-3 rounded-2xl py-3 px-5 h-full cursor-pointer">
                      <div className="flex-1 flex justify-between text-[0.95rem]">
                        <div>
                          {o.daysRange.replaceAll("_", " ").toLowerCase()}
                        </div>
                      </div>
                      <div className="rounded-lg p-1">
                        <Icon name="chevronDown" width={14} height={14} />
                      </div>
                    </div>
                  }
                >
                  {daysRanges.map((item) => (
                    <Dropdown.Item
                      key={item}
                      className="w-full rounded-md"
                      onClick={() => {
                        const updatedOrder = structuredClone(o);
                        updatedOrder.daysRange = item;
                        upsertBulkOrdersItem(updatedOrder);
                      }}
                    >
                      <div className="w-full flex items-center gap-2">
                        {item.replaceAll("_", " ").toLowerCase()}
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Root>
              </td>
              <td className={columnClassName + "w-full text-center"}>
                <button
                  className="hover:underline"
                  onClick={() => {
                    const itemToDeteleIndex = bulkOrders.findIndex(
                      (ele) =>
                        ele.nft?.id === o.nft?.id &&
                        ele.nft?.collectionId === o.nft?.collectionId
                    );
                    removeBulkOrdersItem(itemToDeteleIndex);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
        <div className="w-full fixed bottom-0 left-0 h-[80px] border-solid border-t-[1px] flex items-center justify-end px-10 bg-white">
          <Button onClick={() => generateBulkData()} className="text-[1.25rem]">
            List
          </Button>
        </div>
      </div>
      <MultiApproveForAllModal
        collections={notApprovedForAllCollections}
        isOpen={isOpenMultiApproveModal}
        onClose={() => setOpenMultiApproveModal(false)}
        onList={() => {
          if (isOpenMultiApproveModal) {
            setOpenMultiApproveModal(false);
          }
          generateBulkData();
        }}
        onApproveSucces={(approvedCollection) =>
          setNotApprovedForAllCollections((collection) =>
            collection.filter((c) => c.id !== approvedCollection.id)
          )
        }
      />
      <ListingModal
        title="Listing NFTs"
        erorStep={errorStep}
        isOpen={isOpenListingModal}
        onClose={() => setOpenListingModal(false)}
        currentStep={currentStep}
        onRetry={onRetry}
        steps={[
          {
            title: "Sign listing data",
            description: "",
          },
          {
            title: "Create listing data",
            description: "",
          },
        ]}
      />
    </div>
  );
};

export default BulkList;
