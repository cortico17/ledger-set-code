<template>
  <v-container>
      <v-btn color="primary" v-on:click="loginLedgerAndSetPermission">Set permission ledger</v-btn>
  </v-container>
</template>

<script>
    import { loginLedgerAndSetPermission } from '@/mainlogic.js'
  export default {
    name: 'HelloWorld',

    data: () => ({
    }),
    methods: {
        loginLedgerAndSetPermission,
    }
  }
</script>
