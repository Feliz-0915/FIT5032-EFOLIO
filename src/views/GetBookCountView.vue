<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2 text-center">
        <h1>Book Counter</h1>
        <button class="btn btn-primary mt-3" @click="getBookCount">Get Book Count</button>

        <p class="mt-3" v-if="count !== null">
          Total number of books: <strong>{{ count }}</strong>
        </p>
        <p class="text-danger mt-3" v-else-if="error">
          Error: {{ error.message || 'Unable to fetch count' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref(null)

async function getBookCount() {
  try {
    const response = await axios.get('https://us-central1-week7-tianyang.cloudfunctions.net/countBooks')
    count.value = response.data.count
    error.value = null
  } catch (err) {
    error.value = err
    count.value = null
  }
}
</script>
