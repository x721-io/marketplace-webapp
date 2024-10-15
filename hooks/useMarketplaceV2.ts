import { Order } from "@/app/(app)/test-new-buy/page";
import { ADDRESS_ZERO } from "@/config/constants";
import { contracts } from "@/config/contracts";
import { nextAPI } from "@/services/api";
import { APIResponse } from "@/services/api/types";
import { Web3Functions } from "@/services/web3";
import { FormState, MarketEventV2, NFT } from "@/types";
import { ta } from "date-fns/locale";
import { parse } from "path";
import { useState } from "react";
import { Address, encodeAbiParameters, parseUnits } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { writeContract } from "wagmi/actions";

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
      { type: "int16", name: "index", internalType: "int16", indexed: false },
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
      { type: "int16", name: "index", internalType: "int16", indexed: false },
      {
        type: "uint256",
        name: "currentFilledValue",
        internalType: "uint256",
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
          { type: "bytes", name: "sig", internalType: "bytes" },
          { type: "bytes32", name: "root", internalType: "bytes32" },
          { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
          { type: "int16", name: "index", internalType: "int16" },
        ],
      },
    ],
  },
] as const;

const erc20ABI = [
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "string", name: "" }],
    name: "name",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [{ type: "bool", name: "" }],
    name: "approve",
    inputs: [
      { type: "address", name: "guy" },
      { type: "uint256", name: "wad" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "" }],
    name: "totalSupply",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [{ type: "bool", name: "" }],
    name: "transferFrom",
    inputs: [
      { type: "address", name: "src" },
      { type: "address", name: "dst" },
      { type: "uint256", name: "wad" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "withdraw",
    inputs: [{ type: "uint256", name: "wad" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint8", name: "" }],
    name: "decimals",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "" }],
    name: "balanceOf",
    inputs: [{ type: "address", name: "" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "string", name: "" }],
    name: "symbol",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [{ type: "bool", name: "" }],
    name: "transfer",
    inputs: [
      { type: "address", name: "dst" },
      { type: "uint256", name: "wad" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "payable",
    payable: true,
    outputs: [],
    name: "deposit",
    inputs: [],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "" }],
    name: "allowance",
    inputs: [
      { type: "address", name: "" },
      { type: "address", name: "" },
    ],
    constant: true,
  },
  { type: "fallback", stateMutability: "payable", payable: true },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { type: "address", name: "src", indexed: true },
      { type: "address", name: "guy", indexed: true },
      { type: "uint256", name: "wad", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { type: "address", name: "src", indexed: true },
      { type: "address", name: "dst", indexed: true },
      { type: "uint256", name: "wad", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { type: "address", name: "dst", indexed: true },
      { type: "uint256", name: "wad", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdrawal",
    inputs: [
      { type: "address", name: "src", indexed: true },
      { type: "uint256", name: "wad", indexed: false },
    ],
    anonymous: false,
  },
] as const;

export const contractNFTTransferProxy =
  "0x0f4aDd504070aA16eFb52777D7ab60CfE0EC8aE7";
export const contractERC20TransferProxy =
  "0x04893e14B9c943088e1a1420A516a68216009ab7";
export const contractExchangeV2Test =
  "0x5Ef45F98349e960753B768333c6f6F12169b8361";

const useMarketplaceV2 = (nft: NFT) => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [isApproving, setApproving] = useState(false);
  const [isSigningOrderData, setIsSigningOrderData] = useState(false);
  const [isCreatingOrder, setCreatingOrder] = useState(false);

  const getCollectionType = (): "ERC721" | "ERC1155" | null => {
    if (nft.collection.type !== "ERC721" && nft.collection.type !== "ERC1155")
      return null;
    return nft.collection.type;
  };

  const checkIfApprovedForAll = async () => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const type = getCollectionType();
    if (!type) return false;
    try {
      const isApproveForAll =
        type === "ERC721"
          ? await Web3Functions.readContract({
              abi: contracts.erc721Base.abi,
              functionName: "isApprovedForAll",
              address: collectionAddress,
              args: [address, contractNFTTransferProxy],
            })
          : await Web3Functions.readContract({
              abi: contracts.erc1155Base.abi,
              functionName: "isApprovedForAll",
              address: collectionAddress,
              args: [address, contractNFTTransferProxy],
            });
      return isApproveForAll;
    } catch (err) {
      return false;
    }
  };

  const getERC20Allowance = async (tokenAddress: Address) => {
    if (!address || !tokenAddress) return BigInt(0);
    try {
      const allowance = await Web3Functions.readContract({
        abi: erc20ABI,
        functionName: "allowance",
        address: tokenAddress,
        args: [address, contractERC20TransferProxy],
      });
      return BigInt(allowance.toString());
    } catch (err) {
      return BigInt(0);
    }
  };

  const approveERC20TokenAmt = async (
    tokenAddress: Address,
    amount: bigint
  ): Promise<boolean> => {
    if (!address || !tokenAddress) return false;
    try {
      await Web3Functions.writeContract({
        abi: erc20ABI,
        functionName: "approve",
        address: tokenAddress,
        args: [contractERC20TransferProxy, amount],
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const getERC20Balance = async (tokenAddress: Address) => {
    if (!address || !tokenAddress) return BigInt(0);
    try {
      const balance = await Web3Functions.readContract({
        abi: erc20ABI,
        functionName: "balanceOf",
        address: tokenAddress,
        args: [address],
      });
      return BigInt(balance.toString());
    } catch (err) {
      return BigInt(0);
    }
  };

  const approveAll = async () => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const type = getCollectionType();
    if (!type) return false;
    try {
      const result =
        type === "ERC721"
          ? await Web3Functions.writeContract({
              abi: contracts.erc721Base.abi,
              functionName: "setApprovalForAll",
              address: collectionAddress,
              args: [contractNFTTransferProxy, true],
            })
          : await Web3Functions.writeContract({
              abi: contracts.erc1155Base.abi,
              functionName: "setApprovalForAll",
              address: collectionAddress,
              args: [contractNFTTransferProxy, true],
            });
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const deposit = async (tokenAddress: Address, depositAmt: string) => {
    if (!address) return false;
    try {
      const result = await Web3Functions.writeContract({
        abi: erc20ABI,
        functionName: "deposit",
        address: tokenAddress,
        args: [],
        value: BigInt(depositAmt),
      });
      return true;
    } catch (err: any) {
      alert(err);
      return false;
    }
  };

  const getTokenAssetType = (tokenAddress: Address): 1 | 2 => {
    return tokenAddress === ADDRESS_ZERO ? 1 : 2;
  };

  const getNftAssetType = (): 3 | 4 => {
    return nft.collection.type === "ERC721" ? 3 : 4;
  };

  const getSellOrderEncodedData = (params: FormState.SellNFT) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken } = params;
    const takeValue = parseUnits(price.toString(), 18);

    return encodeAbiParameters(
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
        getNftAssetType(),
        collectionAddress,
        BigInt(quantity),
        BigInt(nft.u2uId ?? nft.id),
        "0x0000000000000000000000000000000000000000",
        getTokenAssetType(quoteToken),
        quoteToken,
        takeValue,
        BigInt(0),
      ]
    );
  };

  const getBidOrderEncodedData = (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData
  ) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken } = params;
    const takeValue = parseUnits(price.toString(), 18);

    return encodeAbiParameters(
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
        getTokenAssetType(quoteToken),
        quoteToken,
        takeValue,
        BigInt(0),
        marketData.owners[0].signer,
        getNftAssetType(),
        collectionAddress,
        BigInt(quantity),
        BigInt(nft.u2uId ?? nft.id),
      ]
    );
  };

  const signSellOrderData = async (params: FormState.SellNFT) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken, start, end, salt } = params;
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
    const totalPrice =
      parseFloat(price.toString()) + parseFloat(price.toString()) * 0.0125;
    const takeValue = parseUnits(totalPrice.toString(), 18);
    try {
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
            assetType: getNftAssetType(),
            contractAddress: collectionAddress,
            value: BigInt(quantity),
            id: BigInt(nft.u2uId ?? nft.id),
          },
          taker: "0x0000000000000000000000000000000000000000",
          takeAsset: {
            assetType: getTokenAssetType(quoteToken),
            contractAddress: quoteToken,
            value: takeValue,
            id: BigInt(0),
          },
          salt: BigInt(salt),
          start: BigInt(start),
          end: BigInt(end),
        },
      });
      return sig;
    } catch (err: any) {
      return null;
    }
  };

  const signBidOrderData = async (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData
  ) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken, start, end, salt } = params;
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
      Bid: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "int256" },
        { name: "end", type: "int256" },
      ],
    } as const;
    const bidValue =
      parseFloat(price.toString()) + parseFloat(price.toString()) * 0.0125;
    const bidValueWei = parseUnits(bidValue.toString(), 18);
    try {
      const sig = await signTypedDataAsync({
        account: address,
        domain: {
          chainId: 2484,
          name: "U2U",
          version: "1",
        },
        types,
        primaryType: "Bid",
        message: {
          maker: address,
          makeAsset: {
            assetType: getTokenAssetType(quoteToken),
            contractAddress: quoteToken,
            value: bidValueWei,
            id: BigInt(0),
          },
          taker: marketData.owners[0].signer,
          takeAsset: {
            assetType: getNftAssetType(),
            contractAddress: collectionAddress,
            value: BigInt(quantity),
            id: BigInt(nft.u2uId ?? nft.id),
          },
          salt: BigInt(salt),
          start: BigInt(start),
          end: BigInt(end),
        },
      });
      return sig;
    } catch (err: any) {
      return null;
    }
  };

  const createSellAPI = async (
    params: FormState.SellNFT,
    sig: `0x${string}`
  ) => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { end, price, quantity, quoteToken, start, salt } = params;
    const makeAsset = {
      assetType: getNftAssetType(),
      contractAddress: collectionAddress,
      value: BigInt(quantity).toString(),
      id: nft.u2uId ?? nft.id,
    };
    const takeAsset = {
      assetType: getTokenAssetType(quoteToken),
      contractAddress: quoteToken,
      value: parseUnits(params.totalPrice.toString(), 18),
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
    try {
      const body = {
        makeAssetType: make_asset_type,
        makeAssetId: make_asset_id.toString(),
        makeAssetAddress: make_asset_address,
        makeAssetValue: make_asset_value.toString(),
        taker: ADDRESS_ZERO,
        takeAssetType: take_asset_type,
        takeAssetAddress: take_asset_address,
        takeAssetValue: take_asset_value.toString(),
        takeAssetId: take_asset_id.toString(),
        salt: salt.toString(),
        start: start.toString(),
        end: end.toString(),
        sig,
        orderType: "SINGLE",
        price: parseUnits(price.toString(), 18).toString(),
        totalPice: take_asset_value.toString(),
        netPrice: parseUnits(params.netPrice.toString(), 18).toString(),
      };
      console.log({ body });
      await nextAPI.post("/order/single", body);
      return true;
    } catch (err) {
      alert(err);
      return false;
    }
  };

  const createBidAPI = async (
    params: FormState.BidNFT,
    sig: `0x${string}`,
    taker: Address
  ) => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { end, price, quantity, quoteToken, start, salt } = params;
    const makeAsset = {
      assetType: getTokenAssetType(quoteToken),
      contractAddress: quoteToken,
      value: parseUnits(params.totalPrice.toString(), 18),
      id: BigInt(0).toString(),
    };
    const takeAsset = {
      assetType: getNftAssetType(),
      contractAddress: collectionAddress,
      value: BigInt(quantity).toString(),
      id: nft.u2uId ?? nft.id,
    };
    const {
      assetType: make_asset_type,
      contractAddress: make_asset_address,
      value: make_asset_value,
      id: make_asset_id,
    } = takeAsset;
    const {
      assetType: take_asset_type,
      contractAddress: take_asset_address,
      value: take_asset_value,
      id: take_asset_id,
    } = makeAsset;
    try {
      const body = {
        makeAssetType: make_asset_type,
        makeAssetId: make_asset_id.toString(),
        makeAssetAddress: make_asset_address,
        makeAssetValue: make_asset_value.toString(),
        taker,
        takeAssetType: take_asset_type,
        takeAssetAddress: take_asset_address,
        takeAssetValue: take_asset_value.toString(),
        takeAssetId: take_asset_id.toString(),
        salt: salt.toString(),
        start: start.toString(),
        end: end.toString(),
        sig,
        orderType: "BID",
        price: make_asset_value.toString(),
        netPrice: parseUnits(params.netPrice.toString(), 18).toString(),
      };
      await nextAPI.post("/order/single", body);
      return true;
    } catch (err) {
      alert(err);
      return false;
    }
  };

  const createSellOrder = async (
    params: FormState.SellNFT,
    onApproveSuccess: () => void,
    onSignSuccess: () => void,
    onCreateOrderAPISuccess: () => void,
    onRequestError: (
      requestType: "approve" | "sign" | "create_order_api",
      error: Error
    ) => void
  ): Promise<boolean> => {
    if (!address) return false;

    const isApproved = await checkIfApprovedForAll();
    if (!isApproved) {
      setApproving(true);
      const result = await approveAll();
      setApproving(false);
      if (!result) {
        onRequestError("approve", new Error("Failed to approve"));
        return false;
      }
    }
    onApproveSuccess();

    // const encodedData = getSellOrderEncodedData(params);
    // if (!encodedData) return false;

    setIsSigningOrderData(true);
    const sig = await signSellOrderData(params);
    setIsSigningOrderData(false);
    if (!sig) {
      onRequestError("sign", new Error("Failed to sign order data"));
      return false;
    }
    onSignSuccess();

    setCreatingOrder(true);
    // const result = false;
    const result = await createSellAPI(params, sig);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    setCreatingOrder(false);
    if (!result) {
      onRequestError("create_order_api", new Error("Failed to create order"));
      return false;
    }
    onCreateOrderAPISuccess();
    return result;
  };

  const createBidOrder = async (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData,
    onApproveERC20Success: () => void,
    onSignSuccess: () => void,
    onCreateOrderAPISuccess: () => void,
    onRequestError: (
      requestType: "approve" | "sign" | "create_order_api",
      error: Error
    ) => void
  ): Promise<boolean> => {
    if (!address) return false;
    const { quoteToken, totalPrice } = params;
    const allowance = await getERC20Allowance(quoteToken);
    if (totalPrice > allowance) {
      setApproving(true);
      const result = await approveERC20TokenAmt(
        params.quoteToken,
        parseUnits(totalPrice.toString(), 18)
      );
      setApproving(false);
      if (!result) return false;
    }
    onApproveERC20Success();

    // const encodedData = getBidOrderEncodedData(params, nft, marketData);
    // if (!encodedData) return false;

    setIsSigningOrderData(true);
    const sig = await signBidOrderData(params, nft, marketData);
    setIsSigningOrderData(false);
    if (!sig) {
      onRequestError("sign", new Error("Failed to sign bid data"));
      return false;
    }
    onSignSuccess();

    setCreatingOrder(true);
    const result = await createBidAPI(params, sig, marketData.owners[0].signer);
    if (!result) {
      onRequestError("create_order_api", new Error("Failed to create order"));
      return false;
    }
    setCreatingOrder(false);
    onCreateOrderAPISuccess();
    return result;
  };

  const getOrderTypeIndex = (order: MarketEventV2) => {
    switch (order.orderType) {
      case "SINGLE":
        return 0;
      case "BULK":
        return 1;
      case "BID":
        return 2;
    }
  };

  const buySingle = async (order: MarketEventV2) => {
    if (!address || !order.Maker) return;
    if (order.quoteToken !== ADDRESS_ZERO) {
      const allowance = await getERC20Allowance(order.takeAssetAddress);
      if (allowance < BigInt(order.takeAssetValue)) {
        await approveERC20TokenAmt(
          order.takeAssetAddress,
          BigInt(order.takeAssetValue)
        );
      }
    }

    await writeContract({
      abi,
      address: contractExchangeV2Test,
      functionName: "matchOrders",
      value:
        order.takeAssetType == 1 ? BigInt(order.takeAssetValue) : BigInt(0),
      args: [
        [
          {
            orderType: getOrderTypeIndex(order),
            maker: order.Maker.signer,
            makeAsset: {
              assetType: order.makeAssetType,
              contractAddress: order.makeAssetAddress as Address,
              value: BigInt(order.makeAssetValue),
              id: BigInt(order.makeAssetId),
            },
            taker: "0x0000000000000000000000000000000000000000",
            takeAsset: {
              assetType: order.takeAssetType,
              contractAddress: order.takeAssetAddress as Address,
              value: BigInt(order.takeAssetValue),
              id: BigInt(order.takeAssetId),
            },
            salt: BigInt(order.salt),
            start: BigInt(order.start),
            end: BigInt(order.end),
            originFee: {
              receiver: contractExchangeV2Test,
              amount: BigInt("500"),
            },
            royaltyFee: {
              receiver: order.Maker.signer,
              amount: BigInt("0"),
            },
            index: 0,
            proof: [],
            root: order.root as Address,
            sig: "0x",
          },
        ],
        [
          {
            orderType: 0,
            maker: address,
            makeAsset: {
              assetType: order.takeAssetType,
              contractAddress: order.takeAssetAddress as Address,
              value: BigInt(order.takeAssetValue),
              id: BigInt(order.takeAssetId),
            },
            taker: order.Maker.signer as Address,
            takeAsset: {
              assetType: order.makeAssetType,
              contractAddress: order.makeAssetAddress as Address,
              value: BigInt(order.makeAssetValue),
              id: BigInt(order.makeAssetId),
            },
            salt: BigInt(0),
            start: BigInt(order.start),
            end: BigInt(order.end),
            originFee: {
              receiver: contractExchangeV2Test,
              amount: BigInt("500"),
            },
            royaltyFee: {
              receiver: order.Maker.signer,
              amount: BigInt("0"),
            },
            index: 0,
            proof: [],
            root: order.root as Address,
            sig: order.sig as Address,
          },
        ],
      ],
    });
  };

  const cancelOrder = async (order: MarketEventV2) => {
    if (!address || !order.Maker) return;
    await writeContract({
      abi,
      address: contractExchangeV2Test,
      functionName: "cancelOrder",
      args: [
        {
          orderType: getOrderTypeIndex(order),
          maker: order.Maker.signer,
          makeAsset: {
            assetType: order.makeAssetType,
            contractAddress: order.makeAssetAddress as Address,
            value: BigInt(order.makeAssetValue),
            id: BigInt(order.makeAssetId),
          },
          taker: "0x0000000000000000000000000000000000000000",
          takeAsset: {
            assetType: order.takeAssetType,
            contractAddress: order.takeAssetAddress as Address,
            value: BigInt(order.takeAssetValue),
            id: BigInt(order.takeAssetId),
          },
          salt: BigInt(order.salt),
          start: BigInt(order.start),
          end: BigInt(order.end),
          originFee: {
            receiver: contractExchangeV2Test,
            amount: BigInt("500"),
          },
          royaltyFee: {
            receiver: order.Maker.signer,
            amount: BigInt("0"),
          },
          index: 0,
          proof: [],
          root: order.root as Address,
          sig: "0x",
        },
      ],
    });
  };

  return {
    getERC20Allowance,
    createSellOrder,
    getERC20Balance,
    cancelOrder,
    createBidOrder,
    deposit,
    approveAll,
    buySingle,
    signSellOrderData,
    checkIfApprovedForAll,
    isApproving,
    isSigningOrderData,
    isCreatingOrder,
  };
};

export default useMarketplaceV2;
