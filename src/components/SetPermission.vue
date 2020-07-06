<template>
  <v-container>
      <v-btn color="primary" v-on:click="loginLedgerAndSetPermission">Set permission ledger</v-btn>
      <ChooseAccount :show="show" :onSelect="onSelectAccount" :keyToAccountMap="keyToAccountMap"/>
  </v-container>
</template>

<script>
    import { setPermission, loginLedger } from '@/mainlogic.js'
    import ChooseAccount from './ChooseAccount.vue'
  export default {
      
    name: 'SetPermission',
    components: {
        ChooseAccount,
    },
    data: () => ({
        show: false,
        wallet:null,
        keyToAccountMap: []
    }),
    methods: {
        onSelectAccount(accountName, authorization) {
            console.log('onSelectAccount accountName: ', accountName, ', authorization: ', authorization)
            this.show = false
            this.wallet.login(accountName, authorization).then(() => {
                setPermission(this.wallet).then(console.log).catch(err => console.log(err))
            })
        },
        loginLedgerAndSetPermission() {
            loginLedger().then(({ wallet, keyToAccountMap }) => {
                this.wallet = wallet
                if(keyToAccountMap.length > 0) {
                    this.keyToAccountMap = keyToAccountMap
                    this.show = true
                } else {
                    setPermission(this.wallet).then(console.log).catch(err => console.log(err))
                }
            })
//             this.keyToAccountMap = [{
//     index: 0,
//     key: "XXXX",
//     accounts: [{
//         account: "‘eosio’",
//         authorization: "‘owner’"
//     }]
//   },{
//     index: 1,
//     key: "YYYY",
//     accounts: [{
//         account: "‘anotherAccount’",
//         authorization: "‘active’"
//     },{
//         account: "‘anotherAccount’",
//         authorization: "‘owner’"
//     }]
//   }]
//             this.show = true
        },
    }
  }
</script>
