
    // Wait for the page to fully load
    window.addEventListener('load', function () {
        // Hide the preloader
        document.getElementById('preloader').style.opacity = '0';
        // After 2 seconds, remove the preloader from the DOM
        setTimeout(function () {
            document.getElementById('preloader').style.display = 'none';
        }, 1000); // Adjust the delay to 2000 milliseconds (2 seconds)
    });