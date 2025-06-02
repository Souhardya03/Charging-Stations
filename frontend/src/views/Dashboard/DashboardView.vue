<template>
  <div class="max-w-full mx-auto p-6">
    <h2 class="text-2xl font-bold pb-8">⚡ My Charging Stations</h2>

    <div class="flex gap-6">
      <div class="flex flex-col w-2/3 gap-3 space-y-6">
        <!-- Create/Update Form -->
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 shadow rounded">
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Station Name</label>
            <input v-model="form.name" placeholder="Station name" required class="border p-2 rounded w-full" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Latitude</label>
            <input v-model.number="form.location.latitude" type="number" step="any" required class="border p-2 rounded w-full" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Longitude</label>
            <input v-model.number="form.location.longitude" type="number" step="any" required class="border p-2 rounded w-full" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Status</label>
            <select v-model="form.status" required class="border p-2 rounded w-full">
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Power Output (kW)</label>
            <input v-model.number="form.powerOutput" type="number" required class="border p-2 rounded w-full" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 font-medium">Connector Type</label>
            <select v-model="form.connectorType" required class="border p-2 rounded w-full">
              <option value="">Select Connector Type</option>
              <option value="Type1">Type1</option>
              <option value="Type2">Type2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="px-4 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700">
              {{ isUpdating ? 'Update' : 'Create' }}
            </button>
            <button
              v-if="isUpdating"
              @click.prevent="cancelUpdate"
              class="px-4 py-2 rounded font-semibold bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

        <!-- Filter Form -->
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

        <!-- Station List -->
        <div class="space-y-4 border border-blue-400 max-h-[400px] overflow-auto rounded p-2 bg-white">
          <div
            v-for="station in stations"
            :key="station._id"
            class="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 class="font-semibold text-lg">{{ station.name }}</h3>
              <p class="text-sm text-gray-600">
                {{ station.status }} | {{ station.powerOutput }}kW | {{ station.connectorType }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editStation(station)"
                class="text-sm px-3 py-1 rounded font-semibold border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                @click="deleteStation(station._id)"
                class="text-sm px-3 py-1 rounded font-semibold bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: Map -->
      <div class="w-1/2 min-h-screen rounded shadow">
        <div id="map" class="h-full w-full rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Cookies from 'js-cookie';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url';
import markerIcon from 'leaflet/dist/images/marker-icon.png?url';
import markerShadow from 'leaflet/dist/images/marker-shadow.png?url';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const stations = ref([]);
const filters = ref({ status: '', powerOutput: '', connectorType: '' });
const token = Cookies.get('token');
const isUpdating = ref(false);
const currentId = ref(null);
let map;
let markersLayer;
const form = ref({
  name: '',
  location: { latitude: 0, longitude: 0 },
  status: '',
  powerOutput: 0,
  connectorType: ''
});

const fetchStations = async () => {
  const query = new URLSearchParams(filters.value).toString();
  const res = await axios.get(`http://localhost:5000/v1/api/station/user?${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });  
  stations.value = res.data.map(station => ({
    ...station,
    location: {
      latitude: station.latitude,
      longitude: station.longitude
    }
  }));
  drawMap();
};

const handleSubmit = async () => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const payload = {
    ...form.value,
    latitude: form.value.location.latitude,
    longitude: form.value.location.longitude
  };
  if (isUpdating.value) {
    await axios.patch(`http://localhost:5000/v1/api/station/update/${currentId.value}`, payload, headers);
  } else {
    await axios.post(`http://localhost:5000/v1/api/station/create`, payload, headers);
  }
  resetForm();
  fetchStations();
};

const editStation = (station) => {
  form.value = {
    name: station.name,
    location: {
      latitude: station.latitude || station.location?.latitude || 0,
      longitude: station.longitude || station.location?.longitude || 0
    },
    status: station.status,
    powerOutput: station.powerOutput,
    connectorType: station.connectorType
  };
  currentId.value = station._id;
  isUpdating.value = true;
};

const cancelUpdate = () => {
  resetForm();
};

const deleteStation = async (id) => {
  await axios.delete(`http://localhost:5000/v1/api/station/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  fetchStations();
};

const resetForm = () => {
  form.value = {
    name: '',
    location: { latitude: 0, longitude: 0 },
    status: '',
    powerOutput: 0,
    connectorType: ''
  };
  currentId.value = null;
  isUpdating.value = false;
};

const drawMap = () => {
  if (!map) {
    map = L.map('map').setView([22, 78], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  markersLayer.clearLayers();
  stations.value.forEach(station => {
    const { latitude, longitude } = station.location;
    const marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<strong>${station.name}</strong><br>${station.status} | ${station.powerOutput}kW | ${station.connectorType}`);
    marker.addTo(markersLayer);
  });
};

onMounted(fetchStations);
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';
</style>
