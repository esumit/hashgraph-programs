// Date : 30th May 2023
// Create a script that creates a scheduled transaction of 2 hbar from Account1 to Account2.
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
    TransactionReceiptQuery,
    ScheduleId,
    Timestamp
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const ACCOUNT = utils.loadAccountCredentials();
const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");

const SCHEDULE_ID = process.env['SCHEDULE_ID'];

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Setting up a scheduled transaction to transfer 2 hbar from Account1 to Account2...");

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT.ACCOUNT_ID, ACCOUNT.PRIVATE_KEY);

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(ACCOUNT1.ACCOUNT_ID, Hbar.fromTinybars(-2))
        .addHbarTransfer(ACCOUNT2.ACCOUNT_ID, Hbar.fromTinybars(2))

    console.log(`Scheduled transfer of 2 HBAR from ${ACCOUNT1.ACCOUNT_ID} to ${ACCOUNT2.ACCOUNT_ID} is being created...`);

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setScheduleMemo("Scheduled TX test" + (Math.floor(Math.random() * 100)))
        .setAdminKey(PrivateKey.fromString(ACCOUNT.PRIVATE_KEY))
        .execute(client);

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The Schedule ID of the created transaction is: " + scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.log("The ID of the scheduled transaction is: " + scheduledTxId);


    console.log("Transaction status: ", receipt.status.toString());

    // Query the schedule info
    console.log("Querying the schedule info...");
    const query = new ScheduleInfoQuery()
    .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log("Schedule info:");
    console.log("Scheduled ID: ", new ScheduleId(info.scheduleId).toString());
    console.log("Memo: ", info.scheduleMemo);
    console.log("Created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("Paid by: ", new AccountId(info.payerAccountId).toString());
    console.log("Expiration time: ", new Timestamp(info.expirationTime).toDate());

    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet.");
    } else {
        console.log("Execution time: ", new Timestamp(info.executed).toDate());
    }

    process.exit();
}

main();



