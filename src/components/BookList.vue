<template>
  <div>
    <h3 class="mb-3">{{ title }}</h3>

    <ul v-if="books.length">
      <li v-for="b in books" :key="b.id" class="mb-2">
        <template v-if="editingId === b.id">
          <input v-model="editName" class="form-control d-inline-block me-2" style="width:220px" />
          <input v-model.number="editIsbn" type="number" class="form-control d-inline-block me-2" style="width:160px" />
          <button class="btn btn-sm btn-primary me-1" @click="saveEdit(b.id)">Save</button>
          <button class="btn btn-sm btn-secondary" @click="cancelEdit">Cancel</button>
        </template>
        <template v-else>
          {{ b.name }} - ISBN: {{ b.isbn }}
          <button class="btn btn-sm btn-outline-primary ms-2" @click="startEdit(b)">Edit</button>
          <button class="btn btn-sm btn-outline-danger ms-1" @click="remove(b.id)">Delete</button>
        </template>
      </li>
    </ul>

    <div v-else class="text-muted">No data.</div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import db from '../firebase/init.js'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

export default {
  props: {
    title: { type: String, default: 'Book List' },
    whereField: { type: String, default: '' },   
    whereOp: { type: String, default: '' },      
    whereValue: { default: null },               
    orderByField: { type: String, default: '' }, 
    orderDirection: { type: String, default: 'asc' }, 
    limitCount: { type: Number, default: 0 }   
  },

  setup(props) {
    const books = ref([])
    let stop = null

    const editingId = ref(null)
    const editName = ref('')
    const editIsbn = ref(null)

    const buildQuery = () => {
      const base = collection(db, 'books')
      const qs = []

      if (props.whereField && props.whereOp && props.whereValue !== null && props.whereValue !== undefined) {
        qs.push(where(props.whereField, props.whereOp, props.whereValue))
      }
      if (props.orderByField) {
        qs.push(orderBy(props.orderByField, props.orderDirection || 'asc'))
      }
      if (props.limitCount > 0) {
        qs.push(limit(props.limitCount))
      }

      return qs.length ? query(base, ...qs) : query(base)
    }

    const listen = () => {
      if (stop) stop()
      const q = buildQuery()
      stop = onSnapshot(q, (snap) => {
        const arr = []
        snap.forEach(d => arr.push({ id: d.id, ...d.data() }))
        books.value = arr
      })
    }

    onMounted(listen)
    watch(
      () => [props.whereField, props.whereOp, props.whereValue, props.orderByField, props.orderDirection, props.limitCount],
      listen
    )
    onBeforeUnmount(() => stop && stop())

    const startEdit = (b) => {
      editingId.value = b.id
      editName.value = b.name
      editIsbn.value = b.isbn
    }
    const cancelEdit = () => {
      editingId.value = null
      editName.value = ''
      editIsbn.value = null
    }
    const saveEdit = async (id) => {
      if (!editName.value || editIsbn.value === null) return
      await updateDoc(doc(db, 'books', id), { name: editName.value, isbn: Number(editIsbn.value) })
      cancelEdit()
    }
    const remove = async (id) => {
      await deleteDoc(doc(db, 'books', id))
    }

    return { books, editingId, editName, editIsbn, startEdit, cancelEdit, saveEdit, remove }
  }
}
</script>
