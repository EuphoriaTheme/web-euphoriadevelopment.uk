// Fetch and display real-time statistics from Euphoria Development API
async function loadStats() {
    try {
        const response = await fetch('https://api.euphoriadevelopment.uk/stats/');
        const data = await response.json();
        
        // Use totalInstalls from API for active panels
        const totalInstalls = data.totalInstalls;
        
        // Count extensions and themes
        const extensions = data.blueprintExtensions.filter(ext => ext.type === 'EXTENSION');
        const themes = data.blueprintExtensions.filter(ext => ext.type === 'THEME');
        const totalProjects = data.blueprintExtensions.length;
        
        // Update the statistics with animated counters
        animateCounter('total-projects', totalProjects);
        animateCounter('api-calls', data.totalApiCalls);
        animateCounter('active-panels', totalInstalls);
        
        console.log(`Extensions: ${extensions.length}, Themes: ${themes.length}, Total: ${totalProjects}`);
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to static numbers if API fails
    }
}

// Animate counter from 0 to target value
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 seconds
    const increment = targetValue / (duration / 30); // 60fps
    let currentValue = 0;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        // Format large numbers with commas
        const formattedValue = Math.floor(currentValue).toLocaleString();
        element.textContent = formattedValue;
    }, 16);
}

// Load stats when page loads
document.addEventListener('DOMContentLoaded', loadStats);
