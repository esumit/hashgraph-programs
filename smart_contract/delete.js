const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractDeleteTransaction,
    PrivateKey,
    ContractInfoQuery
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadCreds("ACCOUNT2");
const SMART_CONTRACT_ID = process.env['SMART_CONTRACT_ID'];

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    // //Create the query
    // const query = new ContractInfoQuery()
    // .setContractId(SMART_CONTRACT_ID);

    // //Sign the query with the client operator private key and submit to a Hedera network
    // const info = await query.execute(client);

    // console.log(info);
    // process.exit();

    //Delete the Contract
    const transaction = await new ContractDeleteTransaction()
    .setContractId(SMART_CONTRACT_ID)
    .setTransferAccountId(ACCOUNT_ID)
    .freezeWith(client);

    //Sign with the admin key on the contract
    const signTx = await transaction.sign(PrivateKey.fromString(PRIVATE_KEY));

    //Submit the transaction to a Hedera network

    //Sign the transaction with the client operator's private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);


    process.exit();
}

main();





