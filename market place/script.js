document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
    
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            const phonePattern = /^\d{11}$/;

            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
            } else if (!phonePattern.test(phone)) {
                alert('Please enter a valid phone number with 11 digits.');
            } else {
                
                window.location.href = 'index.html';
            }
        });
    }

    const productList = document.getElementById('product-list');
    if (productList) {
        fetch('https://api.escuelajs.co/api/v1/products')
            .then(response => response.json())
            .then(data => {
                const slidesContainer = document.querySelector('.slides');
                slidesContainer.innerHTML = ''; 

                data.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <img src="${product.images[0]}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>Price: $${product.price}</p>
                        <button class="add-to-cart" data-id="${product.id}" data-price="${product.price}">Add to Cart</button>
                        <button class="remove-from-cart" data-id="${product.id}" data-price="${product.price}" style="display: none;">Remove from Cart</button>
                    `;
                    productList.appendChild(productItem);

                  
                    product.images.forEach(image => {
                        const slide = document.createElement('img');
                        slide.src = image;
                        slide.alt = product.title;
                        slidesContainer.appendChild(slide);
                    });
                });

              
                initializeSlider();

                
                setupCartButtons();
            });
    }

    function initializeSlider() {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slides img');
        const prev = document.querySelector('.prev');
        const next = document.querySelector('.next');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }

        function prevSlide() {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        }

        next.addEventListener('click', nextSlide);
        prev.addEventListener('click', prevSlide);

        setInterval(nextSlide, 3000); 

        showSlide(slideIndex); 
    }


    const scrollToTopButton = document.getElementById('scrollToTop');
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    let cart = [];

    function setupCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productPrice = parseFloat(this.getAttribute('data-price'));

                addToCart(productId, productPrice, this);
            });
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productPrice = parseFloat(this.getAttribute('data-price'));

                removeFromCart(productId, productPrice, this);
            });
        });
    }

    function addToCart(id, price, button) {
        if (!cart.includes(id)) {
            cart.push(id);
            updateTotalPrice(price);

            button.style.display = 'none';
            button.nextElementSibling.style.display = 'inline-block'; 
        }
    }

    function removeFromCart(id, price, button) {
        const index = cart.indexOf(id);
        if (index > -1) {
            cart.splice(index, 1);
            updateTotalPrice(-price);

            button.style.display = 'none';
            button.previousElementSibling.style.display = 'inline-block'; 
        }
    }

    function updateTotalPrice(amount) {
        let totalPrice = parseFloat(document.getElementById('total-price').textContent);
        totalPrice += amount;
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    }
});
