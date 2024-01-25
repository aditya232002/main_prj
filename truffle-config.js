// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // for more about customizing your Truffle configuration!
//   networks: {
//     sepolia: {
//       provider: () => new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/ba3171acde5e4cec9f95bf659825c7b2`),
//       network_id: 11155111,       // Ropsten's id
//       gas: 200000,        // Ropsten has a lower block limit than mainnet
//       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
//       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
//       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
//     }
//   }
// };


const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "hammer business table spray runway immense strike turtle drastic pretty excite comic"; // Replace with your own mnemonic

module.exports = {
  networks: { 
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, 'https://sepolia.infura.io/v3/f7bfeea4692e4c7f8f62a9497e76d210'),
      network_id: 11155111, // Sepolia's chain ID
      gas: 4000000, // Adjust gas limit as needed
      gasPrice: 1000000000, // Set an appropriate gas price
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
};
