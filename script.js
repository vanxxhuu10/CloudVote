// Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        // Animate stats on scroll
        function animateStats() {
            const statsSection = document.querySelector('.stats');
            const rect = statsSection.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateCounter('votesCount', 2500000, 'M+', 2000);
                animateCounter('electionsCount', 500, '+', 1500);
                animateCounter('countriesCount', 45, '+', 1000);
                // Remove the scroll listener after animation
                window.removeEventListener('scroll', animateStats);
            }
        }

        function animateCounter(id, target, suffix, duration) {
            const element = document.getElementById(id);
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (id === 'votesCount') {
                    element.textContent = (current / 1000000).toFixed(1) + suffix;
                } else if (id === 'uptimeCount') {
                    element.textContent = '99.9%';
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        }

        window.addEventListener('scroll', animateStats);

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Interactive feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        const loginBtn = document.getElementById('loginBtn');

  // Add hover effects dynamically
  loginBtn.addEventListener("mouseover", () => {
    loginBtn.style.transform = "scale(1.05)";
    loginBtn.style.background = "linear-gradient(90deg, #45a049, #4CAF50)";
  });

  loginBtn.addEventListener("mouseout", () => {
    loginBtn.style.transform = "scale(1)";
    loginBtn.style.background = "linear-gradient(90deg, #4CAF50, #45a049)";
  });

  // Redirect to login.html on click
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });