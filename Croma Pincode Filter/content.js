let isEnabled = true;

const filterProducts = () => {
  if (!isEnabled) {
    document.querySelectorAll('.product-item, .cp-product').forEach(el => el.style.display = '');
    return;
  }

  // Croma usually puts 'Not Available at Pincode' in a specific span or div
  const items = document.querySelectorAll('.product-item, .cp-product, li.product-item');
  
  items.forEach(item => {
    if (item.innerText.includes("Not Available at") || item.innerText.includes("Out of Stock")) {
      item.style.display = 'none';
    }
  });
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle") {
    isEnabled = request.state;
    filterProducts();
  }
});

// Initial load
chrome.storage.local.get('filterEnabled', (data) => {
  isEnabled = data.filterEnabled !== false;
  filterProducts();
});

// Watch for changes (as Croma uses infinite scroll)
const observer = new MutationObserver(filterProducts);
observer.observe(document.body, { childList: true, subtree: true });