document.addEventListener('DOMContentLoaded', () => {
    // Get username from localStorage
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/';
    }
    document.getElementById('username').textContent = username;
    document.getElementById('profile-name').textContent = username;

    // Function to show loading indicator
    function showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('newsGrid').innerHTML = '';
    }

    // Function to hide loading indicator
    function hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    // Function to create news card
    function createNewsCard(article) {
        return `
            <div class="news-card">
                <h2>${article.title || 'No Title'}</h2>
                <div class="time-indicator">
                    ⏱ ${Math.ceil(article.description?.length / 1000) || 5} min read
                </div>
                <p class="news-description">
                    ${article.description || 'No description available'}
                </p>
                <button class="read-more-btn" onclick="window.open('${article.url}', '_blank')">
                    Read More
                </button>
            </div>
        `;
    }

    // Function to load news
    async function loadNews(category) {
        showLoading();
        try {
            console.log('Fetching news for category:', category);
            const response = await fetch(`/api/news/${category}`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const articles = await response.json();
            console.log('Received articles:', articles);

            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = articles.length > 0 
                ? articles.map(article => createNewsCard(article)).join('')
                : '<p>No news found for this category.</p>';
        } catch (error) {
            console.error('Error loading news:', error);
            document.getElementById('newsGrid').innerHTML = 
                '<p>Error loading news. Please try again later.</p>';
        } finally {
            hideLoading();
        }
    }

    // Add click handlers for navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            document.querySelectorAll('.nav-item').forEach(i => 
                i.classList.remove('active'));
            item.classList.add('active');
            loadNews(category);
        });
    });

    // Add search functionality
    const searchBar = document.querySelector('.search-bar');
    let searchTimeout;
    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                loadNews(searchTerm);
            }
        }, 500);
    });

    // Load initial news
    loadNews('technology');
});