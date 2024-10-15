"use client";

import { readContract, signTypedData, writeContract } from "wagmi/actions";
import { Address, encodeAbiParameters } from "viem";
import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { genRandomNumber } from "../test-new-sell/page";
import { ADDRESS_ZERO } from "@/config/constants";
import { Eip712MerkleTree, TestType } from "../test-new-sell/Eip721MerkleTree";

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
          {
            type: "uint8",
            name: "orderType",
            internalType: "enum X721Order.OrderType",
          },
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
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
        name: "order",
        internalType: "struct X721Order.Order",
        components: [
          {
            type: "uint8",
            name: "orderType",
            internalType: "enum X721Order.OrderType",
          },
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
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
            name: "bidOrder",
            internalType: "struct X721Order.Order",
            components: [
              {
                type: "uint8",
                name: "orderType",
                internalType: "enum X721Order.OrderType",
              },
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
              { type: "bytes", name: "sig", internalType: "bytes" },
              { type: "bytes32", name: "root", internalType: "bytes32" },
              { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
              { type: "int16", name: "index", internalType: "int16" },
            ],
          },
          {
            type: "tuple",
            name: "sellOrder",
            internalType: "struct X721Order.Order",
            components: [
              {
                type: "uint8",
                name: "orderType",
                internalType: "enum X721Order.OrderType",
              },
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
              { type: "bytes", name: "sig", internalType: "bytes" },
              { type: "bytes32", name: "root", internalType: "bytes32" },
              { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
              { type: "int16", name: "index", internalType: "int16" },
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
        name: "orderLefts",
        internalType: "struct X721Order.Order[]",
        components: [
          {
            type: "uint8",
            name: "orderType",
            internalType: "enum X721Order.OrderType",
          },
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
        ],
      },
      {
        type: "tuple[]",
        name: "orderRights",
        internalType: "struct X721Order.Order[]",
        components: [
          {
            type: "uint8",
            name: "orderType",
            internalType: "enum X721Order.OrderType",
          },
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
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
  {
    type: "function",
    stateMutability: "pure",
    outputs: [{ type: "bool", name: "isValid", internalType: "bool" }],
    name: "validateListing",
    inputs: [
      { type: "bytes32", name: "root", internalType: "bytes32" },
      { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
      {
        type: "tuple",
        name: "order",
        internalType: "struct X721Order.Order",
        components: [
          {
            type: "uint8",
            name: "orderType",
            internalType: "enum X721Order.OrderType",
          },
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
        ],
      },
    ],
  },
] as const;

export type ListingItem = {
  index: number;
  id: string;
  amount: string;
  price: string;
};

export default function TestMerkle() {
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();
  const exchangeContract = "0x4Ca21c461Ee818e4B880D86991aF43dC873B7F1f";
  const items: TestType[] = [
    {
      index: 0,
      maker: address ?? ADDRESS_ZERO,
      makeAssetAddress: "0x0000000000000000000000000000000000000000",
      makeAssetId: BigInt(0),
      makeAssetValue: BigInt(1),
      makeAssetType: BigInt(3),
      taker: "0x0000000000000000000000000000000000000000",
      takeAssetAddress: "0x0000000000000000000000000000000000000000",
      takeAssetId: BigInt(0),
      takeAssetValue: BigInt(1),
      takeAssetType: BigInt(3),
    },
    {
      index: 1,
      maker: address ?? ADDRESS_ZERO,
      makeAssetAddress: "0x0000000000000000000000000000000000000000",
      makeAssetId: BigInt(1),
      makeAssetValue: BigInt(1),
      makeAssetType: BigInt(3),
      taker: "0x0000000000000000000000000000000000000000",
      takeAssetAddress: "0x0000000000000000000000000000000000000000",
      takeAssetId: BigInt(0),
      takeAssetValue: BigInt(1),
      takeAssetType: BigInt(3),
    },
  ];

  const generateTree = () => {
    const tree = new Eip712MerkleTree(items);
  };

  const verify = async () => {
    if (!address) return;
  };

  const signTree = async () => {
    if (!address) return;
    const types = {
      Listing: [{ name: "root", type: "bytes32" }],
      BulkOrder: [
        { name: "maker", type: "address" },
        { name: "root", type: "bytes32" },
      ],
    } as const;

    const tree = new Eip712MerkleTree(items);

    const root = tree.tree.root;
    const sig = await signTypedDataAsync({
      account: address,
      domain: {
        chainId: 2484,
        name: "U2U",
        version: "1",
      },
      types,
      primaryType: "BulkOrder",
      message: {
        maker: address,
        root: root as any,
      },
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={generateTree}>Generate tree</button>
      <button onClick={verify}>Verify</button>
      <button onClick={signTree}>Sign</button>
    </div>
  );
}
