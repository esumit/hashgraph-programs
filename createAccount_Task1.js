// Date : 30th May 2023
// Create a script to generate 5 Hedera Testnet accounts (Account1, Account2, Account3, Account4 and Account5).

const dotenv = require("dotenv");
dotenv.config();
const {
    Client,
    AccountCreateTransaction,
    TransferTransaction,
    Hbar,
    PrivateKey,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY } = utils.loadAccountCredentials();

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Generating five Hedera Testnet accounts: Account1, Account2, Account3, Account4, and Account5...");

    const client = Client.forTestnet();
    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    const accounts = {};

    for (let i = 1; i <= 5; i++) {
        const key = await PrivateKey.generateED25519Async();
        const publicKey = key.publicKey;

        const transaction = new AccountCreateTransaction()
            .setKey(publicKey);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        const newAccountId = receipt.accountId;

        // Save account details to object
        accounts[`ACCOUNT${i}`] = {
            ID: newAccountId.toString(),
            PUBLIC_KEY: publicKey.toStringDer(),
            PRIVATE_KEY: key.toStringDer()
        };
    }

    // Now fund all accounts in a single transaction
    const totalFundsRequired = 500; // Total funds required to distribute among the accounts, adjust as needed
    const balanceQuery = new AccountBalanceQuery().setAccountId(ACCOUNT_ID);
    const balance = await balanceQuery.execute(client);
    if (balance.hbars.toTinybars() < totalFundsRequired) {
        console.log('The operator account does not have enough Hbars to execute the transfers. Please add more funds and try again.');
        process.exit();
    }

    const transferTransaction = new TransferTransaction()
        .addHbarTransfer(ACCOUNT_ID, new Hbar(totalFundsRequired).negated()); // Deducting total funds from operator account

    for (let i = 1; i <= 5; i++) {
        transferTransaction.addHbarTransfer(accounts[`ACCOUNT${i}`].ID, new Hbar(100)); // Transfer 100 Hbar to each account
    }

    await transferTransaction.execute(client);
    // const transferTransaction = new TransferTransaction();
    // for (let i = 1; i <= 5; i++) {
    //     transferTransaction.addHbarTransfer(accounts[`ACCOUNT${i}`].ID, new Hbar(50)); // Transfer 100 Hbar to each account
    // }
    // await transferTransaction.execute(client);

    // Print all account info
    for (let i = 1; i <= 5; i++) {
        const { ID, PUBLIC_KEY, PRIVATE_KEY } = accounts[`ACCOUNT${i}`];

        console.log(`ACCOUNT${i}_ID=${ID}`);
        console.log(`ACCOUNT${i}_PUBLIC_KEY=${PUBLIC_KEY}`);
        console.log(`ACCOUNT${i}_PRIVATE_KEY=${PRIVATE_KEY}`);
        console.log();
    }

    process.exit();
}

main();


