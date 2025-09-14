<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🚪 Logout</h1>
        <p class="text-center">Sign out the current user and verify in the console.</p>

        <div class="text-center">
          <button class="btn btn-danger" @click="logout" :disabled="loading">{{ loading ? 'Signing out…' : 'Sign Out' }}</button>
        </div>

        <div v-if="notice" class="mt-3" :class="noticeClass">{{ notice }}</div>

        <div class="mt-4">
          <h5>Current User after signOut</h5>
          <pre class="bg-light p-3 rounded small">{{ current }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { getAuth, signOut } from "firebase/auth"

const auth = getAuth()
const loading = ref(false)
const current = ref("")
const notice = ref("")
const noticeType = ref("info")
const noticeClass = computed(() => noticeType.value === "success" ? "alert alert-success" : noticeType.value === "error" ? "alert alert-danger" : "alert alert-info")

const logout = async () => {
  loading.value = true
  notice.value = ""
  current.value = ""
  try {
    await signOut(auth)
    current.value = JSON.stringify(auth.currentUser, null, 2)
    noticeType.value = "success"
    notice.value = "Signed out successfully. currentUser is now null."
    loading.value = false
  } catch (e) {
    noticeType.value = "error"
    notice.value = `Sign-out failed: ${e.code || e.message}`
    loading.value = false
  }
}
</script>
