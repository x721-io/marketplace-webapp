export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "value",
            type: "uint96",
          },
        ],
        indexed: false,
        internalType: "struct LibStructsMarketplace.Part[]",
        name: "royalties",
        type: "tuple[]",
      },
    ],
    name: "RoyaltiesSetForContract",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getRoyalties",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "value",
            type: "uint96",
          },
        ],
        internalType: "struct LibStructsMarketplace.Part[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getRoyaltiesByToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "value",
            type: "uint96",
          },
        ],
        internalType: "struct LibStructsMarketplace.Part[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getRoyaltiesType",
    outputs: [
      {
        internalType: "enum LibStructsMarketplace.RoyaltiesType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "initializeRoyaltiesByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "removeRoyaltiesByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "royaltiesByToken",
    outputs: [
      {
        internalType: "bool",
        name: "initialized",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "value",
            type: "uint96",
          },
        ],
        internalType: "struct LibStructsMarketplace.Part[]",
        name: "royalties",
        type: "tuple[]",
      },
    ],
    name: "setRoyaltiesByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
