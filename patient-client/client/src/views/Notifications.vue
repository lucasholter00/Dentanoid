<template>
  <!-- Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#notifications -->
  <body>
  <!------------------------------------------- Navbar --------------------------------------------------- -->
  <b-nav tabs>
    <b-nav-item pill :disabled="subscriptionExists" @click="showEmailSubscription">Subscribe</b-nav-item>
    <b-nav-item pill :disabled="!subscriptionExists" @click="showUpdateSubscription">Update subscription</b-nav-item>
    <b-nav-item pill :disabled="!subscriptionExists" @click="showUnubscription">Unsubscribe</b-nav-item>
  </b-nav>
  <!-------------------------------------------xxxxxxxxxxxxxxxxxxxxxxx------------------------------------- -->
  <div class="row">
    <!----------------------------------------- Left column text --------------------------------------------->
    <div class="col-lg-3 col-12">
      <div v-if="!subscriptionExists">
        <p>Welcome to our subscription service!</p>
        <p>Click "subscribe" in the menubar to select the clinics you wish to subscribe to.</p>
        <p>Once you have subscribed you will receive a email every time your clinics has a new available slot! We are
          not kidding about the every part.</p>
      </div>
      <div v-if="subscriptionExists && showUpdateSubscriptionComp">
        <p>Welcome back!</p>
        <p>You can update your subscription here.</p>
        <p>Select the clinics you wish to subscribe to and confirm, we will make sure to let you know when your clinics
          are ready for you!</p>
      </div>
    </div>
    <!------------------------------------------ xxxxxxxxxxxxxxxxxxxxxxx ------------------------------- -->
    <div class="col-lg-6 col-12">
      <!-- -------------------------------------- Current subscription card ------------------------------->
      <div class="text-center" v-if="subscriptionExists && showUpdateSubscriptionComp || showUnsubscriptionBtn">
        <SubscriptionCard :card-height="'auto'" :card-width="'auto'" :subscription="subscription"
                          :subbed-to-clinics="subbedToClinics"/>
      </div>
      <!-- -------------------------------------- xxxxxxxxxxxxxxxxxxxxxxx --------------------------------->
      <!-----------------------------------------Unsubscribe button and text ------------------------------>
      <div class="text-center m-2" v-if="showUnsubscriptionBtn">
        <p>We are very sad to see that you wish to unsubscribe but as soon as you want notifcations again you know where
          to find us!</p>
        <b-button pill variant="outline-danger" @click="unsubscribeFromEmails">Unsubscribe</b-button>
      </div>
      <!-----------------------------------------xxxxxxxxxxxxxxxxxxxxxxx----------------------------------->
      <!------------------------------------------Create new subscription list  -->
      <div class="text-center list" v-if="showEmailSubscriptionComp && !showUpdateSubscriptionComp">
        <email-subscription :clinics="clinics" :user="user" :operation-type="'post'"/>
      </div>
      <!-----------------------------------------xxxxxxxxxxxxxxxxxxxxxxx----------------------------------->
      <!--------------------------------------Update subscription ----------------------------------------->
      <div class="container text-center overflow-scroll p-3 bg-light"
           v-if="showUpdateSubscriptionComp && !showEmailSubscriptionComp">
        <email-subscription :clinics="clinics" :user="user" :operation-type="'update'"/>
      </div>
      <!-----------------------------------------xxxxxxxxxxxxxxxxxxxxxxx----------------------------------->
    </div>
    <!-- --------------------------------------Right column ----------------------------------------------->
    <div class="col-lg-3 col-12"></div>
    <!-----------------------------------------xxxxxxxxxxxxxxxxxxxxxxx------------------------------------->
  </div>
  </body>
</template>

<script>
import EmailSubscription from '@/component/notifications/EmailSubscription.vue'
import { getAllClinics } from '@/utility/clinicUtils'
import { getPatient } from '@/utility/patientUtils'
import { deleteSubscription, getSubscription } from '@/utility/emailSubscriberUtils'
import SubscriptionCard from '@/component/notifications/SubscriptionCard.vue'
import router from '@/router'

export default {
  name: 'Notifications.vue',
  components: { SubscriptionCard, EmailSubscription },
  data() {
    return {
      clinics: [],
      user: '',
      subscription: '',
      subbedToClinics: '',
      showEmailSubscriptionComp: false,
      showUpdateSubscriptionComp: false,
      showUnsubscriptionBtn: false
    }
  },
  computed: {
    subscriptionExists() {
      return !!this.subscription
    }
  },
  methods: {
    async getClinics() {
      try {
        const res = await getAllClinics()
        if (res) {
          this.clinics = res.data.clinics
        }
      } catch (err) {
        console.error(err)
      }
    },
    showEmailSubscription() {
      this.showEmailSubscriptionComp = !this.showEmailSubscriptionComp
    },
    showUpdateSubscription() {
      this.showUpdateSubscriptionComp = !this.showUpdateSubscriptionComp
    },
    showUnubscription() {
      this.showUnsubscriptionBtn = !this.showUnsubscriptionBtn
    },
    async unsubscribeFromEmails() {
      const deleted = await deleteSubscription()
      if (deleted) {
        window.scroll(0, 0)
        await router.go(0)
      } else {
        window.alert('Something went wrong and we regret to inform you we were not able to unsubscribe you at this time. Please try again later!')
      }
    }
  },
  async created() {
    try {
      await this.getClinics()
      this.user = await getPatient()
      this.subscription = await getSubscription()
      if (this.subscription !== undefined) {
        this.subbedToClinics = this.clinics.filter(obj => this.subscription.clinic.includes(obj._id.$oid))
      }
    } catch (err) {
      console.warn(err)
    }
  }
}
</script>

<style scoped>
.row {
  height: 100vh;
  overflow: auto;
}
</style>
