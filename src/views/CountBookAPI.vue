<template>
  <div class="container mt-4">
    <h2>Book Count (JSON)</h2>

    <div v-if="jsondata">
      <pre>{{ jsondata }}</pre>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CountBookAPI",
  data() {
    return {
      jsondata: null,
      error: null,
    };
  },
  async mounted() {
    await this.getBookCountAPI();
  },
  methods: {
    async getBookCountAPI() {
      try {
        const response = await axios.get(
          "https://countbooks-ikrxwymaxa-uc.a.run.app"
        );
        this.jsondata = JSON.stringify(response.data, null, 2);
        this.error = null;
      } catch (error) {
        console.error("Error fetching book count:", error);
        this.jsondata = "Error fetching book count.";
        this.error = error;
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f6f8fa;
  border-radius: 10px;
  padding: 20px;
  width: 600px;
  margin: 50px auto;
}
pre {
  background: #eef1f5;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
