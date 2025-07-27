// Fetch and display products from Euphoria Development API
async function loadProducts() {
    try {
        const response = await fetch('https://api.euphoriadevelopment.uk/stats/');
        const data = await response.json();
        const products = data.blueprintExtensions;
        
        const productsGrid = document.getElementById('products-grid');
        
        // Clear loading content
        productsGrid.innerHTML = '';
        
        // Sort products to show paid ones first (based on platform pricing), then free ones
        const sortedProducts = products.sort((a, b) => {
            const aPrice = getHighestPrice(a.platforms);
            const bPrice = getHighestPrice(b.platforms);
            
            if (aPrice > 0 && bPrice === 0) return -1;
            if (aPrice === 0 && bPrice > 0) return 1;
            return bPrice - aPrice; // Higher price first within each category
        });
        
        // Create product cards
        sortedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-neutral-950 rounded-lg shadow overflow-hidden border border-neutral-800 hover:shadow-lg hover:border-blue-400 hover:scale-105 transition-all duration-200 cursor-pointer';
            
            // Get the highest price from all platforms
            const price = getHighestPrice(product.platforms);
            const isPaid = price > 0;
            const priceDisplay = isPaid ? `$${price}` : 'FREE';
            const priceColor = isPaid ? 'text-blue-400' : 'text-green-400';
            
            // Use banner image or fallback to generated avatar
            const logoUrl = product.banner 
                ? product.banner
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=3b82f6&color=fff&size=400x200`;
            
            // Add type badge
            const typeBadge = product.type === 'THEME' ? '🎨' : '🔧';
            
            // Get platform URLs
            const builtByBitUrl = product.platforms.BUILTBYBIT?.url;
            const sourceXchangeUrl = product.platforms.SOURCEXCHANGE?.url;
            
            // Create buttons HTML
            let buttonsHtml = '';
            if (builtByBitUrl || sourceXchangeUrl) {
                buttonsHtml = '<div class="mt-4 flex gap-2 justify-center">';
                
                if (sourceXchangeUrl) {
                    buttonsHtml += `
                        <button onclick="window.open('${sourceXchangeUrl}', '_blank')" 
                                class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded transition-colors">
                            SourceXchange
                        </button>`;
                }
                
                if (builtByBitUrl) {
                    buttonsHtml += `
                        <button onclick="window.open('${builtByBitUrl}', '_blank')" 
                                class="px-3 py-1.5 bg-blue-400 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                            BuiltByBit
                        </button>`;
                }
                
                buttonsHtml += '</div>';
            }
            
            productCard.innerHTML = `
                <img src="${logoUrl}" 
                     alt="${product.name}" 
                     class="w-full h-32 object-cover"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=3b82f6&color=fff&size=400x200'">
                <div class="p-6">
                    <h3 class="font-semibold text-lg mb-2 text-neutral-200">${product.name}</h3>
                    <p class="text-neutral-400 text-sm mb-3">${product.summary}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs px-2 py-1 bg-neutral-800 rounded">${typeBadge} ${product.type}</span>
                        <span class="${priceColor} font-bold">${priceDisplay}</span>
                    </div>
                    ${buttonsHtml}
                </div>
            `;
            
            // Remove the previous click handler since we now have individual buttons
            productsGrid.appendChild(productCard);
        });
        
        // Add a note about the products
        const noteElement = document.createElement('div');
        noteElement.className = 'col-span-full mt-4 text-center text-neutral-400 text-sm';
        noteElement.innerHTML = `Showing ${products.length} Blueprints • Themes and Extensions for Pterodactyl Panel`;
        productsGrid.appendChild(noteElement);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback content on error
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = `
            <div class="col-span-full text-center text-neutral-400">
                <p>Unable to load products at this time.</p>
            </div>
        `;
    }
}

// Helper function to get the highest price from all platforms
function getHighestPrice(platforms) {
    let highestPrice = 0;
    for (const platform in platforms) {
        if (platforms[platform].price > highestPrice) {
            highestPrice = platforms[platform].price;
        }
    }
    return highestPrice;
}

// Helper function to get the first available platform URL
function getFirstPlatformUrl(platforms) {
    for (const platform in platforms) {
        if (platforms[platform].url) {
            return platforms[platform].url;
        }
    }
    return null;
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
