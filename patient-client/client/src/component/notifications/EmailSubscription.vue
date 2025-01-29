<!--This component is used to create new and update old email subscriptions -->
<template>
  <div>
    <div v-if="!responseMessage">
      <div class="sub-list text-center">

        <b-list-group>
          <b-list-group-item v-for="(clinic, index) in clinics" :key="index">
            <div class="clinic-select">
              <h3>{{ clinic.clinic_name }}</h3>
              <p>{{ clinic.address }}</p>
              <b-btn v-if="!subList.includes(clinic)" pill variant="outline-success" @click="subslist(clinic)">Subscribe</b-btn>
              <b-btn v-if="subList.includes(clinic)" pill variant="outline-danger" @click="subslist(clinic)">Unsubscribe</b-btn>
            </div>
          </b-list-group-item>
        </b-list-group>

        <p>Subscribe to:</p>
        <div v-for="(clinic, index) in subList" :key="index">
          <p>{{ clinic.clinic_name }}</p>
        </div>

        <b-btn v-if="subList.length > 0" pill variant="outline-success" @click="subscribeToEmails()">Confirm</b-btn>

      </div>
    </div>
    <p v-if="responseMessage">{{ responseMessage }}</p>
  </div>
</template>

<script>
import { postSubscriber, updateSubscription } from '@/utility/emailSubscriberUtils'
import router from '@/router'

export default {
  name: 'emailSubscription.vue',
  data() {
    return {
      subList: [],
      responseMessage: ''
    }
  },
  props: {
    clinics: {
      required: true
    },
    user: {
      required: true
    },
    operationType: {
      required: true
    }
  },
  methods: {
    subslist(clinic) {
      if (!this.subList.includes(clinic)) {
        this.subList.push(clinic)
      } else {
        const clinicIndex = this.subList.indexOf(clinic)
        this.subList.splice(clinicIndex, 1)
      }
    },
    async subscribeToEmails() {
      const clinicIDs = []
      for (const clinic in this.subList) {
        clinicIDs.push(this.subList[clinic]._id.$oid)
      }
      const subscriber = {
        patient_ID: this.user._id,
        email: this.user.email,
        clinic: JSON.stringify(clinicIDs)
      }
      if (this.operationType === 'post') {
        const posted = await postSubscriber(subscriber)
        if (posted) {
          this.responseMessage = 'You are subscribed!'
          window.scroll(0, 0)
          await router.go(0)
        } else {
          this.responseMessage = 'There was a problem with your subscription please try again later!'
        }
      } else if (this.operationType === 'update') {
        const updated = await updateSubscription(subscriber)
        if (updated) {
          this.responseMessage = 'Your subscription is updated!'
          window.scroll(0, 0)
          await router.go(0)
        } else {
          this.responseMessage = 'There was a problem with your subscription please try again later!'
        }
      }
    }
  }
}
</script>

<style scoped>
.sub-list {
  width: auto;
  height: auto;
}

.clinic-select {
  background-color: white;
  border-color: #007BFF;
  border-style: solid;
  border-radius: 2vw;
  color: #007BFF;
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
.clinic-select{
  min-width: fit-content;
  word-break: break-word;
  white-space: normal;
}
.clinic-select:hover {
  transform: scale(1.05);
}

* {
  padding: 0.5vh;
  font-family: Verdana, serif;
}
</style>
