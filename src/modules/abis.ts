const ABIS = {
    sendThroughDonationRelay: {
        "inputs": [
          {
            "internalType": "address",
            "name": "_recipientAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_benefactorNftAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_benefactorNftTokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_postId",
            "type": "uint256"
          }
        ],
        "name": "send",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
}

export default ABIS