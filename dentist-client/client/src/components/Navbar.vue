<template>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/" class="text-uppercase font-weight-bold">
            <img src="../assets/tooth.png" alt="Dentanoid" class="nav-logo" />
            Dentanoid
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <em>User</em>
                    </template>
                    <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<style>
.nav-logo {
    max-width: 50px;
}
</style>
<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('user')
      window.location = '/'
    }
  }
}
</script>
