export default [
  {
    "type": "constructor",
    "stateMutability": "nonpayable",
    "inputs": [{ "type": "address", "name": "_collection", "internalType": "address" }]
  }, {
    "type": "event",
    "name": "AddWhitelisted",
    "inputs": [{ "type": "address", "name": "user", "internalType": "address", "indexed": true }, {
      "type": "bool",
      "name": "status",
      "internalType": "bool",
      "indexed": false
    }],
    "anonymous": false
  }, {
    "type": "event",
    "name": "Claimed",
    "inputs": [{ "type": "address", "name": "user", "internalType": "address", "indexed": true }],
    "anonymous": false
  }, {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32", "indexed": true }, {
      "type": "bytes32",
      "name": "previousAdminRole",
      "internalType": "bytes32",
      "indexed": true
    }, { "type": "bytes32", "name": "newAdminRole", "internalType": "bytes32", "indexed": true }],
    "anonymous": false
  }, {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32", "indexed": true }, {
      "type": "address",
      "name": "account",
      "internalType": "address",
      "indexed": true
    }, { "type": "address", "name": "sender", "internalType": "address", "indexed": true }],
    "anonymous": false
  }, {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32", "indexed": true }, {
      "type": "address",
      "name": "account",
      "internalType": "address",
      "indexed": true
    }, { "type": "address", "name": "sender", "internalType": "address", "indexed": true }],
    "anonymous": false
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bytes32", "name": "", "internalType": "bytes32" }],
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": []
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bytes32", "name": "", "internalType": "bytes32" }],
    "name": "WHITELIST_ADMIN",
    "inputs": []
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "addWhitelist",
    "inputs": [{ "type": "address", "name": "_user", "internalType": "address" }, {
      "type": "bool",
      "name": "_status",
      "internalType": "bool"
    }]
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "addWhitelistBatch",
    "inputs": [{ "type": "address[]", "name": "_users", "internalType": "address[]" }, {
      "type": "bool[]",
      "name": "_statuses",
      "internalType": "bool[]"
    }]
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "claim",
    "inputs": []
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "address", "name": "", "internalType": "address" }],
    "name": "collection",
    "inputs": []
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bytes32", "name": "", "internalType": "bytes32" }],
    "name": "getRoleAdmin",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "address", "name": "", "internalType": "address" }],
    "name": "getRoleMember",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }, {
      "type": "uint256",
      "name": "index",
      "internalType": "uint256"
    }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }],
    "name": "getRoleMemberCount",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }]
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "grantRole",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }, {
      "type": "address",
      "name": "account",
      "internalType": "address"
    }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }],
    "name": "hasRole",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }, {
      "type": "address",
      "name": "account",
      "internalType": "address"
    }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }],
    "name": "isClaimed",
    "inputs": [{ "type": "address", "name": "_user", "internalType": "address" }]
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "renounceRole",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }, {
      "type": "address",
      "name": "account",
      "internalType": "address"
    }]
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "revokeRole",
    "inputs": [{ "type": "bytes32", "name": "role", "internalType": "bytes32" }, {
      "type": "address",
      "name": "account",
      "internalType": "address"
    }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }],
    "name": "totalClaimed",
    "inputs": []
  }, {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "updateCollectionAddress",
    "inputs": [{ "type": "address", "name": "_collection", "internalType": "address" }]
  }, {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }],
    "name": "whitelistedUsers",
    "inputs": [{ "type": "address", "name": "", "internalType": "address" }]
  }
] as const;
