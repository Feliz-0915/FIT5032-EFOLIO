<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">📚 Add Book</h1>
        <p class="text-center">Add a book to Firestore.</p>

        <form @submit.prevent="onSubmit">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="isbn" class="form-label">ISBN</label>
              <input id="isbn" type="text" class="form-control" v-model.trim="isbn" required />
              <div v-if="errors.isbn" class="text-danger">{{ errors.isbn }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="name" class="form-label">Name</label>
              <input id="name" type="text" class="form-control" v-model.trim="name" required />
              <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2" :disabled="loading">
              {{ loading ? 'Adding…' : 'Add Book' }}
            </button>
          </div>

          <div v-if="notice" class="mt-3" :class="noticeClass">{{ notice }}</div>
        </form>

        <div class="mt-4">
          <BookList title="All Books (live)" />
        </div>

        <div class="mt-5">
          <BookList
            title="Query: ISBN &gt; 1000 (where)"
            where-field="isbn"
            where-op=">"
            :where-value="1000"
          />
        </div>

        <div class="mt-4">
          <BookList
            title="Query: orderBy name ASC"
            order-by-field="name"
            order-direction="asc"
          />
        </div>

        <div class="mt-4">
          <BookList
            title="Query: Top 2 by ISBN DESC (orderBy + limit)"
            order-by-field="isbn"
            order-direction="desc"
            :limit-count="2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import db from '../firebase/init.js'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const loading = ref(false)
const notice = ref('')
const noticeType = ref('info')
const errors = ref({ isbn: null, name: null })

const noticeClass = computed(() =>
  noticeType.value === 'success'
    ? 'alert alert-success'
    : noticeType.value === 'error'
    ? 'alert alert-danger'
    : 'alert alert-info'
)

const validate = () => {
  errors.value.isbn = /^\d+$/.test(isbn.value) ? null : 'ISBN must be a number'
  errors.value.name = name.value.length ? null : 'Name is required'
  return !errors.value.isbn && !errors.value.name
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  notice.value = ''
  try {
    await addDoc(collection(db, 'books'), { isbn: Number(isbn.value), name: name.value })
    isbn.value = ''
    name.value = ''
    noticeType.value = 'success'
    notice.value = 'Book added successfully'
  } catch (e) {
    noticeType.value = 'error'
    notice.value = e.code || e.message || 'Failed to add book'
  } finally {
    loading.value = false
  }
}
</script>