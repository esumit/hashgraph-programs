const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractFunctionParameters,
    ContractCallQuery,
    ContractExecuteTransaction
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadCreds("ACCOUNT1");
const SMART_CONTRACT_ID = "0.0.13715121";

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    // Create the transaction to call function1
    const transaction = new ContractCallQuery()
        .setContractId(SMART_CONTRACT_ID)
        .setGas(100000)
        .setFunction("function1", new ContractFunctionParameters().addUint16(4).addUint16(3));

    // Execute the transaction and retrieve the result
    const txResponse = await transaction.execute(client);
    const result = txResponse.getUint16(0);
    console.log("The result of function1 is", result);

    // Create a transaction to call function2 with the result from function1
    const transaction2 = new ContractExecuteTransaction()
        .setContractId(SMART_CONTRACT_ID)
        .setGas(100000)
        .setFunction("function2", new ContractFunctionParameters().addUint16(result));

    // Execute the transaction and retrieve the result
    const txResponse2 = await transaction2.execute(client);
    const receipt2 = await txResponse2.getReceipt(client);
    const record2 = await receipt2.getRecord(client);
    const result2 = record2.contractExecuteResult.getUint16(0);
    console.log("The result of function2 is", result2);

    process.exit();
}

main();
