  document.addEventListener('DOMContentLoaded', function() {
        
        const header = document.getElementById('main-header');
        // A flag to check if the alert has already been shown
        let alertShown = false; 

        // Function to handle scroll event
        function handleScroll() {
            // Check if user scrolled more than 50px AND the alert hasn't been shown yet
            if (window.scrollY > 50 && !alertShown) {
                // Add 'scrolled' class
                header.classList.add('scrolled');
                
                // Show the SweetAlert message
                Swal.fire({
                    icon: 'info',
                    title: 'Header Style Changed!',
                    text: 'You scrolled down, so we changed the header style for better visibility.',
                    timer: 3000, // Alert will close automatically after 3 seconds
                    timerProgressBar: true
                });

                // Set the flag to true so it doesn't show again
                alertShown = true; 

            } else if (window.scrollY <= 50) {
                // Remove 'scrolled' class if user is at the top
                header.classList.remove('scrolled');
                
                // Reset the flag so the alert can be shown again if they scroll down
                alertShown = false; 
            }
        }

        // Add scroll event listener to the window
        window.addEventListener('scroll', handleScroll);

    });