import { signTypedData } from "wagmi/actions";
import {
  TypedDataEncoder,
  AbiCoder,
  keccak256,
  toUtf8Bytes,
  concat,
  TypedDataField,
} from "ethers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { encodeAbiParameters } from "viem";
import { CreateBulkOrderItemInput, Order } from "../test-new-buy/page";
import { tree } from "next/dist/build/templates/app-page";
import { MerkleTree } from "@openzeppelin/merkle-tree/dist/merkletree";
import { fillArray } from "./utils";

type BulkOrderElements<T> =
  | [T, T]
  | [BulkOrderElements<T>, BulkOrderElements<T>];

// const getTree = (leaves: string[], defaultLeafHash: string) =>
//   new MerkleTree(leaves.map(hexToBuffer), bufferKeccak, {
//     complete: true,
//     sort: false,
//     hashLeaves: false,
//     fillDefaultHash: hexToBuffer(defaultLeafHash),
//   });

export const encodeProof = (
  key: number,
  proof: string[],
  signature = `0x${"ff".repeat(64)}`
) => {
  return concat([
    signature,
    `0x${key.toString(16).padStart(6, "0")}`,
    AbiCoder.defaultAbiCoder().encode([`uint256[${proof.length}]`], [proof]),
  ]);
};

export class Eip712MerkleTree<T extends Record<string, any>> {
  private tree: StandardMerkleTree<any>;
  private elements: T[] = [];
  private encoder: TypedDataEncoder;

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

  get root() {
    return this.tree.root;
  }

  // getProof(leaf: T) {
  //   const proof = this.tree.getProof(leaf);
  //   const root = this.tree.root;
  //   return { leaf, proof, root };
  // }

  getProof(index: number) {
    const proof = this.tree.getProof(index);
    const root = this.tree.root;
    console.log({ proof });
    return { proof, root };
  }

  getDataToSign(): T[] {
    return this.elements;
  }

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

  constructor(_elements: T[], types: Record<string, Array<TypedDataField>>) {
    // const values = orders.map((order) => {
    //   const encodedOrderData = this.getEncodedOrderData(order);
    //   return keccak256(encodedOrderData);
    // });

    let values: [string][] = [];

    this.elements = _elements;
    this.encoder = TypedDataEncoder.from(types);

    this.elements.forEach((ele) => {
      const hashedLeafData = this.encoder.hash(ele);
      values.push([hashedLeafData]);
    });

    this.tree = StandardMerkleTree.of(values, ["string"]);

    console.log("---------");
    console.log("Merke Tree");
    console.log("---------");
    console.log(this.tree);
    console.log("---------");
    console.log("Merkle Root: " + this.tree.root);

    console.log("Proof 1: " + this.tree.getProof(values[0]));
    console.log("Proof 2: " + this.tree.getProof(values[1]));

    const verified = this.tree.verify(values[0], this.tree.getProof(values[0]));

    alert(verified);
  }

  generateLeafHash(element: T) {
    return keccak256(this.encoder.hash(element));
  }

  getLeafHash(index: number) {
    const a = this.tree.leafHash;
    return this.tree.leafHash;
  }

  getRoot(): string {
    return this.tree.root;
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
