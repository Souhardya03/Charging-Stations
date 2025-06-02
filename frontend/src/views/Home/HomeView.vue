<template>
  <div class="max-w-screen mx-auto p-6 space-y-8">
    <h2 class="text-3xl pb-8 font-bold text-center text-blue-700">⚡ Public Charging Stations</h2>

    <!-- Map Section -->
    <div class="h-[500px] my-4 rounded shadow">
      <div id="map" class="h-full w-full rounded"></div>
    </div>

    <div class="pt-4">
      <form @submit.prevent="fetchStations" class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded">
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Filter by Status</label>
            <select v-model="filters.status" class="border p-2 rounded w-full">
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Filter by Power Output</label>
            <input v-model.number="filters.powerOutput" class="border p-2 rounded w-full" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Filter by Connector Type</label>
            <select v-model="filters.connectorType" class="border p-2 rounded w-full">
              <option value="">All</option>
              <option value="Type1">Type1</option>
              <option value="Type2">Type2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>
          <div class="col-span-full">
            <button
              type="submit"
              class="w-full md:w-auto px-4 py-2 mt-2 rounded font-semibold border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Apply Filters
            </button>
          </div>
        </form>
    </div>

    <!-- Station List -->
    <div class="grid grid-cols-1 md:grid-cols-2 pt-4 lg:grid-cols-3 gap-6">
      <div
        v-for="station in stations"
        :key="station._id"
        class="bg-white p-4 rounded shadow hover:shadow-md border border-blue-100"
      >
        <h3 class="text-xl font-semibold text-blue-800">{{ station.name }}</h3>
        <p class="text-gray-600 text-sm mb-1">{{ station.status }} | {{ station.powerOutput }}kW</p>
        <p class="text-gray-500 text-sm mb-1">Connector: {{ station.connectorType }}</p>
        <p class="text-gray-400 text-xs">By: {{ station.createdBy?.name || 'Unknown' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const stations = ref([]);
let map;
let markersLayer;
const filters = ref({status: '', powerOutput: '', connectorType: ''});
const token = localStorage.getItem('token')

const fetchStations = async () => {
  const query = new URLSearchParams(filters.value).toString();
  const res = await axios.get(`http://localhost:5000/v1/api/station?${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });  
  stations.value = res.data.stations.map(station => ({
    ...station,
    location: {
      latitude: station.latitude,
      longitude: station.longitude
    }
  }));
  drawMap();
};

const drawMap = () => {
  if (!map) {
    map = L.map('map').setView([22, 78],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  markersLayer.clearLayers();
  stations.value.forEach(station => {
    const { latitude, longitude } = station.location;
    const marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<strong>${station.name}</strong><br>${station.status} | ${station.powerOutput}kW<br>Connector: ${station.connectorType}`);
    marker.addTo(markersLayer);
  });
};

onMounted(fetchStations);
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';
</style>