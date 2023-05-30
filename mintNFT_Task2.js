const dotenv = require("dotenv");
dotenv.config();
// Include necessary libraries
const {
    Client,
    TransferTransaction,
    PrivateKey,
    TokenMintTransaction,
    TokenAssociateTransaction
} = require("@hashgraph/sdk");

const utils = require("./utils/utils.js");
// Load Account2 credentials
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const account2Id = ACCOUNT2.ACCOUNT_ID;
const account2PrivateKey = PrivateKey.fromString(ACCOUNT2.PRIVATE_KEY);


const ACCOUNT3 = utils.loadCreds("ACCOUNT3");
const account3Id = ACCOUNT3.ACCOUNT_ID;
const account3PrivateKey = PrivateKey.fromString(ACCOUNT3.PRIVATE_KEY);

// Set up account2Client
const account2Client = Client.forTestnet();
account2Client.setOperator(account2Id, account2PrivateKey);

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Minting NFTs and transferring one to Account3...");

    // const associateTransaction = new TokenAssociateTransaction()
    //     .setAccountId(account2Id)
    //     .setTokenIds(["0.0.13714657"]);
    //
    // const txResponse = await associateTransaction.execute(account2Client);
    // await txResponse.getReceipt(account2Client);


    // Mint all 5 NFTs
    for (let i = 1; i <= 5; i++) {
        const metadata = new TextEncoder().encode(`NFT ${i}`);
        const mintTransaction = new TokenMintTransaction()
            .setTokenId("0.0.13714657")
            .addMetadata(metadata);

        // Sign the transaction with the token's supply key
        mintTransaction.freezeWith(account2Client);
        mintTransaction.sign(account2PrivateKey);

        // Execute the transaction
        const mintTxResponse = await mintTransaction.execute(account2Client);
        const mintReceipt = await mintTxResponse.getReceipt(account2Client);
        const newSerialNumber = mintReceipt.serials[0];

        // Send the second NFT to Account3
        if (i === 2) {
            const transferTransaction = new TransferTransaction()
                .addNftTransfer("0.0.13714657", newSerialNumber, account2Id, account3Id);

            // Sign the transaction with the token's supply key
            transferTransaction.freezeWith(account2Client);
            transferTransaction.sign(account2PrivateKey);

            // Execute the transaction
            const transferTxResponse = await transferTransaction.execute(account2Client);
            await transferTxResponse.getReceipt(account2Client);

            console.log(`Transferred NFT ${i} to Account3.`);
        }
    }

    console.log("Minting and transfer completed.");
}

main();
