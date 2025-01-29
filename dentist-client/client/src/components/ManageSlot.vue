<template>
    <b-modal centered title="Manage" id="selectedEvent" hide-footer>
        <span>{{ selectedEvent?.title }}</span>
        <br />
        <strong>{{ selectedEvent?.start && selectedEvent?.start.format('DD/MM/YYYY') }}</strong>
        <p v-html="selectedEvent?.contentFull" />
        <strong>Event Details:</strong>
        <ul>
            <li>Event starts at: {{ selectedEvent?.start && selectedEvent?.start.formatTime() }}</li>
            <li>Event ends at: {{ selectedEvent?.end && selectedEvent?.end.formatTime() }}</li>
        </ul>
        <b-button variant="danger" @click="deleteEvent">Delete</b-button>
    </b-modal>
</template>
<script>
export default {
  props: ['selectedEvent', 'deleteEvent']
}
</script>
