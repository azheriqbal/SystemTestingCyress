// app.js (which includes fetchData from api.js)

// Mock data for testing purposes
const mockData = { name: 'John Doe', age: 30 };

// Simulated fetchData function for testing (not a real API call)
async function fetchData() {
  // Simulate an API request delay (optional, for testing async behavior)
  await new Promise((resolve) => setTimeout(resolve, 100));

  return mockData;
}

// Display data on the page
async function displayData() {
  try {
    const data = await fetchData();
    document.getElementById('data-container').innerText = JSON.stringify(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Run displayData when the page is loaded
window.addEventListener('load', () => {
  displayData();
});
