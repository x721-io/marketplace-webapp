"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { ADDRESS_ZERO } from "@/config/constants";
import { exchangeSignedDomain } from "@/hooks/useMarketplaceV2";
import { nextAPI } from "@/services/api";
import { useUserStore } from "@/store/users/store";
import { daysRanges } from "@/types";
import { genRandomNumber } from "@/utils";
import { parseUnits } from "ethers";
import { useRouter } from "next/navigation";
import { useAccount, useSignTypedData } from "wagmi";

const BulkList = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const {
    bulkOrders,
    removeBulkOrdersItem,
    upsertBulkOrdersItem,
    removeAllBulkOrderItems,
  } = useUserStore();

  const columnClassName = "text-left p-3";
  const headerTextClassName =
    "uppercase text-heading-sm !text-[0.9rem] text-[rgba(0,0,0,0.75)] tracking-wide";

  const generateBulkData = async () => {
    if (!address) return false;
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
        root: response.data.data.root,
        salt: BigInt(salt),
      },
    });

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

  return (
    <div className="w-[70%] mx-auto pt-10 flex flex-col h-screen overflow-y-auto">
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
                  onChange={(e) => {
                    const updatedOrder = structuredClone(o);
                    updatedOrder.quantity = Number(e.target.value);
                    upsertBulkOrdersItem(updatedOrder);
                  }}
                  value={o.quantity}
                  className="p-2 rounded-md w-[80%]"
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
        <div className="w-full fixed bottom-0 left-0 h-[80px] border-solid border-t-[1px] flex items-center justify-end px-10">
          <Button onClick={() => generateBulkData()} className="text-[1.25rem]">
            List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkList;
