<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🧾 Firebase Registration</h1>
        <p class="text-center">Create your account using Firebase Authentication.</p>

        <form @submit.prevent="onSubmit">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" class="form-control" v-model.trim="email" autocomplete="email" required />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="role" class="form-label">Role</label>
              <select id="role" class="form-select" v-model="role">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" class="form-control" v-model="password" autocomplete="new-password" required />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="confirm" class="form-label">Confirm password</label>
              <input id="confirm" type="password" class="form-control" v-model="confirm" autocomplete="new-password" required />
              <div v-if="errors.confirm" class="text-danger">{{ errors.confirm }}</div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2" :disabled="loading">{{ loading ? 'Creating…' : 'Register' }}</button>
            <button type="button" class="btn btn-secondary" @click="reset" :disabled="loading">Clear</button>
          </div>

          <div v-if="notice" class="mt-3" :class="noticeClass">{{ notice }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

const router = useRouter()
const auth = getAuth()

const email = ref("")
const password = ref("")
const confirm = ref("")
const role = ref("user")
const loading = ref(false)

const errors = ref({ email: null, password: null, confirm: null })
const notice = ref("")
const noticeType = ref("info")
const noticeClass = computed(() => 
noticeType.value === "success" ? "alert alert-success" : noticeType.value === "error" ? "alert alert-danger" : "alert alert-info")

const validate = () => {
  errors.value.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? null : "Please enter a valid email."
  errors.value.password = password.value.length >= 6 ? null : "Password must be at least 6 characters."
  errors.value.confirm = password.value === confirm.value ? null : "Passwords do not match."
  return !errors.value.email && !errors.value.password && !errors.value.confirm
}

const reset = () => {
  email.value = ""
  password.value = ""
  confirm.value = ""
  role.value = "user"
  errors.value = { email: null, password: null, confirm: null }
  notice.value = ""
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  notice.value = ""
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(cred.user, { displayName: role.value })
    noticeType.value = "success"
    notice.value = "Registration successful. You can now sign in."
    loading.value = false
    await router.push("/FireLogin")
  } catch (e) {
    noticeType.value = "error"
    notice.value = `Register failed: ${e.code || e.message}`
    loading.value = false
  }
}
</script>