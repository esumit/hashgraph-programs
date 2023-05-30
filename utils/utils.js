
function loadAccountCredentials() {
    
    const ACCOUNT_ID = process.env.ACCOUNT_ID
    const PUBLIC_KEY = process.env.PUBLIC_KEY
    const PRIVATE_KEY = process.env.PRIVATE_KEY

    if (!ACCOUNT_ID || !PRIVATE_KEY || !PUBLIC_KEY) {
        throw new Error("Please set Account ID or Private Key");
    }
    return {
        ACCOUNT_ID,
        PUBLIC_KEY,
        PRIVATE_KEY
    }
}

function loadTargetAccountCredentials() {
    const TARGET_ACCOUNT_ID = process.env.TARGET_ACCOUNT_ID
    const TARGET_PRIVATE_KEY = process.env.TARGET_PRIVATE_KEY

    if (!TARGET_ACCOUNT_ID || !TARGET_PRIVATE_KEY) {
        throw new Error("Please set Account ID or Private Key");
    }
    return {
        TARGET_ACCOUNT_ID,
        TARGET_PRIVATE_KEY
    }
}

function loadCreds(account) {
    const ACCOUNT_ID = process.env[account + "_ID"]
    const PUBLIC_KEY = process.env[account + "_PUBLIC_KEY"]
    const PRIVATE_KEY = process.env[account + "_PRIVATE_KEY"]

    console.log(`Loading credentials for ${account}`);
    console.log(`ACCOUNT_ID: ${ACCOUNT_ID}`);
    console.log(`PUBLIC_KEY: ${PUBLIC_KEY}`);
    console.log(`PRIVATE_KEY: ${PRIVATE_KEY}`);

    if (!ACCOUNT_ID || !PRIVATE_KEY || !PUBLIC_KEY) {
        throw new Error("Not valid account");
    }

    return {
        ACCOUNT_ID,
        PUBLIC_KEY,
        PRIVATE_KEY
    }
}


module.exports = {
    loadAccountCredentials,
    loadTargetAccountCredentials,
    loadCreds
}
