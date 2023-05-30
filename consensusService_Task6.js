// Date : 30th May 2023
// Create a script to create a consensus transaction on the Hedera Consensus Service using Account1 or Account2.
// Write protect the topic and make sure it is not publicly writable.
// Write the current time in the message of the transaction and submit from Account2.

const dotenv = require("dotenv");
dotenv.config();
const {
    TopicCreateTransaction,
    Client,
    PrivateKey,
    TopicMessageSubmitTransaction,
    Status,
    AccountId,
    Hbar
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const ACCOUNT3 = utils.loadCreds("ACCOUNT3");

account2Id = ACCOUNT2.ACCOUNT_ID;
account2PrivateKey = ACCOUNT2.PRIVATE_KEY;
account3Id = ACCOUNT3.ACCOUNT_ID;
account3PrivateKey = ACCOUNT3.PRIVATE_KEY;

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Initiating a consensus transaction on the Hedera Consensus Service...");
    console.log("Embedding the current time in the transaction message and submitting the transaction...");

    const client = Client.forTestnet();
    client.setOperator(account2Id, account2PrivateKey);

    //Create a new topic with adminKey as account2 to write protect it
    console.log("Creating a new topic...");
    let txResponse = await new TopicCreateTransaction()
        .setAdminKey(PrivateKey.fromString(account2PrivateKey))
        .execute(client);

    //Get the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);

    //Grab the new topic ID from the receipt
    let topicId = receipt.topicId;

    //Log the topic ID
    console.log(`Topic created successfully and write protected! Your topic ID is: ${topicId}`);

    // Submit a message to the topic that specifies the current time as of submission
    console.log("Submitting a message to the topic...");
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: `Current time as of submitting this message: ${new Date().toLocaleString()}`,
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the message submission
    const transactionStatus = getReceipt.status;
    console.log("Message submitted successfully from Account2! The message transaction status: " + transactionStatus);

    // Attempt to submit a message from Account3, which should fail as the topic is write protected.
    console.log("Attempting to submit a message from Account3...");
    client.setOperator(account3Id, account3PrivateKey);
    try {
        await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: `This message attempt should fail as the topic is write protected.`,
        }).execute(client);
    } catch (err) {
        console.log("Message submission from Account3 failed as expected due to write protection! Error: " + err);
    }

    console.log("Script execution completed successfully!");
    process.exit();
}

main();
