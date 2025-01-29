<template>
  <b-card
    class="listing_card"
    :header="'Current subscription'"
    header-text-variant="white"
    header-tag="header"
    header-bg-variant="primary"
    :title="subscription.email"
    :style=" {  width: cardWidth, height: cardHeight, background: BGcolor }"
  >
    <b-card-text><b>You are currently subscribed to:</b></b-card-text>
    <b-card-text v-for="(clinic, index) in subbedToClinics" :key="index">
      {{ clinic.clinic_name }}
    </b-card-text>

    <template #footer>
      <div style="text-align: center">
        Dentanoid
      </div>
    </template>

  </b-card>

</template>

<script>
export default {
  name: 'SubscriptionCard.vue',
  props: {
    subscription: {
      required: true
    },
    subbedToClinics: {
      required: true
    },
    cardWidth: {
      required: true
    },
    cardHeight: {
      required: true
    }
  },
  computed: {
    BGcolor() {
      const num = Math.floor(Math.random() * 7)
      let bgColor = null
      switch (num) {
        case 0: bgColor = '#F0F0F0'
          break
        case 1: bgColor = '#DADADA'
          break
        case 2: bgColor = '#C4C4C4'
          break
        case 3: bgColor = '#AEAEAE'
          break
        case 4: bgColor = '#999999'
          break
        case 5: bgColor = '#CDD0CB'
          break
        case 6: bgColor = '#8C8C8C'
          break
      }
      return bgColor
    }
  }
}
</script>

<style scoped>

</style>
