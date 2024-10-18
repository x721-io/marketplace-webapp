"use client";

import { useAccount, useSignTypedData } from "wagmi";
import crypto from "crypto";
import { encodeAbiParameters } from "viem";

const abi = [
  { type: "constructor", stateMutability: "nonpayable", inputs: [] },
  {
    type: "event",
    name: "BuyerFeeAmountChanged",
    inputs: [
      {
        type: "uint256",
        name: "oldValue",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "newValue",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Cancel",
    inputs: [
      {
        type: "bytes32",
        name: "hash",
        internalType: "bytes32",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CancelOrFilled",
    inputs: [
      {
        type: "address",
        name: "maker",
        internalType: "address",
        indexed: false,
      },
      { type: "bytes", name: "sig", internalType: "bytes", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FeeReceiverChanged",
    inputs: [
      {
        type: "address",
        name: "oldValue",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "newValue",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Match",
    inputs: [
      {
        type: "bytes32",
        name: "leftHash",
        internalType: "bytes32",
        indexed: false,
      },
      {
        type: "bytes32",
        name: "rightHash",
        internalType: "bytes32",
        indexed: false,
      },
      {
        type: "uint256",
        name: "newLeftFill",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "newRightFill",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MatcherChange",
    inputs: [
      {
        type: "uint256",
        name: "assetType",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "address",
        name: "matcher",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProxyChange",
    inputs: [
      {
        type: "uint256",
        name: "assetType",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "address",
        name: "proxy",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SellerFeeAmountChanged",
    inputs: [
      {
        type: "uint256",
        name: "oldValue",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "newValue",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "__ExchangeV2_init",
    inputs: [
      { type: "address", name: "_transferProxy", internalType: "address" },
      { type: "address", name: "_erc20TransferProxy", internalType: "address" },
      { type: "uint256", name: "newProtocolFee", internalType: "uint256" },
      {
        type: "address",
        name: "newDefaultFeeReceiver",
        internalType: "address",
      },
      {
        type: "address",
        name: "newRoyaltiesProvider",
        internalType: "contract IRoyaltiesProvider",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "_owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "cancel",
    inputs: [
      {
        type: "tuple",
        name: "order",
        internalType: "struct X721Order.Order",
        components: [
          { type: "address", name: "maker", internalType: "address" },
          {
            type: "tuple",
            name: "makeAsset",
            internalType: "struct LibAsset.Asset",
            components: [
              {
                type: "uint8",
                name: "assetType",
                internalType: "enum LibAsset.AssetType",
              },
              {
                type: "address",
                name: "contractAddress",
                internalType: "address",
              },
              { type: "uint256", name: "value", internalType: "uint256" },
              { type: "uint256", name: "id", internalType: "uint256" },
            ],
          },
          { type: "address", name: "taker", internalType: "address" },
          {
            type: "tuple",
            name: "takeAsset",
            internalType: "struct LibAsset.Asset",
            components: [
              {
                type: "uint8",
                name: "assetType",
                internalType: "enum LibAsset.AssetType",
              },
              {
                type: "address",
                name: "contractAddress",
                internalType: "address",
              },
              { type: "uint256", name: "value", internalType: "uint256" },
              { type: "uint256", name: "id", internalType: "uint256" },
            ],
          },
          { type: "uint256", name: "salt", internalType: "uint256" },
          { type: "uint256", name: "start", internalType: "uint256" },
          { type: "uint256", name: "end", internalType: "uint256" },
          {
            type: "tuple",
            name: "originFee",
            internalType: "struct X721Order.Fee",
            components: [
              { type: "address", name: "receiver", internalType: "address" },
              { type: "uint96", name: "amount", internalType: "uint96" },
            ],
          },
          { type: "bytes", name: "data", internalType: "bytes" },
        ],
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "cancelOrder",
    inputs: [
      {
        type: "tuple",
        name: "input",
        internalType: "struct X721Order.Input",
        components: [
          {
            type: "tuple",
            name: "order",
            internalType: "struct X721Order.Order",
            components: [
              { type: "address", name: "maker", internalType: "address" },
              {
                type: "tuple",
                name: "makeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "address", name: "taker", internalType: "address" },
              {
                type: "tuple",
                name: "takeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "uint256", name: "salt", internalType: "uint256" },
              { type: "uint256", name: "start", internalType: "uint256" },
              { type: "uint256", name: "end", internalType: "uint256" },
              {
                type: "tuple",
                name: "originFee",
                internalType: "struct X721Order.Fee",
                components: [
                  {
                    type: "address",
                    name: "receiver",
                    internalType: "address",
                  },
                  { type: "uint96", name: "amount", internalType: "uint96" },
                ],
              },
              { type: "bytes", name: "data", internalType: "bytes" },
            ],
          },
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "uint256", name: "nonce", internalType: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "fills",
    inputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "getTransferProxy",
    inputs: [{ type: "uint8", name: "index", internalType: "uint8" }],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "matchOrders",
    inputs: [
      {
        type: "tuple[]",
        name: "lefts",
        internalType: "struct X721Order.Input[]",
        components: [
          {
            type: "tuple",
            name: "order",
            internalType: "struct X721Order.Order",
            components: [
              { type: "address", name: "maker", internalType: "address" },
              {
                type: "tuple",
                name: "makeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "address", name: "taker", internalType: "address" },
              {
                type: "tuple",
                name: "takeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "uint256", name: "salt", internalType: "uint256" },
              { type: "uint256", name: "start", internalType: "uint256" },
              { type: "uint256", name: "end", internalType: "uint256" },
              {
                type: "tuple",
                name: "originFee",
                internalType: "struct X721Order.Fee",
                components: [
                  {
                    type: "address",
                    name: "receiver",
                    internalType: "address",
                  },
                  { type: "uint96", name: "amount", internalType: "uint96" },
                ],
              },
              { type: "bytes", name: "data", internalType: "bytes" },
            ],
          },
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "uint256", name: "nonce", internalType: "uint256" },
        ],
      },
      {
        type: "tuple[]",
        name: "rights",
        internalType: "struct X721Order.Input[]",
        components: [
          {
            type: "tuple",
            name: "order",
            internalType: "struct X721Order.Order",
            components: [
              { type: "address", name: "maker", internalType: "address" },
              {
                type: "tuple",
                name: "makeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "address", name: "taker", internalType: "address" },
              {
                type: "tuple",
                name: "takeAsset",
                internalType: "struct LibAsset.Asset",
                components: [
                  {
                    type: "uint8",
                    name: "assetType",
                    internalType: "enum LibAsset.AssetType",
                  },
                  {
                    type: "address",
                    name: "contractAddress",
                    internalType: "address",
                  },
                  { type: "uint256", name: "value", internalType: "uint256" },
                  { type: "uint256", name: "id", internalType: "uint256" },
                ],
              },
              { type: "uint256", name: "salt", internalType: "uint256" },
              { type: "uint256", name: "start", internalType: "uint256" },
              { type: "uint256", name: "end", internalType: "uint256" },
              {
                type: "tuple",
                name: "originFee",
                internalType: "struct X721Order.Fee",
                components: [
                  {
                    type: "address",
                    name: "receiver",
                    internalType: "address",
                  },
                  { type: "uint96", name: "amount", internalType: "uint96" },
                ],
              },
              { type: "bytes", name: "data", internalType: "bytes" },
            ],
          },
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "uint256", name: "nonce", internalType: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "receiver", internalType: "address" },
      { type: "uint48", name: "buyerAmount", internalType: "uint48" },
      { type: "uint48", name: "sellerAmount", internalType: "uint48" },
    ],
    name: "protocolFee",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceOwnership",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "contract IRoyaltiesProvider",
      },
    ],
    name: "royaltiesRegistry",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setAllProtocolFeeData",
    inputs: [
      { type: "address", name: "_receiver", internalType: "address" },
      { type: "uint48", name: "_buyerAmount", internalType: "uint48" },
      { type: "uint48", name: "_sellerAmount", internalType: "uint48" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setAssetMatcher",
    inputs: [
      { type: "uint256", name: "assetType", internalType: "uint256" },
      { type: "address", name: "matcher", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPrtocolFeeBuyerAmount",
    inputs: [{ type: "uint48", name: "_buyerAmount", internalType: "uint48" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPrtocolFeeReceiver",
    inputs: [{ type: "address", name: "_receiver", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPrtocolFeeSellerAmount",
    inputs: [{ type: "uint48", name: "_sellerAmount", internalType: "uint48" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setRoyaltiesRegistry",
    inputs: [
      {
        type: "address",
        name: "newRoyaltiesRegistry",
        internalType: "contract IRoyaltiesProvider",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setTransferProxy",
    inputs: [
      { type: "uint8", name: "index", internalType: "uint8" },
      { type: "address", name: "proxy", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferOwnership",
    inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
  },
] as const;

export function genRandomNumber(byteCount: number, radix: number) {
  return BigInt("0x" + crypto.randomBytes(byteCount).toString("hex")).toString(
    radix
  );
}

export default function TestNewBuy() {
  const { address, isConnected } = useAccount();
  const id = BigInt(
    "108876780894566954452331977665283960660695562117204225657578741662069813151601"
  );
  const { signTypedDataAsync } = useSignTypedData();

  // const testMerkleTree = () => {
  //   const web3 = new Web3();

  //   let items: {
  //     collectionAdr: string;
  //     id: string;
  //     amount: string;
  //   }[] = [
  //     {
  //       collectionAdr: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //       amount: web3.eth.abi.encodeParameter("uint256", "1000000000000000000"),
  //       id: "1",
  //     },
  //     {
  //       collectionAdr: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //       amount: web3.eth.abi.encodeParameter("uint256", "1000000000000000000"),
  //       id: "2",
  //     },
  //   ];

  //   const leafNodes = items.map((item) =>
  //     keccak256(
  //       Buffer.concat([
  //         Buffer.from(item.collectionAdr.replace("0x", ""), "hex"),
  //         Buffer.from(item.amount.replace("0x", ""), "hex"),
  //       ])
  //     )
  //   );

  //   const merkleTree = new MerkleTree(leafNodes, keccak256, {
  //     sortPairs: true,
  //   });

  //   console.log("---------");
  //   console.log("Merke Tree");
  //   console.log("---------");
  //   console.log(merkleTree.toString());
  //   console.log("---------");
  //   console.log("Merkle Root: " + merkleTree.getHexRoot());

  //   console.log("Proof 1: " + merkleTree.getHexProof(leafNodes[0]));
  //   console.log("Proof 2: " + merkleTree.getHexProof(leafNodes[1]));

  //   const verified = merkleTree.verify(
  //     merkleTree.getHexProof(leafNodes[0]),
  //     leafNodes[0],
  //     merkleTree.getHexRoot()
  //   );

  //   alert(verified ? "Verified" : "Not Verified");
  // };

  const sell = async () => {
    if (!address) return;
    const salt = genRandomNumber(8, 10);
    const types = {
      Asset: [
        { name: "assetType", type: "uint8" },
        { name: "contractAddress", type: "address" },
        { name: "value", type: "uint256" },
        { name: "id", type: "uint256" },
      ],
      Fee: [
        { name: "receiver", type: "address" },
        { name: "amount", type: "uint96" },
      ],
      Order: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "int256" },
        { name: "end", type: "int256" },
      ],
    } as const;

    const encodedData = encodeAbiParameters(
      [
        { name: "maker", type: "address" },
        { name: "makeAssetType", type: "uint8" },
        { name: "makeAssetContract", type: "address" },
        { name: "makeAssetValue", type: "uint256" },
        { name: "makeAssetId", type: "uint256" },
        { name: "taker", type: "address" },
        { name: "takeAssetType", type: "uint8" },
        { name: "takeAssetContract", type: "address" },
        { name: "takeAssetValue", type: "uint256" },
        { name: "takeAssetId", type: "uint256" },
      ],
      [
        address,
        3,
        "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
        BigInt(1),
        id,
        "0x0000000000000000000000000000000000000000",
        2,
        "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
        BigInt("1000000000000000000"),
        BigInt(0),
      ]
    );

    const sig = await signTypedDataAsync({
      account: address,
      domain: {
        chainId: 2484,
        name: "U2U",
        version: "1",
      },
      types,
      primaryType: "Order",
      message: {
        maker: address,
        makeAsset: {
          assetType: 3,
          contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
          value: BigInt(1),
          id,
        },
        taker: "0x0000000000000000000000000000000000000000",
        takeAsset: {
          assetType: 2,
          contractAddress: "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
          value: BigInt("1000000000000000000"),
          id: BigInt(0),
        },
        salt: BigInt(salt),
        start: BigInt(0),
        end: BigInt(1729678393),
      },
    });

    await fetch("http://localhost:3001/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maker: address,
        makeAsset: {
          assetType: 3,
          contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
          value: BigInt(1).toString(),
          id: id.toString(),
        },
        takeAsset: {
          assetType: 2,
          contractAddress: "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
          value: BigInt("1000000000000000000").toString(),
          id: BigInt(0).toString(),
        },
        salt: salt.toString(),
        start: "0",
        end: "1729678393",
        sig,
        type: "SELL",
        data: encodedData,
      }),
    });
  };

  const bid = async () => {
    if (!address) return;
    const salt = genRandomNumber(8, 10);
    const types = {
      Asset: [
        { name: "assetType", type: "uint8" },
        { name: "contractAddress", type: "address" },
        { name: "value", type: "uint256" },
        { name: "id", type: "uint256" },
      ],
      Fee: [
        { name: "receiver", type: "address" },
        { name: "amount", type: "uint96" },
      ],
      Order: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "int256" },
        { name: "end", type: "int256" },
      ],
    } as const;

    const encodedData = encodeAbiParameters(
      [
        { name: "maker", type: "address" },
        { name: "makeAssetType", type: "uint8" },
        { name: "makeAssetContract", type: "address" },
        { name: "makeAssetValue", type: "uint256" },
        { name: "makeAssetId", type: "uint256" },
        { name: "taker", type: "address" },
        { name: "takeAssetType", type: "uint8" },
        { name: "takeAssetContract", type: "address" },
        { name: "takeAssetValue", type: "uint256" },
        { name: "takeAssetId", type: "uint256" },
      ],
      [
        address,
        2,
        "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
        BigInt("3000000000000000000"),
        BigInt(0),
        "0xF0b612FD9C9B4e1518F867818a0f72BB2159959f",
        3,
        "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
        BigInt(1),
        id,
      ]
    );

    const sig = await signTypedDataAsync({
      account: address,
      domain: {
        chainId: 2484,
        name: "U2U",
        version: "1",
      },
      types,
      primaryType: "Order",
      message: {
        maker: address,
        makeAsset: {
          assetType: 2,
          contractAddress: "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
          value: BigInt("3000000000000000000"),
          id: BigInt(0),
        },
        taker: "0xF0b612FD9C9B4e1518F867818a0f72BB2159959f",
        takeAsset: {
          assetType: 3,
          contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
          value: BigInt(1),
          id,
        },
        salt: BigInt(salt),
        start: BigInt(0),
        end: BigInt(1729678393),
      },
    });

    await fetch("http://localhost:3001/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maker: address,
        makeAsset: {
          assetType: 2,
          contractAddress: "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
          value: BigInt("3000000000000000000").toString(),
          id: BigInt(0).toString(),
        },
        taker: "0xF0b612FD9C9B4e1518F867818a0f72BB2159959f",
        takeAsset: {
          assetType: 3,
          contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
          value: BigInt(1).toString(),
          id: id.toString(),
        },
        salt: salt.toString(),
        start: "0",
        end: "1729678393",
        sig,
        data: encodedData,
        type: "BID",
      }),
    });
  };

  // const cancel = async () => {
  //   await writeContract({
  //     abi,
  //     address: exchangeContract,
  //     functionName: "cancelOrder",
  //     args: [
  //       {
  //         order: {
  //           maker: address,
  //           makeAsset: {
  //             assetType: 3,
  //             contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //             value: BigInt(1),
  //             id,
  //           },
  //           taker: "0x0000000000000000000000000000000000000000",
  //           takeAsset: {
  //             assetType: 1,
  //             contractAddress: "0x0000000000000000000000000000000000000000",
  //             value: BigInt("1000000000000000000"),
  //             id: BigInt(0),
  //           },
  //           salt,
  //           start: BigInt(0),
  //           end: BigInt(1729678393),
  //           data: "0x000000000000000000000000f0b612fd9c9b4e1518f867818a0f72bb2159959f00000000000000000000000000000000000000000000000000000000000000030000000000000000000000001b122eff77d9a54d6c773c971f6acb6aaa9f90a80000000000000000000000000000000000000000000000000000000000000001f0b612fd9c9b4e1518f867818a0f72bb2159959f0000000000000000000007710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
  //           originFee: {
  //             receiver: exchangeContract,
  //             amount: BigInt("500"),
  //           },
  //         },
  //         nonce: orderId,
  //         sig,
  //       },
  //     ],
  //   });
  // };

  // const testMultiSell = () => {
  //   if (!address) return;
  //   const orders: CreateBulkOrderItemInput[] = [
  //     {
  //       maker: address,
  //       makeAsset: {
  //         assetType: 3,
  //         contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //         value: BigInt(1),
  //         id: id.toString(),
  //       },
  //       takeAsset: {
  //         assetType: 1,
  //         contractAddress: "0x0000000000000000000000000000000000000000",
  //         value: BigInt("1000000000000000000"),
  //         id: BigInt(0).toString(),
  //       },
  //       salt: BigInt(genRandomNumber(8, 10)),
  //       start: "0",
  //       end: "1729678393",
  //     },
  //     {
  //       maker: address,
  //       makeAsset: {
  //         assetType: 3,
  //         contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //         value: BigInt(1),
  //         id: id.toString(),
  //       },
  //       takeAsset: {
  //         assetType: 1,
  //         contractAddress: "0x0000000000000000000000000000000000000000",
  //         value: BigInt("1000000000000000000"),
  //         id: BigInt(0).toString(),
  //       },
  //       salt: BigInt(genRandomNumber(8, 10)),
  //       start: "0",
  //       end: "1729678383",
  //     },
  //   ];
  //   // const tree = new Eip712MerkleTree(orders);
  //   // alert(tree.getRoot());
  // };

  // const signBulkOrder = async () =>
  //   // orderComponents: CreateBulkOrderItemInput[],
  //   // startIndex = 0,
  //   // height?: number,
  //   // extraCheap?: boolean
  //   {
  //     if (!address) return;
  //     const orderComponents: CreateBulkOrderItemInput[] = [
  //       {
  //         maker: address,
  //         makeAsset: {
  //           assetType: 3,
  //           contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //           value: BigInt(1),
  //           id: id.toString(),
  //         },
  //         taker: "0x0000000000000000000000000000000000000000",
  //         takeAsset: {
  //           assetType: 1,
  //           contractAddress: "0x0000000000000000000000000000000000000000",
  //           value: BigInt("1000000000000000000"),
  //           id: BigInt(0).toString(),
  //         },
  //         salt: BigInt(genRandomNumber(8, 10)),
  //         start: "0",
  //         end: "1729678393",
  //       },
  //       {
  //         maker: address,
  //         makeAsset: {
  //           assetType: 3,
  //           contractAddress: "0x1b122EFF77D9A54d6c773C971F6ACB6AAA9f90a8",
  //           value: BigInt(1),
  //           id: id.toString(),
  //         },
  //         taker: "0x0000000000000000000000000000000000000000",
  //         takeAsset: {
  //           assetType: 1,
  //           contractAddress: "0x0000000000000000000000000000000000000000",
  //           value: BigInt("5500000000000000000"),
  //           id: BigInt(5).toString(),
  //         },
  //         salt: BigInt(genRandomNumber(8, 10)),
  //         start: "0",
  //         end: "1729678453",
  //       },
  //     ];
  //     const tree = new Eip712MerkleTree<CreateBulkOrderItemInput>(
  //       orderComponents,
  //       {
  //         Asset: [
  //           { name: "assetType", type: "uint8" },
  //           { name: "contractAddress", type: "address" },
  //           { name: "value", type: "uint256" },
  //           { name: "id", type: "uint256" },
  //         ],
  //         Order: [
  //           { name: "maker", type: "address" },
  //           { name: "makeAsset", type: "Asset" },
  //           { name: "taker", type: "address" },
  //           { name: "takeAsset", type: "Asset" },
  //           { name: "salt", type: "uint256" },
  //           { name: "start", type: "int256" },
  //           { name: "end", type: "int256" },
  //         ],
  //       }
  //     );
  //     const chunks = tree.getDataToSign();
  //     const signature = await signTypedDataAsync({
  //       account: address,
  //       domain: {
  //         chainId: 2484,
  //         name: "U2U",
  //         version: "1",
  //       },
  //       types: {
  //         Asset: [
  //           { name: "assetType", type: "uint8" },
  //           { name: "contractAddress", type: "address" },
  //           { name: "value", type: "uint256" },
  //           { name: "id", type: "uint256" },
  //         ],
  //         Fee: [
  //           { name: "receiver", type: "address" },
  //           { name: "amount", type: "uint96" },
  //         ],
  //         Order: [
  //           { name: "maker", type: "address" },
  //           { name: "makeAsset", type: "Asset" },
  //           { name: "taker", type: "address" },
  //           { name: "takeAsset", type: "Asset" },
  //           { name: "salt", type: "uint256" },
  //           { name: "start", type: "int256" },
  //           { name: "end", type: "int256" },
  //         ],
  //         BulkOrder: [
  //           {
  //             name: "Orders",
  //             type: "Order[]",
  //           },
  //         ],
  //       },
  //       primaryType: "BulkOrder",
  //       message: {
  //         Orders: [...chunks],
  //       },
  //     });
  //     const root = tree.getRoot();
  //     const { proof } = tree.getProof(0);
  //     const encodedProof = encodeProof(0, proof , signature);
  //     console.log({encodedProof});
  //     console.log({ signature });
  //   };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={sell}>sell</button>
      <button onClick={bid}>Bid</button>
      {/* <button onClick={signBulkOrder}>Test tree</button> */}
    </div>
  );
}
