<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <span>Set permission</span>
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-content>
      <SetPermission/>
    </v-content>
  </v-app>
</template>

<script>
import SetPermission from './components/SetPermission';

export default {
  name: 'App',

  components: {
    SetPermission,
  },

  data: () => ({
    //
  }),
};
</script>
