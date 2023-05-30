# hashgraph-programs
#### Hedera Hashgraph Development Environment Setup
###### Last updated: 30th May 2023
Setting up a development environment for the Hedera Hashgraph SDK and , 
a brief overview of running hashgraph scripts.

#### Prerequisites

- Node.js
- npm (Node Package Manager)
- nvm (Node Version Manager)
- nvm --version     # Should be v18.9.1 or above
- node -v           # Should be v18.9.1 or above
- npm -version      # Should be v8.19.1 or above

####Project Setup

- Initialize a new Node.js project with npm init -y.
- Install the necessary dependencies with npm install --save @hashgraph/sdk dotenv.
- After completing these steps, please review the generated package.json file to ensure all dependencies are listed correctly.

#### Output of Tasks

The results of the tasks can be found in the following files:

- results/setup_outputTask1.txt
- results/nft_outputTask2.txt
- results/smartcontract_outputTask3.txt
- results/schTxn_outputTask3.txt
- results/multisig_outputTask5.txt
- results/consensus_outputTask6.txt


#### Environment Variables
 ACCOUNT_IDs, Private/Public Keys, Schedule_ID, etc., in the .env file.

#### Running Scripts
node script.js. 

