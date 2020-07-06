import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import {JsonRpc} from 'eosjs';

    
    // We need to initialize the so called "access context" first,
    // passing it our dapp name, network configuration and
    // providers we want to make available to the dapp.
    // The context is responsible for initializing wallet connectoins
    // and tracking state of connected wallets.
    
    // We're using our own test network as an example here.
const mainrpc = new JsonRpc('https://api.telosfoundation.io:443');
    const maincontract = "telostimer11";
const network = {
    blockchain:'telos',
    chainId:'4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    host:'api.telosfoundation.io',
    port:443,
    protocol:'https'
}
const accessContext = initAccessContext({
    appName: maincontract,
    network,
    walletProviders: [
      scatter()
    ]
});
      
async function loginLedgerAndSetPermission() {
    // We're all set now and can get the list of available wallet providers
    // (we only have Scatter provider configured, so there will be only one):
    
    const walletProviders = accessContext.getWalletProviders();
    /* [{
     *   id: 'scatter',
     *   meta: {
     *    name: 'Scatter Desktop',
     *    shortName: 'Scatter',
     *    description: 'Scatter Desktop application that keeps your private keys secure'
     *   },
     *   signatureProvider,
     *   ... etc
     * }]
     */
    
    // This list can be used to, e.g., show the "login options" to the user to let him choose
    // what EOS login method he wants to use.
    
    // We just take the one we have as if the user has selected that
    const selectedProvider = walletProviders[0];
    
    // When user selects the wallet provider, we initiate the `Wallet` with it:
    const wallet = accessContext.initWallet(selectedProvider);
    
    // Now we have an instance of `wallet` that is tracked by our `accessContext`.
    // Lets connect to it and authenticate (you need Scatter app running)
    // NOTE: Only use `await` inside the `async` function, its used here just to
    // highlight that its asynchronous.
    await wallet.connect();
    
    // wallet.connected === true
    
    // If we're dealing with a device that has multiple keys (eg. Ledger Nano S), then we'll need to discover which keys / accounts are available on the device. This will return an object containing an array of accounts ... you'll need the user to select which account he want to use if this is the case.
    let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2,3,4,5,6,7,8,9,10 ] });
    
    // // Note you can keep caling discover at any point in time to extent the index list. transit will only query the device and the network for new index's. 
    // let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2,3 ] });
    // // You can either pass the full list or just the new index you're afer. Either way it'll append that keys info to the discoveryData object and return the entire dataset. 
    // let discoveryData = await wallet.discover({ pathIndexList: [ 150 ] });
    
    
    // If we have more than one account the user can select from we'll need to prompt the user.
    // Note that the Login function is called with the specific account details when multiple accounts are available.
    if (discoveryData.keyToAccountMap.length > 0) {
    
      // If discover returned multiple acconts then you'll need to promot the user to select which account he'd like to use. 
      // accountName, authorization are taken from the  discoveryData object. See the example of this object further down on this page.
    
      await wallet.login('accountName', 'authorization')
    
    } else {
    
      // Now that we are connected, lets authenticate (in case of a Scatter app,
      // it does it right after connection, so this is more for the state tracking
      // and for WAL to fetch the EOS account data for us)
      await wallet.login(); 
    }
    const { accountName, permission } = wallet.auth
    const account = { name: accountName, authority: permission }
// await wallet.eosApi.transact({
//     actions: [{
//         account: 'eosio',
//         name: 'updateauth',
//         authorization: [{
//             actor: account.name, 
//             permission: account.permission,
//         }],
//         data: {
//             account: account.name,  
//             permission: account.permission,
//             parent: 'owner',
//             auth: {
//                 "threshold": 1,
//                 "keys": [{
//                     "key": account.publicKey,
//                     "weight": 1
//                 }],
//                 "accounts": [{
//                     "permission": {
//                         "actor": account.name,
//                         "permission": "eosio.code"
//                     },
//                     "weight": 1
//                 }],
//                 "waits": [
//                     {
//                         "wait_sec": 0,
//                         "weight": 0
//                     }
//                 ]
//             }
//         }
//     }]
// }, {
//     blocksBehind: 3,
//     expireSeconds: 30,
// });
    const rpc = wallet.eosApi.rpc
    // console.log('eos: ', mainrpc)
    const perms = await getNewPermissions(mainrpc, accountName)
    console.log('perms: ', perms)
    // console.log('New permissions =>', JSON.stringify(perms))
    // if(!perms.find(perm => perm.perm_name === 'eosio.code')) console.log( "Already exists")

    // const updateAuthResult = await wallet.eosApi.transaction(tr => {

    //     // for(const perm of perms) {

    //     //     tr.updateauth({
    //     //         account: accountName,
    //     //         permission: perm.perm_name,
    //     //         parent: perm.parent,
    //     //         auth: perm.required_auth
    //     //     }, {authorization: `${accountName}@owner`})

    //     // }
    // })
        
}

async function getNewPermissions(eos, accountName) {
    // console.log('eos: ', eos, 'accountName: ', accountName)
    const account = await eos.getAccount(accountName)
    const perms = JSON.parse(JSON.stringify(account.permissions))
    return perms
}
  

async function getAuthorityInfo (account, api) {
    // const authority = arguments[0] ? arguments[0] : this.executiveAuthority.permission;

    const accountInfo = await api.getAccount(account.name);
    const authorityInfo = accountInfo.permissions.find((permission) => {
        return account.permission == permission.perm_name;
    });

    if (!authorityInfo) {
        throw new Error('Could not find such authority on chain');
    }

    return authorityInfo;
}

async function addOnBehalfAccount(signed, accountName, authority = 'active', weight = 1) {
    const authorityInfo = await this.getAuthorityInfo();
    const hasAlreadyAccount = authorityInfo.required_auth.accounts.find((account) => {
        return account.permission.actor == accountName;
    });

    if (!hasAlreadyAccount) {
        authorityInfo.required_auth.accounts.push({ permission: { actor: accountName, permission: authority }, weight });
        return updateAuthority.call(signed, authorityInfo.perm_name, authorityInfo.parent, authorityInfo.required_auth);
    }
}

const updateAuthority = async function (signed, authorityName, parent, auth) {
    await signed.api.transaction(tr => {
        tr.updateauth({
            account: signed.name,
            permission: authorityName,
            parent: parent,
            auth: auth
        }, { authorization: [signed.executiveAuthority] });

    }, { broadcast: true, sign: true });

}
export {loginLedgerAndSetPermission};