const dotenv = require("dotenv");
dotenv.config();
// Include necessary libraries
const {
    TokenCreateTransaction,
    Client,
    TokenType,
    TokenInfoQuery,
    TokenAssociateTransaction,
    TokenGrantKycTransaction,
    TransferTransaction,
    AccountBalanceQuery,
    PrivateKey,
    Wallet,
    TokenSupplyType,
    CustomRoyaltyFee,
    withHbar
} = require("@hashgraph/sdk");

const { FixedFee, Hbar } = require("@hashgraph/sdk");
const utils = require("./utils/utils.js");



// Load Account2 credentials
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const account2Id = ACCOUNT2.ACCOUNT_ID;
const account2PrivateKey = PrivateKey.fromString(ACCOUNT2.PRIVATE_KEY);

// Set up account2Client
const account2Client = Client.forTestnet();
account2Client.setOperator(account2Id, account2PrivateKey);

async function main() {
    console.log(`Script Execution Date & Time: ${new Date().toLocaleString()}`);
    console.log("Creating a non-fungible token with Account2...");

    // let fallbackFee = FixedFee.withHbar(new Hbar(200), account2Id);

    const tokenCreateTransaction = new TokenCreateTransaction()
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setInitialSupply(0)
        .setMaxSupply(5)
        .setTokenName("MyNFT")
        .setTokenSymbol("NFT")
        .setTreasuryAccountId(account2Id)
        .setAdminKey(account2PrivateKey.publicKey)
        .setFreezeKey(account2PrivateKey.publicKey)
        .setWipeKey(account2PrivateKey.publicKey)
        .setKycKey(account2PrivateKey.publicKey)
        .setSupplyKey(account2PrivateKey.publicKey)
        // .setCustomFees([
        //     new CustomRoyaltyFee()
        //         .setNumerator(1)
        //         .setDenominator(10)
        //         .setFallbackFee(fallbackFee)
        //         .setFeeCollectorAccountId(account2Id)
        // ]);

    const txResponse = await tokenCreateTransaction.execute(account2Client);
    const receipt = await txResponse.getReceipt(account2Client);
    const newTokenId = receipt.tokenId;

    console.log("New NFT created with ID: " + newTokenId);
}

main();
