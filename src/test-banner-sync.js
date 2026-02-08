// Test script to verify banner synchronization
console.log('Testing banner synchronization...');

// Function to simulate adding a banner
function testAddBanner() {
  console.log('Adding a test banner...');
  
  // Get existing banners
  let banners = JSON.parse(localStorage.getItem('banners')) || [];
  
  // Create a new banner
  const newBanner = {
    id: Date.now(),
    title: 'Test Banner',
    description: 'This is a test banner added for synchronization testing',
    buttonText: 'Learn More',
    buttonLink: '/test',
    image: 'https://via.placeholder.com/1200x400.png?text=Test+Banner'
  };
  
  // Add to banners array
  banners.push(newBanner);
  
  // Save to localStorage
  localStorage.setItem('banners', JSON.stringify(banners));
  localStorage.setItem('bannerSlides', JSON.stringify(banners));
  
  // Trigger storage event to notify other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'banners',
    oldValue: JSON.stringify(banners.slice(0, -1)), // Previous state
    newValue: JSON.stringify(banners) // New state
  }));
  
  console.log('Test banner added successfully!');
  console.log('Current banners count:', banners.length);
}

// Function to test the refresh mechanism
function testForceRefresh() {
  console.log('Testing force refresh...');
  window.dispatchEvent(new CustomEvent('refreshBanners'));
  console.log('Refresh event dispatched!');
}

// Function to view current banners
function viewCurrentBanners() {
  const banners = JSON.parse(localStorage.getItem('banners')) || [];
  console.log('Current banners in localStorage:');
  console.table(banners.map(b => ({
    id: b.id,
    title: b.title,
    image: b.image ? 'Yes' : 'No'
  })));
}

// Add functions to global window object for manual testing
window.testAddBanner = testAddBanner;
window.testForceRefresh = testForceRefresh;
window.viewCurrentBanners = viewCurrentBanners;

console.log('Test functions added to window object:');
console.log('- window.testAddBanner(): Add a test banner');
console.log('- window.testForceRefresh(): Force refresh all banner components');
console.log('- window.viewCurrentBanners(): View current banners');
console.log('You can run these functions in the browser console to test synchronization.');