<template>
  <div>
    <!--b-card is a bootstrap vue component docs: https://bootstrap-vue.org/docs/components/card#overview -->
    <b-card
      class="quote-card"
      :header="name"
      header-text-variant="white"
      header-tag="header"
      header-bg-variant="primary"
      :style=" {  width: cardWidth, height: cardHeight }"
    >
      <b-card-text>" {{ quote }} "</b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Quoetecard.vue',
  props: {
    cardWidth: { // prop injected determining width.
      required: true
    },
    cardHeight: { // prop injected determining height.
      required: true
    },
    name: { // prop injected setting name
      type: String,
      required: true
    },
    quote: { // prop injected setting quote
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.quote-card {
  text-align: left;
  border-radius: 5px;
  color: black;
  transition: all .5s ease-in-out;
  margin: 15px;
  box-shadow: 0 20px 14px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19); /* Adds depth Credit: www.w3schools.com/css/css3_shadows_box.asp */
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.quote-card:hover { transform: scale(1.05); }
</style>
