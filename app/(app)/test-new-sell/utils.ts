import { CreateBulkOrderItemInput } from "../test-new-buy/page";
import { Eip712MerkleTree } from "./Eip721MerkleTree";

export const fillArray = <T>(arr: T[], length: number) => {
  if (length > arr.length)
    arr.push(...Array(length - arr.length).fill(arr[arr.length - 1]));
  return arr;
};

export function getBulkOrderTreeHeight(length: number): number {
  return Math.max(Math.ceil(Math.log2(length)), 1);
}

export function getBulkOrderTree(
  orderComponents: CreateBulkOrderItemInput[],
  startIndex = 0,
  height = getBulkOrderTreeHeight(orderComponents.length + startIndex)
) {
  let elements = [...orderComponents];

  if (startIndex > 0) {
    elements = [
      ...fillArray([] as CreateBulkOrderItemInput[], startIndex),
      ...orderComponents,
    ];
  };
}
