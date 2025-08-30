document.addEventListener('DOMContentLoaded', function() {
    
    const header = document.getElementById('main-header');

    // Function to handle scroll event
    function handleScroll() {
        if (window.scrollY > 50) {
            // Add 'scrolled' class if user has scrolled more than 50px
            header.classList.add('scrolled');
        } else {
            // Remove 'scrolled' class if user is at the top
            header.classList.remove('scrolled');
        }
    }

    // Add scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

});