const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractCreateTransaction,
    PrivateKey,
    Hbar
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadCreds("ACCOUNT1");

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    const contractString = await fs.readFile("./artifacts/2_smart_contract/contracts/certificationC3.sol/CertificationC1.json");
    console.log(contractString);
    let contract = JSON.parse(contractString);
    const bytecode = contract.bytecode;

    //Create the transaction
    const contractCreate = new ContractCreateTransaction()
        .setGas(100_000_000)
        .setAdminKey(PrivateKey.fromString(PRIVATE_KEY))
        .setBytecode(bytecode)
        .setInitialBalance(new Hbar(10));

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = await contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the new contract ID
    const newContractId = receipt.contractId;

    console.log("The new contract ID is " + newContractId);

    process.exit();
}

main();
