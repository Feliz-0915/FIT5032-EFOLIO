<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🔐 Firebase Sign in</h1>
        <p class="text-center">Sign in with your registered email & password.</p>

        <form @submit.prevent="onSignin">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" class="form-control" v-model.trim="email" autocomplete="email" required />
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" class="form-control" v-model="password" autocomplete="current-password" required />
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2" :disabled="loading">{{ buttonText }}</button>
            <router-link to="/FireRegister" class="btn btn-outline-secondary">Create account</router-link>
          </div>

          <div v-if="notice" class="mt-3" :class="noticeClass">{{ notice }}</div>
        </form>

        <div v-if="debugUser" class="mt-4">
          <h5>Current User</h5>
          <pre class="bg-light p-3 rounded small" style="max-height:240px;overflow:auto">{{ debugUser }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const email = ref("")
const password = ref("")
const loading = ref(false)
const buttonText = ref("Sign in")
const debugUser = ref("")
const notice = ref("")
const noticeType = ref("info")

const noticeClass = computed(() =>
  noticeType.value === "success"
    ? "alert alert-success"
    : noticeType.value === "error"
    ? "alert alert-danger"
    : "alert alert-info"
)

const onSignin = async () => {
  loading.value = true
  buttonText.value = "Signing in..."
  notice.value = ""
  debugUser.value = ""
  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    let role = "unknown"
    try {
      const snap = await getDoc(doc(db, "users", cred.user.uid))
      if (snap.exists()) role = snap.data().role
    } catch (_) {}
    debugUser.value = JSON.stringify(
      { email: cred.user.email, uid: cred.user.uid, role, metadata: cred.user.metadata },
      null,
      2
    )
    noticeType.value = "success"
    notice.value = `Signed in as ${cred.user.email} (role: ${role})`
    buttonText.value = "Login successful"
    setTimeout(async () => {
      loading.value = false
      buttonText.value = "Sign in"
      await router.push("/")
    }, 1200)
  } catch (e) {
    noticeType.value = "error"
    notice.value = `Sign-in failed: ${e.code || e.message}`
    loading.value = false
    buttonText.value = "Sign in"
  }
}
</script>
