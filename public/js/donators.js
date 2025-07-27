// Fetch and display donators from Euphoria Development API
async function loadDonators() {
    try {
        const response = await fetch('https://api.euphoriadevelopment.uk/donators');
        const donators = await response.json();
        
        const donatorsGrid = document.getElementById('donators-grid');
        
        // Clear loading content
        donatorsGrid.innerHTML = '';
        
        // Create donator cards
        donators.forEach(donator => {
            const donatorCard = document.createElement('div');
            donatorCard.className = 'flex items-center bg-neutral-900 rounded-lg p-4 shadow border border-neutral-800 hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer';
            
            donatorCard.innerHTML = `
                <img src="${donator.Image}" 
                     class="rounded-full mr-3 border border-blue-400 w-12 h-12 object-cover" 
                     alt="${donator.Name}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(donator.Name)}&background=3b82f6&color=fff&size=24'">
                <div class="text-left flex-1">
                    <div class="font-semibold text-neutral-200">${donator.Name}</div>
                    <div class="text-sm text-blue-400">${donator.Donation}</div>
                </div>
            `;
            
            // Make card clickable if link exists
            if (donator.Link) {
                donatorCard.addEventListener('click', () => {
                    window.open(donator.Link, '_blank');
                });
            }
            
            donatorsGrid.appendChild(donatorCard);
        });
        
    } catch (error) {
        console.error('Error fetching donators:', error);
        
        // Fallback content on error
        const donatorsGrid = document.getElementById('donators-grid');
        donatorsGrid.innerHTML = `
            <div class="col-span-full text-center text-neutral-400">
                <p>Unable to load donators at this time.</p>
            </div>
        `;
    }
}

// Load donators when page loads
document.addEventListener('DOMContentLoaded', loadDonators);
