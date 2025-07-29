// Simple dropdown test script
console.log('Dropdown test script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dropdowns');
    
    // Find all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    console.log('Found dropdown toggles:', dropdownToggles.length);
    
    // Add click event to each dropdown toggle
    dropdownToggles.forEach(function(btn, index) {
        console.log('Adding event listener to dropdown', index);
        
        btn.addEventListener('click', function(event) {
            console.log('Dropdown clicked:', index);
            event.preventDefault();
            event.stopPropagation();
            
            // Find the dropdown menu for this button
            const menu = btn.parentNode.querySelector('.dropdown-menu');
            console.log('Found menu:', menu);
            
            if (menu) {
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(function(otherMenu) {
                    if (otherMenu !== menu) {
                        otherMenu.classList.add('hidden');
                    }
                });
                
                // Toggle this dropdown
                menu.classList.toggle('hidden');
                console.log('Menu hidden:', menu.classList.contains('hidden'));
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                menu.classList.add('hidden');
            });
        }
    });
}); 

