// Date : 30th May 2023
// Print out the schedule information along the way along with the proof that the transfer did not happen.
// If to execute the transaction and then it does not work.
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    TransferTransaction,
    ScheduleCreateTransaction,
    Hbar,
    PrivateKey,
    ScheduleInfoQuery,
    AccountId,
    Timestamp,
    TransactionReceiptQuery,
    TransactionId
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");

const SCHEDULE_ID = process.env['SCHEDULE_ID'];


async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Displaying schedule information and validating the transfer did not occur...");
    console.log("Attempting to execute the transaction, should it not function as expected...");
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT1.ACCOUNT_ID, ACCOUNT1.PRIVATE_KEY);
    console.log(`Checking the scheduled transaction with ID: ${SCHEDULE_ID}...`);
    //Create the query
    const query = new ScheduleInfoQuery()
    .setScheduleId(SCHEDULE_ID);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log("The schedule transaction details:");
    console.log(info);

    // Verify if the transaction has been executed or not
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log(`The scheduled transaction with ID: ${SCHEDULE_ID} has not been executed yet.`);
    } else {
        console.log(`The scheduled transaction with ID: ${SCHEDULE_ID} has been executed at: `, new Timestamp(info.executed).toDate());
    }

    // If transaction is not executed yet, try to execute it
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log(`Trying to execute the scheduled transaction with ID: ${SCHEDULE_ID}...`);
        // The logic for executing the transaction goes here
        // Be sure to handle any exceptions that could occur during transaction execution
        try {
            const transactionId = TransactionId.fromString(info.scheduledTransactionId.toString()); // Use info.scheduledTransactionId.toString() instead of info.transactionId
            await new TransactionReceiptQuery()
                .setTransactionId(transactionId)
                .execute(client);
        } catch (error) {
            console.log("Failed to execute the scheduled transaction:", error.message);
        }
    }

    process.exit();
}

main();



