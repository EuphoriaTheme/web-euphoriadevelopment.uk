// Fetch and display contributors from Euphoria Development API
async function loadContributors() {
    try {
        const response = await fetch('https://api.euphoriadevelopment.uk/contributors');
        const contributors = await response.json();
        
        const contributorsGrid = document.getElementById('contributors-grid');
        
        // Clear loading content
        contributorsGrid.innerHTML = '';
        
        // Create contributor cards
        contributors.forEach(contributor => {
            const contributorCard = document.createElement('div');
            contributorCard.className = 'flex items-center bg-neutral-950 rounded-lg p-4 shadow border border-neutral-800 hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer';
            
            contributorCard.innerHTML = `
                <img src="${contributor.Image}" 
                     class="rounded-full mr-3 border border-blue-400 w-12 h-12 object-cover" 
                     alt="${contributor.Name}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.Name)}&background=3b82f6&color=fff&size=24'">
                <div class="text-left flex-1">
                    <div class="font-semibold text-neutral-200">${contributor.Name}</div>
                    <div class="text-sm text-neutral-400 line-clamp-2">${contributor.Contribution}</div>
                </div>
            `;
            
            // Make card clickable if link exists
            if (contributor.Link) {
                contributorCard.addEventListener('click', () => {
                    window.open(contributor.Link, '_blank');
                });
            }
            
            contributorsGrid.appendChild(contributorCard);
        });
        
    } catch (error) {
        console.error('Error fetching contributors:', error);
        
        // Fallback content on error
        const contributorsGrid = document.getElementById('contributors-grid');
        contributorsGrid.innerHTML = `
            <div class="col-span-full text-center text-neutral-400">
                <p>Unable to load contributors at this time.</p>
            </div>
        `;
    }
}

// Load contributors when page loads
document.addEventListener('DOMContentLoaded', loadContributors);
