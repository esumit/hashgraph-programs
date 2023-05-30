// Date : 30th May 2023
// Deletes the scheduled transaction
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ScheduleDeleteTransaction,
    ScheduleInfoQuery,
    PrivateKey
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const ACCOUNT = utils.loadAccountCredentials();
const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");

const SCHEDULE_ID = process.env['SCHEDULE_ID'];

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Proceeding to remove the scheduled transaction...");
    // Create our connection to the Hedera network
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT.ACCOUNT_ID, ACCOUNT.PRIVATE_KEY);

    // Query for the scheduled transaction info
    console.log(`Querying the scheduled transaction with ID: ${SCHEDULE_ID}...`);
    const query = new ScheduleInfoQuery()
    .setScheduleId(SCHEDULE_ID);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log("The schedule transaction details:");
    console.log(info);

    // Delete the scheduled transaction
    console.log(`Deleting the scheduled transaction with ID: ${SCHEDULE_ID}...`);
    //Create the transaction and sign with the admin key
    const transaction = await new ScheduleDeleteTransaction()
        .setScheduleId(SCHEDULE_ID)
        .freezeWith(client)
        .sign(PrivateKey.fromString(ACCOUNT.PRIVATE_KEY));

    // Execute the deletion transaction
    const txResponse = await transaction.execute(client);

    //Get the transaction receipt
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is: " + transactionStatus);
    if(transactionStatus.toString() === "SUCCESS") {
        console.log(`The scheduled transaction with ID: ${SCHEDULE_ID} has been successfully deleted.`);
    } else {
        console.log(`Failed to delete the scheduled transaction with ID: ${SCHEDULE_ID}. Status: ${transactionStatus}`);
    }
    process.exit();
}

main();



