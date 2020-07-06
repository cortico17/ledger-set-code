<template>
    <v-dialog v-model="show" persistent width="600px">
      <!-- <template v-slot:activator="{ on }"> -->
        <!-- <v-btn text target="_blansk" v-on="on"><span class="mr-2">C</span></v-btn> -->
      <!-- </template> -->
      <v-card>
        <v-card-title>
          <span class="headline">Choose account</span>
        </v-card-title>
        <v-overflow-btn
          class="my-2"
          :items="accounts"
          label="Select account"
          segmented
          target="#dropdown-example"
        ></v-overflow-btn>
        <!-- 
        <v-card-text>
            This is a smart contract that allows you to lock a certain amount of EOS and in a certain date it will be released to the specified receiver. <br />
            How to use it:  <br />
            1) Download scatter if your don't have it already. <br />
            2) Create eos account if your don't have it already. (Currently smart contract is working on jungle testnet,
             add new network in scatter with API endpoint
              from their website https://monitor.jungletestnet.io/ with chain id e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473,
               create an account there and import it to the scatter. Also get the faucet there) <br />
            3) Login to your scatter account. <br />
            4) Click "New Timer" to create new timer, type quantity of eos in format "X.XXXX" and click ok. <br />
            5) Lock timer by specifing receiver, date and time when eos will be released. <br />
            6) Or cancel if you have created timer by mistake <br />
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">GOT IT</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: "ChooseAccount",
    props: {
        show: Boolean,
        params: Object,
        keyToAccountMap: Array,
        onSelect: Function
    },
    data () {
      return {
        accounts: null
      }
    },
    beforeUpdate() {
        const concateAll = arr => arr.reduce((acc, curr) => acc.concat(curr))
        if(this.accounts === null) {
          console.log('keyToAccounts: ', this.keyToAccountMap)
          const prepared = concateAll(this.keyToAccountMap.map(acc => acc.accounts))
          this.accounts = prepared.map(acc => ({
              text: `${acc.account}@${acc.authorization}`,
              callback: () => {
                this.onSelect(acc.account, acc.authorization)
                // this.show = false
                this.accounts = null
              }
          }))
          console.log(this.accounts)
        }
    }
  }
</script>