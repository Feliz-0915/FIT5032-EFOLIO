<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item"><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
        <li class="nav-item"><router-link to="/about" class="nav-link" active-class="active">About</router-link></li>
        <li class="nav-item"><router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link></li>
        <li class="nav-item"><router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link></li>
        <li class="nav-item"><router-link to="/Logout" class="nav-link" active-class="active">Logout</router-link></li>
        <li class="nav-item"><router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link></li>
        <li class="nav-item ms-3 align-self-center text-muted">
          <small v-if="userEmail">Signed in as {{ userEmail }}</small>
          <small v-else>Not signed in</small>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const userEmail = ref(null)
let unsub
onMounted(() => {
  unsub = onAuthStateChanged(getAuth(), (u) => { userEmail.value = u?.email ?? null })
})
onUnmounted(() => unsub?.())
</script>