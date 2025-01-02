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
import { useEffect, useState } from "react";
import { Address, erc721Abi } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import MultiApproveForAllModal from "./MultiApproveForAllModal";
import ListingModal from "./ListingModal";
import ListingHeader, { ApplyInput } from "./ListingHeader";
import Image from "next/image";
import { convertImageUrl } from "@/utils/nft";
import { tokens } from "@/config/tokens";
import { useAuth } from "@/hooks/useAuth";
import ConnectWalletButton from "@/components/Button/ConnectWalletButton";

const BulkList = () => {
  const [appliedIndexes, setAppliedIndexes] = useState<number[]>([]);
  const [errorStep, setErrorStep] = useState<{
    stepIndex: number;
    reason: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { isValidSession } = useAuth();
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
    replaceAllBulkOrdersItems,
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
        const tokenKey = Object.keys(tokens).find(
          (key) => tokens[key].address === order.quoteToken
        );
        const decimal = tokenKey ? tokens[tokenKey].decimal : 18;
        const { collection } = order.nft;
        const { address: collectionAddress } = collection;
        const { price, quantity, quoteToken } = order;
        const totalDays = Number(order.daysRange.toString().split("_")[0]);
        const start = new Date().getTime();
        const end = new Date().getTime() + totalDays * 24 * 60 * 60 * 1000;
        const makeAsset = {
          assetType: 3,
          contractAddress: collectionAddress,
          value: BigInt(quantity).toString(),
          id: order.nft.u2uId ?? order.nft.id,
        };
        const takeAsset = {
          assetType: 1,
          contractAddress: quoteToken,
          value: parseUnits(order.totalPrice.toString(), decimal),
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
          price: parseUnits(price.toString(), decimal).toString(),
          totalPice: take_asset_value.toString(),
          netPrice: parseUnits(order.netPrice.toString(), decimal).toString(),
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

    const sig = await signListingData(response.data.data.root, salt);
    if (!sig) {
      setErrorStep({
        stepIndex: 0,
        reason: "Sign listing data failed. Please try again",
      });
      return;
    }

    setCurrentStep(1);

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
      setCurrentStep(2);
      removeAllBulkOrderItems();
    } catch (err) {
      setErrorStep({
        stepIndex: 1,
        reason: "Create listing data failed. Please try again",
      });
      return;
    }
  };

  const onRetry = async () => {
    setErrorStep(null);
    setCurrentStep(0);
    generateBulkData(true);
  };

  const handleApplyInput = (input: ApplyInput) => {
    const updatedOrders = structuredClone(bulkOrders);
    switch (input.type) {
      case "price":
        for (let i = 0; i <= updatedOrders.length - 1; i++) {
          if (appliedIndexes.includes(i)) {
            updatedOrders[i].price = input.value;
            const netPrice =
              parseFloat(updatedOrders[i].price.toString()) -
              parseFloat(updatedOrders[i].price.toString()) * 0.0125;
            const totalPrice =
              parseFloat(updatedOrders[i].price.toString()) +
              parseFloat(updatedOrders[i].price.toString()) * 0.0125;
            updatedOrders[i].totalPrice = totalPrice;
            updatedOrders[i].netPrice = netPrice;
          }
        }
        break;
      case "daysRange":
        for (let i = 0; i <= updatedOrders.length - 1; i++) {
          if (appliedIndexes.includes(i)) {
            updatedOrders[i].daysRange = input.value;
          }
        }
        break;
    }
    replaceAllBulkOrdersItems(updatedOrders);
  };

  const handleCheckItems = () => {
    if (appliedIndexes.length === 0) {
      setAppliedIndexes(bulkOrders.map((_, i) => i));
    } else {
      setAppliedIndexes([]);
    }
  };

  const handleCheckItem = (index: number) => {
    if (!appliedIndexes.includes(index)) {
      setAppliedIndexes((prev) => [...prev, index]);
    } else {
      setAppliedIndexes((prev) => prev.filter((_index) => _index !== index));
    }
  };

  if (!isValidSession) {
    return (
      <div className="w-[75%] mx-auto pt-8 flex flex-col pr-10 items-center gap-5 tracking-[0.4px]">
        <p className="!font-bold text-[1.4rem]">Please connect your wallet</p>
        <ConnectWalletButton showConnectButton>
          <Button
            loadingText="Creating collection ..."
            type="submit"
            className="w-full tablet:w-auto desktop:w-auto"
          ></Button>
        </ConnectWalletButton>
      </div>
    );
  }

  return (
    <div className="desktop:w-[75%] w-[95%] mx-auto pt-5 flex flex-col h-[750px] overflow-y-auto desktop:pr-10">
      <div
        className="w-10 h-10 mb-5 flex justify-center items-center rounded-[42px] bg-surface-soft shadow hover:shadow-md"
        onClick={() => router.push(`/user/${address}`)}
      >
        <Icon
          className="cursor-pointer"
          name="arrowLeft"
          width={20}
          height={20}
        />
      </div>
      <div className="w-full font-bold text-[2rem]">List for sale</div>
      <div className="w-full font-medium text-[1.1rem] pt-1">
        {bulkOrders.length} {bulkOrders.length > 1 ? "items" : "item"}
      </div>
      {bulkOrders.length === 0 && (
        <div className="border-solid border-[1px] rounded-lg w-full py-5 flex flex-col items-center justify-center mt-5 gap-5">
          <div className="font-semibold text-[1.4rem] w-[300px] text-center text-balance">
            You can select items to list for sale from your profile.
          </div>
          <Button
            className="!px-10 text-[1.22rem]"
            onClick={() => router.push(`/user/${address}`)}
          >
            Get started
          </Button>
        </div>
      )}
      {bulkOrders.length > 0 && (
        <div className="w-full pt-4">
          <ListingHeader
            appliedIndexes={appliedIndexes}
            onApply={(input) => handleApplyInput(input)}
          />
        </div>
      )}
      {bulkOrders.length > 0 && (
        <div className="w-full mt-0">
          <table className="w-full">
            <tr className="w-full border-solid border-t-[1px] border-b-[1px]">
              <th
                className={
                  columnClassName +
                  " w-[37%] flex items-center gap-3 " +
                  headerTextClassName
                }
              >
                <button
                  style={{
                    background:
                      appliedIndexes.length > 0 ? "#3F51B5" : "transparent",
                  }}
                  onClick={handleCheckItems}
                  className="w-5 h-5 border-solid border-[1px] border-[rgba(0,0,0,0.45)] flex items-center justify-center text-white"
                >
                  {appliedIndexes.length === bulkOrders.length
                    ? "✓"
                    : appliedIndexes.length > 0
                    ? "-"
                    : ""}
                </button>{" "}
                Item
              </th>
              <th
                className={columnClassName + " w-[12%] " + headerTextClassName}
              >
                Quantity
              </th>
              <th
                className={columnClassName + " w-[20%] " + headerTextClassName}
              >
                Price per unit
              </th>
              <th
                className={columnClassName + " w-[20%] " + headerTextClassName}
              >
                Expiration
              </th>
              <th className={columnClassName}></th>
            </tr>
            {bulkOrders.map((o, i) => (
              <tr key={o.nft?.id ?? i}>
                <td
                  className={
                    columnClassName + " flex flex-row items-center gap-3"
                  }
                >
                  <input
                    type="checkbox"
                    className="mt-2 w-5 h-5 cursor-pointer"
                    checked={appliedIndexes.includes(i)}
                    onChange={() => handleCheckItem(i)}
                  />
                  {o.nft?.image && (
                    <Image
                      src={convertImageUrl(o.nft.image)}
                      alt={`${o.nft.name}-image`}
                      className="rounded-md"
                      width={50}
                      height={50}
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      onClick={() =>
                        router.push(
                          `/item/${o.nft?.collection.address}/${o.nft?.id}`
                        )
                      }
                      className="text-heading-xs !text-[1.1rem] flex items-start gap-2 hover:underline cursor-pointer tracking-[0.25px]"
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
                    className="rounded-md w-[80%] disabled:cursor-not-allowed disabled:brightness-95 text-center"
                  />
                </td>
                <td className={columnClassName + " flex"}>
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
                    className="p-2 rounded-l-md w-[50%] outline-none"
                  />
                  <select
                    onChange={(e) => {
                      const updatedOrder = structuredClone(o);
                      updatedOrder.quoteToken = e.target.value as Address;
                      upsertBulkOrdersItem(updatedOrder);
                    }}
                    value={o.quoteToken}
                    className="p-2 rounded-r-md !rounded-l-none w-[50%] !border-l-0 outline-none"
                  >
                    {Object.keys(tokens).map((key) => (
                      <option key={key} value={tokens[key].address}>
                        {key}
                      </option>
                    ))}
                  </select>
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
            <Button
              onClick={() => generateBulkData()}
              className="text-[1.25rem]"
            >
              List
            </Button>
          </div>
        </div>
      )}
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
