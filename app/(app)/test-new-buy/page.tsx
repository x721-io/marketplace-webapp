"use client";

import { writeContract } from "wagmi/actions";
import { Address, encodeAbiParameters } from "viem";
import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { genRandomNumber } from "../test-new-sell/page";

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
    name: "CancelOrder",
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
    name: "FillOrder",
    inputs: [
      {
        type: "address",
        name: "maker",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "taker",
        internalType: "address",
        indexed: false,
      },
      { type: "bytes", name: "sig", internalType: "bytes", indexed: false },
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
          {
            type: "tuple",
            name: "royaltyFee",
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
              {
                type: "tuple",
                name: "royaltyFee",
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
    stateMutability: "payable",
    outputs: [],
    name: "directAcceptBid",
    inputs: [
      {
        type: "tuple",
        name: "direct",
        internalType: "struct LibDirectTransfer.AcceptBid",
        components: [
          {
            type: "tuple",
            name: "bidInput",
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
                      {
                        type: "uint256",
                        name: "value",
                        internalType: "uint256",
                      },
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
                      {
                        type: "uint256",
                        name: "value",
                        internalType: "uint256",
                      },
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
                      {
                        type: "uint96",
                        name: "amount",
                        internalType: "uint96",
                      },
                    ],
                  },
                  {
                    type: "tuple",
                    name: "royaltyFee",
                    internalType: "struct X721Order.Fee",
                    components: [
                      {
                        type: "address",
                        name: "receiver",
                        internalType: "address",
                      },
                      {
                        type: "uint96",
                        name: "amount",
                        internalType: "uint96",
                      },
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
            type: "tuple",
            name: "sellInput",
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
                      {
                        type: "uint256",
                        name: "value",
                        internalType: "uint256",
                      },
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
                      {
                        type: "uint256",
                        name: "value",
                        internalType: "uint256",
                      },
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
                      {
                        type: "uint96",
                        name: "amount",
                        internalType: "uint96",
                      },
                    ],
                  },
                  {
                    type: "tuple",
                    name: "royaltyFee",
                    internalType: "struct X721Order.Fee",
                    components: [
                      {
                        type: "address",
                        name: "receiver",
                        internalType: "address",
                      },
                      {
                        type: "uint96",
                        name: "amount",
                        internalType: "uint96",
                      },
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
              {
                type: "tuple",
                name: "royaltyFee",
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
              {
                type: "tuple",
                name: "royaltyFee",
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

export type Order = {
  id: number;
  created_at: string;
  maker: Address;
  make_asset_type: number;
  make_asset_address: Address;
  make_asset_value: string;
  make_asset_id: string;
  take_asset_type: number;
  take_asset_address: Address;
  take_asset_value: string;
  take_asset_id: string;
  salt: string;
  start: string;
  end: string;
  nonce: number;
  sig: string;
  data: string;
  taker: string;
  type: "SELL" | "BID";
  status: "OPEN " | "FILLED" | "CANCELLED";
};

export type OrderAsset = {
  assetType: number;
  contractAddress: Address;
  value: bigint;
  id: string;
};

export type CreateBulkOrderItemInput = {
  maker: Address;
  makeAsset: OrderAsset;
  takeAsset: OrderAsset;
  start: string;
  end: string;
};

export default function TestNewBuy() {
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();
  const exchangeContract = "0x10b03e09f0A60634cA5889F7a5c26db60715CBC7";
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      const response = await fetch("http://localhost:3001/get-orders", {
        method: "GET",
      });
      const json = await response.json();
      setOrders(json);
    };
    getOrders();
  }, []);

  const buyAll = async () => {
    if (!address) return;
    const leftInputs: any[] = [];
    const rightInputs: any[] = [];
    orders.forEach((order) => {
      leftInputs.push({
        order: {
          maker: order.maker as Address,
          makeAsset: {
            assetType: order.make_asset_type,
            contractAddress: order.make_asset_address as Address,
            value: BigInt(order.make_asset_value),
            id: BigInt(order.make_asset_id),
          },
          taker: "0x0000000000000000000000000000000000000000",
          takeAsset: {
            assetType: order.take_asset_type,
            contractAddress: order.take_asset_address as Address,
            value: BigInt(order.take_asset_value),
            id: BigInt(order.take_asset_id),
          },
          data: order.data as Address,
          salt: BigInt(order.salt),
          start: BigInt(order.start),
          end: BigInt(order.end),
          originFee: {
            receiver: exchangeContract,
            amount: BigInt("500"),
          },
        },
        nonce: BigInt(order.nonce.toString()),
        sig: order.sig as Address,
      });
      rightInputs.push({
        order: {
          maker: address,
          makeAsset: {
            assetType: order.take_asset_type,
            contractAddress: order.take_asset_address as Address,
            value: BigInt(order.take_asset_value),
            id: BigInt(order.take_asset_id),
          },
          taker: order.maker as Address,
          takeAsset: {
            assetType: order.make_asset_type,
            contractAddress: order.make_asset_address as Address,
            value: BigInt(order.make_asset_value),
            id: BigInt(order.make_asset_id),
          },
          salt: BigInt(0),
          start: BigInt(order.start),
          end: BigInt(order.end),
          originFee: {
            receiver: exchangeContract,
            amount: BigInt("500"),
          },
          data: "0x",
        },
        nonce: BigInt(order.nonce.toString()),
        sig: order.sig as Address,
      });
    });

    console.log(leftInputs);

    await writeContract({
      abi,
      address: exchangeContract,
      functionName: "matchOrders",
      value: BigInt("2000000000000000000"),
      args: [
        [
          {
            order: {
              maker: orders[0].maker as Address,
              makeAsset: {
                assetType: orders[0].make_asset_type,
                contractAddress: orders[0].make_asset_address as Address,
                value: BigInt(orders[0].make_asset_value),
                id: BigInt(orders[0].make_asset_id),
              },
              taker: "0x0000000000000000000000000000000000000000",
              takeAsset: {
                assetType: orders[0].take_asset_type,
                contractAddress: orders[0].take_asset_address as Address,
                value: BigInt(orders[0].take_asset_value),
                id: BigInt(orders[0].take_asset_id),
              },
              data: orders[0].data as Address,
              salt: BigInt(orders[0].salt),
              start: BigInt(orders[0].start),
              end: BigInt(orders[0].end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
            },
            nonce: BigInt(orders[0].nonce.toString()),
            sig: orders[0].sig as Address,
          },
          {
            order: {
              maker: orders[1].maker as Address,
              makeAsset: {
                assetType: orders[1].make_asset_type,
                contractAddress: orders[1].make_asset_address as Address,
                value: BigInt(orders[1].make_asset_value),
                id: BigInt(orders[1].make_asset_id),
              },
              taker: "0x0000000000000000000000000000000000000000",
              takeAsset: {
                assetType: orders[1].take_asset_type,
                contractAddress: orders[1].take_asset_address as Address,
                value: BigInt(orders[1].take_asset_value),
                id: BigInt(orders[1].take_asset_id),
              },
              data: orders[1].data as Address,
              salt: BigInt(orders[1].salt),
              start: BigInt(orders[1].start),
              end: BigInt(orders[1].end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
            },
            nonce: BigInt(orders[1].nonce.toString()),
            sig: orders[1].sig as Address,
          },
        ],
        [
          {
            order: {
              maker: address,
              makeAsset: {
                assetType: orders[0].take_asset_type,
                contractAddress: orders[0].take_asset_address as Address,
                value: BigInt(orders[0].take_asset_value),
                id: BigInt(orders[0].take_asset_id),
              },
              taker: orders[0].maker as Address,
              takeAsset: {
                assetType: orders[0].make_asset_type,
                contractAddress: orders[0].make_asset_address as Address,
                value: BigInt(orders[0].make_asset_value),
                id: BigInt(orders[0].make_asset_id),
              },
              salt: BigInt(0),
              start: BigInt(orders[0].start),
              end: BigInt(orders[0].end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              data: "0x",
            },
            nonce: BigInt(orders[0].nonce.toString()),
            sig: orders[0].sig as Address,
          },
          {
            order: {
              maker: address,
              makeAsset: {
                assetType: orders[1].take_asset_type,
                contractAddress: orders[1].take_asset_address as Address,
                value: BigInt(orders[1].take_asset_value),
                id: BigInt(orders[1].take_asset_id),
              },
              taker: orders[1].maker as Address,
              takeAsset: {
                assetType: orders[1].make_asset_type,
                contractAddress: orders[1].make_asset_address as Address,
                value: BigInt(orders[1].make_asset_value),
                id: BigInt(orders[1].make_asset_id),
              },
              salt: BigInt(0),
              start: BigInt(orders[1].start),
              end: BigInt(orders[1].end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              data: "0x",
            },
            nonce: BigInt(orders[1].nonce.toString()),
            sig: orders[1].sig as Address,
          },
        ],
      ],
    });
  };

  const buy = async (order: Order) => {
    if (!address) return;
    await writeContract({
      abi,
      address: exchangeContract,
      functionName: "matchOrders",
      args: [
        [
          {
            order: {
              maker: order.maker as Address,
              makeAsset: {
                assetType: order.make_asset_type,
                contractAddress: order.make_asset_address as Address,
                value: BigInt(order.make_asset_value),
                id: BigInt(order.make_asset_id),
              },
              taker: "0x0000000000000000000000000000000000000000",
              takeAsset: {
                assetType: order.take_asset_type,
                contractAddress: order.take_asset_address as Address,
                value: BigInt(order.take_asset_value),
                id: BigInt(order.take_asset_id),
              },
              data: order.data as Address,
              salt: BigInt(order.salt),
              start: BigInt(order.start),
              end: BigInt(order.end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: "0xD1167a4f576155f8B074fb0a4DED3B22C5590af4",
                amount: BigInt("500"),
              },
            },
            nonce: BigInt(order.nonce.toString()),
            sig: order.sig as Address,
          },
        ],
        [
          {
            order: {
              maker: address,
              makeAsset: {
                assetType: order.take_asset_type,
                contractAddress: order.take_asset_address as Address,
                value: BigInt(order.take_asset_value),
                id: BigInt(order.take_asset_id),
              },
              taker: order.maker as Address,
              takeAsset: {
                assetType: order.make_asset_type,
                contractAddress: order.make_asset_address as Address,
                value: BigInt(order.make_asset_value),
                id: BigInt(order.make_asset_id),
              },
              salt: BigInt(0),
              start: BigInt(order.start),
              end: BigInt(order.end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: "0xD1167a4f576155f8B074fb0a4DED3B22C5590af4",
                amount: BigInt("500"),
              },
              data: "0x",
            },
            nonce: BigInt(order.nonce.toString()),
            sig: order.sig as Address,
          },
        ],
      ],
    });
  };

  const acceptBid = async (order: Order) => {
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
        order.take_asset_type,
        order.take_asset_address as Address,
        BigInt(order.take_asset_value),
        BigInt(order.take_asset_id),
        "0x0000000000000000000000000000000000000000",
        order.make_asset_type,
        order.make_asset_address,
        BigInt(order.make_asset_value),
        BigInt(order.make_asset_id),
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
          assetType: order.take_asset_type,
          contractAddress: order.take_asset_address as Address,
          value: BigInt(order.take_asset_value),
          id: BigInt(order.take_asset_id),
        },
        taker: "0x0000000000000000000000000000000000000000",
        takeAsset: {
          assetType: order.make_asset_type,
          contractAddress: order.make_asset_address as Address,
          value: BigInt(order.make_asset_value),
          id: BigInt(order.make_asset_id),
        },
        salt: BigInt(0),
        start: BigInt(order.start),
        end: BigInt(order.end),
      },
    });

    await writeContract({
      abi,
      address: exchangeContract,
      functionName: "directAcceptBid",
      args: [
        {
          bidInput: {
            order: {
              maker: order.maker as Address,
              makeAsset: {
                assetType: order.make_asset_type,
                contractAddress: order.make_asset_address as Address,
                value: BigInt(order.make_asset_value),
                id: BigInt(order.make_asset_id),
              },
              taker: order.taker as Address,
              takeAsset: {
                assetType: order.take_asset_type,
                contractAddress: order.take_asset_address as Address,
                value: BigInt(order.take_asset_value),
                id: BigInt(order.take_asset_id),
              },
              data: order.data as Address,
              salt: BigInt(order.salt),
              start: BigInt(order.start),
              end: BigInt(order.end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
            },
            nonce: BigInt(order.nonce.toString()),
            sig: order.sig as Address,
          },
          sellInput: {
            order: {
              maker: order.taker as Address,
              makeAsset: {
                assetType: order.take_asset_type,
                contractAddress: order.take_asset_address as Address,
                value: BigInt(order.take_asset_value),
                id: BigInt(order.take_asset_id),
              },
              taker: "0x0000000000000000000000000000000000000000",
              takeAsset: {
                assetType: order.make_asset_type,
                contractAddress: order.make_asset_address as Address,
                value: BigInt(order.make_asset_value),
                id: BigInt(order.make_asset_id),
              },
              data: "0x",
              salt: BigInt(0),
              start: BigInt(order.start),
              end: BigInt(order.end),
              originFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
              royaltyFee: {
                receiver: exchangeContract,
                amount: BigInt("500"),
              },
            },
            nonce: BigInt(order.nonce.toString()),
            sig: sig,
          },
        },
      ],
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {orders?.length > 0 &&
        orders.map((o) => (
          <div key={o.id}>
            {o.id}. {o.maker}, {o.take_asset_value} | &nbsp;
            <button
              onClick={() => {
                if (o.type === "SELL") {
                  buy(o);
                } else {
                  acceptBid(o);
                }
              }}
            >
              {o.type === "SELL" ? "Buy" : "Accept bid"}
            </button>
          </div>
        ))}
      <button onClick={buyAll}>Buy all</button>
    </div>
  );
}
