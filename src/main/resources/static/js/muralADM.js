document.addEventListener('DOMContentLoaded', (event) => {

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');
        });
    });

});