document.addEventListener('DOMContentLoaded', (event) => {

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');
            console.log(`Navegando para: ${this.textContent}`);
        });
    });

    const detailsModal = document.getElementById('details-modal');
    const closeBtn = document.getElementById('close-details-modal');
    const visualizeButtons = document.querySelectorAll('.visualizar-btn');

    function showDetailsModal() {
        if (detailsModal) {

            console.log('Botão Visualizar clicado. Exibindo modal.');
            detailsModal.style.display = 'flex';
        }
    }

    function hideDetailsModal() {
        if (detailsModal) {
            detailsModal.style.display = 'none';
        }
    }

    visualizeButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            showDetailsModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', hideDetailsModal);
    }

    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                hideDetailsModal();
            }
        });
    }

});