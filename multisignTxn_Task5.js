const dotenv = require("dotenv");
dotenv.config();
const {
    Client,
    PrivateKey,
    Hbar,
    AccountCreateTransaction,
    AccountBalanceQuery,
    ThresholdKey,
    TransferTransaction,
    AccountId,
    KeyList
} = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");

const OPERATOR_ACCOUNT = utils.loadAccountCredentials();
const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const ACCOUNT3 = utils.loadCreds("ACCOUNT3");
const ACCOUNT4 = utils.loadCreds("ACCOUNT4");

async function main() {
    const client = Client.forTestnet();
    client.setOperator(OPERATOR_ACCOUNT.ACCOUNT_ID, OPERATOR_ACCOUNT.PRIVATE_KEY);

    const keyList = [
        PrivateKey.fromString(ACCOUNT1.PRIVATE_KEY).publicKey,
        PrivateKey.fromString(ACCOUNT2.PRIVATE_KEY).publicKey,
        PrivateKey.fromString(ACCOUNT3.PRIVATE_KEY).publicKey,
    ];

    // const newAccountPublicKey = new KeyList(keyList);
    const newAccountPublicKey = new KeyList(keyList, 2); // Specify a threshold of 2



    const response = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(new Hbar(20))
        .execute(client);


   const newAccountId = (await response.getReceipt(client)).accountId;

    console.log(`Created account with ID: ${newAccountId}`);
    // Step 2: Create transaction to transfer 10 Hbar to Account4 and sign it with Account1 only
    console.log(`Creating transaction to transfer 10 Hbar to Account4 and signing it with Account1 only`);

    const transactionId = await new TransferTransaction()
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(-10)) // Subtracting 10 hbars from new account
        .addHbarTransfer(ACCOUNT4.ACCOUNT_ID, Hbar.fromTinybars(10)) // Adding 10 hbars to Account4
        .freezeWith(client);

    transactionId.sign(PrivateKey.fromString(ACCOUNT1.PRIVATE_KEY));

    try {
        await transactionId.execute(client);
        console.log(`The transfer of 10 Hbar to Account4 should have failed as we signed it with Account1 only.`);
    } catch (error) {
        console.log('Error, the transfer failed as expected:', error.toString());
    }

    // Step 3: Create transaction to transfer 10 Hbar to Account4, sign it with Account1 and Account2
    console.log(`Creating transaction to transfer 10 Hbar to Account4, signing it with Account1 and Account2`);

    const transactionId2 = await new TransferTransaction()
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(-10)) // Subtracting 10 hbars from new account
        .addHbarTransfer(ACCOUNT4.ACCOUNT_ID, Hbar.fromTinybars(10)) // Adding 10 hbars to Account4
        .freezeWith(client);

    transactionId2.sign(PrivateKey.fromString(ACCOUNT1.PRIVATE_KEY));
    transactionId2.sign(PrivateKey.fromString(ACCOUNT2.PRIVATE_KEY));

    try {
        const response = await transactionId2.execute(client);
        console.log(`The transfer of 10 Hbar to Account4 was successful.`);
    } catch (error) {
        console.log('Error, the transfer should have succeeded:', error.toString());
    }

    // Show Account4 balance
    // Show Account4 balance
    const balance = await new AccountBalanceQuery()
        .setAccountId(ACCOUNT4.ACCOUNT_ID)
        .execute(client);

    console.log(`Account4 balance is: ${balance.hbars.toString()}`);
}

main();

