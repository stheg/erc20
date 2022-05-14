# erc20

My implementation of ERC20 token.

Steps to start:
- use 'npm install' in your console to install all dependencies
- create your own .env file with your private keys (see .env.example)
- check the hardhat.config.ts to see the configuration and 
how your private keys are used there

- local deployment:
--- use 'npx hardhat node --network hardhat' in you console #1 to start your local blockchain node.
--- use 'npx hardhat run .\scripts\deploy.ts --network localhost' in your console #2 to deploy the contract using test account

- rinkeby test network deployment:
--- use 'npx hardhat run .\scripts\deploy.ts --network rinkeby' in your console to deploy the contract to the rinkeby test network using your own test account

!!! ATTENTION
Project uses type-system generated for the contract by typechain.
You can find generated files in a typechaing-types directory.
In case the directory is absent (i.e. after npx hardhat clean) the compilation task won't work, and you should comment out the next lines for tasks in hardhat.config.ts:
```
import "./tasks/subtask-init-contract";
import "./tasks/tasks-write";
import "./tasks/tasks-read";
```
After the contract is compiled the typechain-directory must appear.
Uncomment the lines with tasks back and use them to interact with a deployed contract
!!!

This project demonstrates a basic Hardhat use case.

Try running some of the following tasks:

```shell
Common tasks:

  accounts      Prints the list of accounts
  check         Check whatever you need
  clean         Clears the cache and deletes all artifacts
  compile       Compiles the entire project, building all artifacts
  console       Opens a hardhat console
  coverage      Generates a code coverage report for tests
  flatten       Flattens and prints contracts and their dependencies
  help          Prints this message
  node          Starts a JSON-RPC server on top of Hardhat Network
  run           Runs a user-defined script after compiling the project
  test          Runs mocha tests
  verify        Verifies contract on Etherscan

Interaction with the contract:
  allowance     Returns amount which the spender can spend from someone balance
  approve       Sets the amount which the spender can transfer from someone balance
  balance       Transfers the amount of tokens to the specified address
  burn          Burns tokens and refunds ether
  mint          Changes ether to tokens
  transfer      Transfers the amount of tokens to the specified address
  transfer-from The spender transfers from the approved from-address to the to-address
```
