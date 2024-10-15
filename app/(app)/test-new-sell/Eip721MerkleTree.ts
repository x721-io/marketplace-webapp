import { signTypedData } from "wagmi/actions";
import { SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import {
  TypedDataEncoder,
  AbiCoder,
  keccak256,
  toUtf8Bytes,
  concat,
  TypedDataField,
} from "ethers";
import { Address, encodeAbiParameters, parseUnits } from "viem";
import { CreateBulkOrderItemInput, Order } from "../test-new-buy/page";
import { tree } from "next/dist/build/templates/app-page";
import { fillArray } from "./utils";
import { ListingItem } from "../test-merkle/page";
import { FormState, NFT } from "@/types";
import { ADDRESS_ZERO } from "@/config/constants";

// { name: "index", type: "int16" },
// { name: "makeAssetAddress", type: "address" },
// { name: "makeAssetId", type: "uint256" },
// { name: "makeAssetValue", type: "uint256" },
// { name: "makeAssetType", type: "uint256" },
// { name: "takeAssetAddress", type: "address" },
// { name: "takeAssetId", type: "uint256" },
// { name: "takeAssetValue", type: "uint256" },
// { name: "takeAssetType", type: "uint256" },

export type TestType = {
  index: number;
  maker: Address;
  makeAssetAddress: Address;
  makeAssetId: bigint;
  makeAssetValue: bigint;
  makeAssetType: bigint;
  taker: Address;
  takeAssetAddress: Address;
  takeAssetId: bigint;
  takeAssetValue: bigint;
  takeAssetType: bigint;
}

export class Eip712MerkleTree {
  public tree: SimpleMerkleTree;
  public proofs: string[][] = [];

  // get completedSize() {
  //   return Math.pow(2, this.depth);
  // }

  /** Returns the array of elements in the tree, padded to the complete size with empty items. */
  // getCompleteElements() {
  //   const elements = this.elements;
  //   return fillArray([...elements], this.completedSize, this.defaultNode);
  // }

  /** Returns the array of leaf nodes in the tree, padded to the complete size with default hashes. */
  // getCompleteLeaves() {
  //   const leaves = this.elements.map(this.leafHasher);
  //   return fillArray([...leaves], this.completedSize, this.defaultLeaf);
  // }

  // getProof(leaf: T) {
  //   const proof = this.tree.getProof(leaf);
  //   const root = this.tree.root;
  //   return { leaf, proof, root };
  // }

  // getBulkOrderHash() {
  //   const structHash = this.encoder.hashStruct("BulkOrder", {
  //     tree: this.getDataToSign(),
  //   });
  //   const leaves = this.getCompleteLeaves().map(hexToBuffer);
  //   const rootHash = bufferToHex(getRoot(leaves, false));
  //   const typeHash = keccak256(
  //     toUtf8Bytes(this.encoder.types.BulkOrder[0].type)
  //   );
  //   const bulkOrderHash = keccak256(concat([typeHash, rootHash]));

  //   if (bulkOrderHash !== structHash) {
  //     throw new Error("expected derived bulk order hash to match");
  //   }

  //   return structHash;
  // }

  constructor(_elements: Array<TestType>) {
    // order.index,
    // order.makeAsset.contractAddress,
    // order.makeAsset.id,
    // order.makeAsset.value,
    // order.makeAsset.assetType,
    // order.takeAsset.contractAddress,
    // order.takeAsset.id,
    // order.takeAsset.value,
    // order.takeAsset.assetType

    const encodedDatas = _elements.map((ele, i) => {
      return keccak256(
        encodeAbiParameters(
          [
            { name: "index", type: "int16" },
            { name: "makeAssetAddress", type: "address" },
            { name: "makeAssetId", type: "uint256" },
            { name: "makeAssetValue", type: "uint256" },
            { name: "makeAssetType", type: "uint256" },
            { name: "takeAssetAddress", type: "address" },
            { name: "takeAssetId", type: "uint256" },
            { name: "takeAssetValue", type: "uint256" },
            { name: "takeAssetType", type: "uint256" },
          ],
          [
            i,
            ele.makeAssetAddress,
            BigInt(ele.makeAssetId),
            BigInt(ele.makeAssetValue),
            BigInt(ele.makeAssetType),
            ele.takeAssetAddress,
            BigInt(ele.takeAssetId),
            ele.takeAssetValue,
            BigInt(ele.takeAssetType),
          ]
        )
      );
    });

    this.tree = SimpleMerkleTree.of(encodedDatas);

    console.log("---------");
    console.log("Merke Tree");
    console.log("---------");
    console.log(this.tree);
    console.log("---------");
    console.log("Merkle Root: " + this.tree.root);
    const verified = this.tree.verify(0, this.tree.getProof(0));

    alert(verified);
  }

  // sign(orders: CreateBulkOrderItemInput[]) {
  //   const obj: any = {};

  //   orders.forEach((order, i) => {
  //     obj[i] = {
  //       contractAddress: order.makeAsset.contractAddress,
  //     };
  //   });

  //   const types = {
  //     Asset: [
  //       { name: "assetType", type: "uint8" },
  //       { name: "contractAddress", type: "address" },
  //       { name: "value", type: "uint256" },
  //       { name: "id", type: "uint256" },
  //     ],
  //     Fee: [
  //       { name: "receiver", type: "address" },
  //       { name: "amount", type: "uint96" },
  //     ],
  //     Order: [
  //       { name: "maker", type: "address" },
  //       { name: "makeAsset", type: "Asset" },
  //       { name: "taker", type: "address" },
  //       { name: "takeAsset", type: "Asset" },
  //       { name: "salt", type: "uint256" },
  //       { name: "start", type: "int256" },
  //       { name: "end", type: "int256" },
  //     ],
  //     Orders: [{ name: "orders", type: "Order[]", name: 'root' }],
  //   };

  //   const message = {
  //     orders: orders.map((o) => {
  //       return {
  //         maker: o.maker,
  //         makeAsset: {
  //           assetType: 0,
  //           contractAddress: o.makeAsset.contractAddress,
  //           value: o.makeAsset.value,
  //           id: o.makeAsset.id,
  //         },
  //         taker: "0x0000000000000000000000000000000000000000",
  //         takeAsset: {
  //           assetType: 0,
  //           contractAddress: o.takeAsset.contractAddress,
  //           value: o.takeAsset.value,
  //           id: o.takeAsset.id,
  //         }
  //       };
  //     }),
  //   };

  //   signTypedData({
  //     domain: {
  //       chainId: 2484,
  //       name: "U2U",
  //       version: "1",
  //     },
  //     types,
  //     primaryType: "Orders",
  //     message,
  //   });
  // }
}
