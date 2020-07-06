<template>
  <v-container>
      <v-btn color="primary" v-on:click="loginLedgerAndSetPermission">Set permission ledger</v-btn>
      <ChooseAccount :show="show" :onSelect="onSelectAccount" :keyToAccountMap="keyToAccountMap"/>
      <v-spacer></v-spacer>
      <span>{{status}}</span>
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
        keyToAccountMap: [],
        status:'Status: '
    }),
    methods: {
        setStatus(newStatus) {
            this.status = 'Status: ' + newStatus
        },
        setPermissionAndHandle(wallet) {
                setPermission(wallet).then((res) => {
                        this.setStatus(JSON.stringify(res)+ " SUCCESS")
                        console.log(JSON.stringify(res) + " SUCCESS")
                    }).catch(err => {
                        this.setStatus(err)
                        console.log(err)
                })
        }, 
        onSelectAccount(accountName, authorization) {
            console.log('onSelectAccount accountName: ', accountName, ', authorization: ', authorization)
            this.show = false
            this.wallet.login(accountName, authorization).then(() => {
                    this.setPermissionAndHandle(this.wallet)
            })
        },
        loginLedgerAndSetPermission() {
            loginLedger().then(({ wallet, keyToAccountMap }) => {
                this.wallet = wallet
                if(keyToAccountMap.length > 0) {
                    this.keyToAccountMap = keyToAccountMap
                    this.show = true
                } else {
                    this.setPermissionAndHandle(this.wallet)
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
