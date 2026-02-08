// Script to clear web design services from localStorage so updated defaults are used
console.log('Clearing web design services from localStorage...');

// Clear the web design services to force reload with updated defaults
localStorage.removeItem('webDesignServices');

console.log('Web design services cleared from localStorage');
console.log('The application will now use the updated default values with 7-15 days delivery time');

// Reload the page to apply changes
if (typeof window !== 'undefined') {
    window.location.reload();
}