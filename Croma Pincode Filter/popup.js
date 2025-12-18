document.addEventListener('DOMContentLoaded', () => {
    const check = document.getElementById('toggleFilter');

    // Load saved state
    chrome.storage.local.get('filterEnabled', (data) => {
        check.checked = data.filterEnabled !== false;
    });

    // Save state on change
    check.addEventListener('change', () => {
        const state = check.checked;
        chrome.storage.local.set({ filterEnabled: state });

        // Notify content script in the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggle", state: state });
            }
        });
    });
});