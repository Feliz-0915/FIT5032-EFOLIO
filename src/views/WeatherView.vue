<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>

      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
        />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
    </div>

    <main>
      <div v-if="weatherData" class="weather-info">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>

      <div v-else-if="error" class="error">{{ error }}</div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
const apikey = "4202344c57e7f19c36d1c5d1b15b010c";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      error: null,
    };
  },
  computed: {
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273)
        : null;
    },
    iconUrl() {
      return this.weatherData
        ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
          await this.fetchWeatherData(url);
        });
      }
    },
    async searchByCity() {
      if (!this.city) {
        this.error = "Please enter a city name.";
        this.weatherData = null;
        return;
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
      await this.fetchWeatherData(url);
    },
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.error = null;
      } catch (err) {
        this.error = "City not found or API error.";
        this.weatherData = null;
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 420px;
  margin: 50px auto;
  padding: 20px;
  background: #f7f9fb;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.header h1 {
  margin-bottom: 15px;
  color: #333;
}
.search-bar {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.search-input {
  padding: 8px;
  width: 180px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.search-button {
  background: #4a90e2;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
}
.search-button:hover {
  background: #357ab8;
}
.weather-info {
  margin-top: 20px;
}
.error {
  color: red;
  margin-top: 20px;
}
</style>
