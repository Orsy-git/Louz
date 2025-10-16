// Données simulées pour les formations
const formationsData = [
    {
        id: 1,
        title: "Deep Learning Spécialization",
        platform: "Coursera",
        rating: 4.8,
        students: 45000,
        duration: "5 mois",
        price: "49€/mois",
        level: "Avancé",
        url: "https://www.coursera.org/specializations/deep-learning"
    },
    {
        id: 2,
        title: "Machine Learning A-Z",
        platform: "Udemy",
        rating: 4.6,
        students: 120000,
        duration: "44h",
        price: "94.99€",
        level: "Intermédiaire",
        url: "https://www.udemy.com/course/machinelearning/"
    },
    {
        id: 3,
        title: "AI For Everyone",
        platform: "Coursera",
        rating: 4.7,
        students: 89000,
        duration: "4 semaines",
        price: "Gratuit",
        level: "Débutant",
        url: "https://www.coursera.org/learn/ai-for-everyone"
    }
];

// URLs des plateformes
const platformUrls = {
    coursera: "https://www.coursera.org",
    udemy: "https://www.udemy.com",
    openclassrooms: "https://www.openclassrooms.com"
};

// Données simulées pour les articles de blog
const blogArticles = [
    {
        id: 1,
        title: "Les nouvelles tendances de l'IA en 2024",
        source: "coursera",
        excerpt: "Découvrez comment l'IA transforme l'éducation en ligne...",
        date: "2024-01-15",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
        readTime: "5 min",
        url: "https://blog.coursera.org"
    },
    {
        id: 2,
        title: "Udemy lance de nouvelles certifications",
        source: "udemy",
        excerpt: "Udemy élargit son catalogue avec des certifications reconnues...",
        date: "2024-01-14",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop",
        readTime: "3 min",
        url: "https://blog.udemy.com"
    },
    {
        id: 3,
        title: "L'impact du ChatGPT sur l'e-learning",
        source: "openclassrooms",
        excerpt: "Comment les assistants IA révolutionnent l'apprentissage en ligne...",
        date: "2024-01-13",
        image: "https://images.unsplash.com/photo-1682687221363-72518513620e?w=400&h=200&fit=crop",
        readTime: "7 min",
        url: "https://blog.openclassrooms.com"
    }
];

// Système d'authentification RÉEL
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('louz_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('louz_current_user')) || null;
        this.init();
    }

    init() {
        this.updateUI();
    }

    // Inscription
    register(userData) {
        // Vérifier si l'email existe déjà
        if (this.users.find(user => user.email === userData.email)) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }

        // Créer l'utilisateur
        const user = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            preferences: []
        };

        this.users.push(user);
        this.saveUsers();
        
        return { success: true, message: 'Compte créé avec succès' };
    }

    // Connexion
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('louz_current_user', JSON.stringify(user));
            this.updateUI();
            return { success: true, message: 'Connexion réussie' };
        } else {
            return { success: false, message: 'Email ou mot de passe incorrect' };
        }
    }

    // Déconnexion
    logout() {
        this.currentUser = null;
        localStorage.removeItem('louz_current_user');
        this.updateUI();
        return { success: true, message: 'Déconnexion réussie' };
    }

    // Sauvegarder les utilisateurs
    saveUsers() {
        localStorage.setItem('louz_users', JSON.stringify(this.users));
    }

    // Mettre à jour l'interface
    updateUI() {
        const loginBtn = document.querySelector('.btn-secondary');
        const registerBtn = document.querySelector('.btn-primary');
        
        if (this.currentUser) {
            loginBtn.textContent = `👤 ${this.currentUser.name}`;
            registerBtn.textContent = 'Déconnexion';
            registerBtn.onclick = () => this.logout();
        } else {
            loginBtn.textContent = 'Connexion';
            registerBtn.textContent = 'S\'inscrire';
            registerBtn.onclick = () => openRegisterModal();
        }
    }

    // Vérifier si connecté
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialiser le système d'auth
const authSystem = new AuthSystem();

// Initialisation du site
document.addEventListener('DOMContentLoaded', function() {
    loadTopFormations();
    loadBlogArticles();
    setupEventListeners();
    simulateRealTimeUpdates();
});

// Charger les formations
function loadTopFormations() {
    const container = document.getElementById('formationsList');
    container.innerHTML = '';
    
    formationsData.forEach(formation => {
        const formationElement = document.createElement('div');
        formationElement.className = 'formation-item';
        formationElement.innerHTML = `
            <div class="formation-info">
                <h4>${formation.title}</h4>
                <p>${formation.platform} • ${formation.duration} • ${formation.level}</p>
            </div>
            <div class="formation-meta">
                <span class="rating">★ ${formation.rating}</span>
                <span class="students">👥 ${formation.students.toLocaleString()}</span>
                <span class="price">${formation.price}</span>
                <button class="btn btn-primary" onclick="openFormation(${formation.id})">Voir</button>
            </div>
        `;
        container.appendChild(formationElement);
    });
}

// Charger les articles de blog
function loadBlogArticles(filter = 'all') {
    const container = document.getElementById('blogGrid');
    container.innerHTML = '';
    
    const filteredArticles = filter === 'all' 
        ? blogArticles 
        : blogArticles.filter(article => article.source === filter);
    
    filteredArticles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'blog-card';
        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div class="blog-content">
                <span class="blog-source">${article.source.toUpperCase()}</span>
                <h4>${article.title}</h4>
                <p>${article.excerpt}</p>
                <div class="blog-meta">
                    <span>${formatDate(article.date)}</span>
                    <span>${article.readTime} de lecture</span>
                </div>
                <button class="btn btn-outline" style="margin-top: 1rem; width: 100%;" onclick="openArticle('${article.url}')">
                    Lire l'article
                </button>
            </div>
        `;
        container.appendChild(articleElement);
    });
}

// Configuration des événements
function setupEventListeners() {
    // Filtres du blog
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadBlogArticles(this.dataset.source);
        });
    });
    
    // Recherche
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function(e) {
        filterFormations(e.target.value);
    });

    // Formulaires d'authentification
    document.querySelector('#loginModal form').addEventListener('submit', handleLogin);
    document.querySelector('#registerModal form').addEventListener('submit', handleRegister);
}

// Gestion de la connexion
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const result = authSystem.login(email, password);
    showNotification(result.message);
    
    if (result.success) {
        closeLoginModal();
        e.target.reset();
    }
}

// Gestion de l'inscription
function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    const result = authSystem.register(userData);
    showNotification(result.message);
    
    if (result.success) {
        closeRegisterModal();
        e.target.reset();
        // Connecter automatiquement
        authSystem.login(userData.email, userData.password);
    }
}

// Navigation
function navigateToFormations(domaine) {
    const domaines = {
        ia: "Intelligence Artificielle",
        web: "Développement Web", 
        data: "Data Science",
        marketing: "Marketing Digital",
        design: "Design UX/UI",
        cyber: "Cybersécurité"
    };
    showNotification(`Redirection vers les formations ${domaines[domaine]}`);
}

function openFormation(formationId) {
    const formation = formationsData.find(f => f.id === formationId);
    if (formation && formation.url) {
        // Ajouter le tracking d'affiliation si l'utilisateur est connecté
        const affiliateUrl = authSystem.isLoggedIn() 
            ? `${formation.url}?ref=louz_${authSystem.currentUser.id}`
            : formation.url;
        
        window.open(affiliateUrl, '_blank');
        showNotification(`Ouverture de ${formation.title}`);
    }
}

function openPlatform(platform) {
    const url = platformUrls[platform];
    if (url) {
        // Ajouter le tracking d'affiliation si l'utilisateur est connecté
        const affiliateUrl = authSystem.isLoggedIn() 
            ? `${url}?ref=louz_${authSystem.currentUser.id}`
            : url;
        
        window.open(affiliateUrl, '_blank');
        showNotification(`Ouverture de ${platform}`);
    }
}

function openArticle(url) {
    window.open(url, '_blank');
    showNotification('Ouverture de l\'article');
}

// Modals
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Fonctionnalités supplémentaires
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if (email && validateEmail(email)) {
        // Sauvegarder dans localStorage
        const subscribers = JSON.parse(localStorage.getItem('louz_newsletter')) || [];
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('louz_newsletter', JSON.stringify(subscribers));
        
        showNotification('🎉 Merci pour votre inscription à la newsletter !');
        document.getElementById('newsletterEmail').value = '';
    } else {
        showNotification('❌ Veuillez entrer un email valide');
    }
}

function openLegal(type) {
    const pages = {
        mentions: 'mentions-legales.html',
        confidentialite: 'confidentialite.html', 
        affiliation: 'affiliation.html'
    };
    window.location.href = pages[type];
}

// Utilitaires
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Filtrage des formations
function filterFormations(searchTerm) {
    const filtered = formationsData.filter(formation => 
        formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const container = document.getElementById('formationsList');
    container.innerHTML = '';
    
    filtered.forEach(formation => {
        const formationElement = document.createElement('div');
        formationElement.className = 'formation-item';
        formationElement.innerHTML = `
            <div class="formation-info">
                <h4>${formation.title}</h4>
                <p>${formation.platform} • ${formation.duration} • ${formation.level}</p>
            </div>
            <div class="formation-meta">
                <span class="rating">★ ${formation.rating}</span>
                <span class="students">👥 ${formation.students.toLocaleString()}</span>
                <span class="price">${formation.price}</span>
                <button class="btn btn-primary" onclick="openFormation(${formation.id})">Voir</button>
            </div>
        `;
        container.appendChild(formationElement);
    });
}

// Simulation des mises à jour en temps réel
function simulateRealTimeUpdates() {
    setInterval(() => {
        const newArticle = {
            id: Date.now(),
            title: `Nouvelle formation disponible - ${new Date().toLocaleTimeString()}`,
            source: 'openclassrooms',
            excerpt: 'Découvrez notre nouvelle sélection de formations mises à jour...',
            date: new Date().toISOString().split('T')[0],
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
            readTime: '2 min',
            url: 'https://blog.openclassrooms.com'
        };
        
        blogArticles.unshift(newArticle);
        if (document.querySelector('.filter-btn.active').dataset.source === 'all' || 
            document.querySelector('.filter-btn.active').dataset.source === 'openclassrooms') {
            loadBlogArticles(document.querySelector('.filter-btn.active').dataset.source);
        }
        
        showNotification('📚 Nouveau contenu disponible !');
        
    }, 30000);
}

// Fermer les modals en cliquant à l'extérieur
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
}