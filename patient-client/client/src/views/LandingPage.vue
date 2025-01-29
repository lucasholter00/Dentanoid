<template>
  <!--Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#landing-page  -->
  <body>
  <div class='container'>
    <div class='carousel'>
      <b-carousel
        id='carousel-1'
        v-model='slide'
        :interval='4000'
        controls
        indicators
        background='#ababab'
        style='text-shadow: 1px 1px 2px #333;'
        @sliding-start='onSlideStart'
        @sliding-end='onSlideEnd'
        class="mt-3"
      >
        <b-carousel-slide img-src='https://targetjobs.co.uk/static/01e55a23e7aaab33f877f4b0260a5986/e3554/dentist_1140x350.webp'> <!--Select dental img -->
          <h2>Need to consult a specialist?</h2>
          <b-btn pill variant='success' href='/'>Book</b-btn>
        </b-carousel-slide>

        <b-carousel-slide img-src='https://targetjobs.co.uk/static/01e55a23e7aaab33f877f4b0260a5986/e3554/dentist_1140x350.webp'><!--Select dental img -->
          <h2>Find clinics near you!</h2>
          <b-btn pill variant='success' href='/clinics'>Clinics</b-btn>
        </b-carousel-slide>

        <b-carousel-slide img-src='https://targetjobs.co.uk/static/01e55a23e7aaab33f877f4b0260a5986/e3554/dentist_1140x350.webp'><!--Select dental img -->
          <h2>Who are we?</h2>
          <b-btn pill variant='success' href='/aboutus'>About us</b-btn>
        </b-carousel-slide>

      </b-carousel>
    </div>
  </div>
  <div class='container'>
    <div class='row'>
      <div class='col-2'></div>
      <div class='col-lg-8'>
        <h1>What do we offer?</h1>
        <p><!--Rewrite Text with group -->
          At Dentanoid, we provide a seamless online booking experience for multiple dental clinics across Gothenburg.
          Our platform ensures a user-friendly interface,
          making it easy for you to schedule appointments with various dental practitioners in the area.
          we're all about real and meaningful communication.
          Whether you're looking for routine check-ups, cosmetic dentistry, or specialized treatments, Dentanoid has you
          covered.
          Our commitment is to offer a hassle-free booking process, allowing you to prioritize your oral health with
          convenience and efficiency.
        </p>
        <p><!--Rewrite Text with group -->
          At Dentanoid, we provide a seamless online booking experience for multiple dental clinics across Gothenburg.
          Our platform ensures a user-friendly interface,
          making it easy for you to schedule appointments with various dental practitioners in the area.
          we're all about real and meaningful communication.
          Whether you're looking for routine check-ups, cosmetic dentistry, or specialized treatments, Dentanoid has you
          covered.
          Our commitment is to offer a hassle-free booking process, allowing you to prioritize your oral health with
          convenience and efficiency.
        </p>
      </div>
      <div class='col-lg-2'>
        <QuoteCard :quote="'Fobar bar fo lorem ipsum ipsum'" :name="'Lena'" :card-height="'auto'" :card-width="'auto'" /><!--Rewrite Text with group -->
        <QuoteCard :quote="'Fobar bar fo lorem ipsum ipsum'" :name="'Lena'" :card-height="'auto'" :card-width="'auto'" /><!--Rewrite Text with group -->
      </div>
      <div class='col-lg-2'></div>
      <div class='col-lg-8 text-center'>
        <h1>Start your dental adventure today!</h1>
        <div class='row'>
          <div class='col-lg-4 col-sm-8 col- text-center lp-nav-btn'>
            <b-btn size='lg' pill variant='success' href='/authentication'>Sign up</b-btn>
          </div>
          <div class='col-lg-4 col-sm-12 text-center lp-nav-btn'>
            <b-btn size='lg' pill variant='success' href='/authentication'>Sign in</b-btn>
          </div>
          <div class='col-lg-4 col-sm-12 text-center lp-nav-btn'>
            <b-btn size='lg' pill variant='success' href='/clinics'>Book</b-btn>
          </div>
        </div>
      </div>
      <div class='col-2'></div>
    </div>
  </div>
  </body>
</template>

<script>
import QuoteCard from '@/component/QuoteCard.vue'

export default {
  name: 'LandingPage.vue',
  components: { QuoteCard },
  data() {
    return {
      slide: 0,
      sliding: null
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
  }
}
</script>

<style scoped>
.lp-nav-btn {
  margin-bottom: 1vh;
}

.carousel {
  margin-bottom: 2vh;
}

.container {
  margin: 0 auto !important; /* Center the container */

}

/* Default font size */
.carousel h2 {
  font-size: 24px;
}

/* Default button style */
.carousel button {
  display: inline-block;
}

@media (max-width: 767px) {
  /* Hide the text and button for screens smaller than 767px */
  .carousel h2,
  .carousel button {
    display: none;
  }
}

</style>
