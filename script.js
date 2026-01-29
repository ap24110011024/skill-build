
const authModal = document.getElementById('authModal');
const btnSignIn = document.getElementById('btnSignIn');
const btnSignUp = document.getElementById('btnSignUp');
const btnGetStarted = document.getElementById('btnGetStarted');
const modalClose = document.getElementById('modalClose');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToSignIn = document.getElementById('switchToSignIn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userProfile = document.getElementById('userProfile');
const btnLogout = document.getElementById('btnLogout');
const userAvatar = document.getElementById('userAvatar');

const progressTracker = document.getElementById('progressTracker');
const progressPercentage = document.getElementById('progressPercentage');
const progressBarFill = document.getElementById('progressBarFill');

const searchIconBtn = document.getElementById('searchIconBtn');
const searchInput = document.getElementById('searchInput');

const btnMoreCourses = document.getElementById('btnMoreCourses');
const coursesGrid = document.getElementById('coursesGrid');

const btnMoreProjects = document.getElementById('btnMoreProjects');
const projectsGrid = document.getElementById('projectsGrid');

const roadmapTopics = document.getElementById('roadmapTopics');
const roadmapDetail = document.getElementById('roadmapDetail');
const btnBackToRoadmaps = document.getElementById('btnBackToRoadmaps');
const roadmapTopicCards = document.querySelectorAll('.roadmap-topic-card');

const aiChatModal = document.getElementById('aiChatModal');
const btnChatAI = document.getElementById('btnChatAI');
const myBotCard = document.getElementById('myBotCard');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatSend = document.getElementById('aiChatSend');
const aiChatMessages = document.getElementById('aiChatMessages');

const btnJoinDiscussion = document.getElementById('btnJoinDiscussion');

const mobileMenuToggle = document.getElementById('mobileMenuToggle');

const feedbackButton = document.getElementById('feedbackButton');
const feedbackModal = document.getElementById('feedbackModal');
const feedbackModalClose = document.getElementById('feedbackModalClose');

const notesWidget = document.getElementById('notesWidget');
const notesButton = document.getElementById('notesButton');
const notesModal = document.getElementById('notesModal');
const notesModalClose = document.getElementById('notesModalClose');
const notesTextarea = document.getElementById('notesTextarea');
const btnSaveNotes = document.getElementById('btnSaveNotes');
const btnCloseNotes = document.getElementById('btnCloseNotes');

let currentTestimonialIndex = 0;
let testimonialInterval = null;

let isLoggedIn = false;
let currentUser = null;
let coursesExpanded = false;
let projectsExpanded = false;
let currentRoadmap = null;
let userProgress = 65;

const NOTES_STORAGE_KEY = 'skillbuild_user_notes';

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            userProgress = parseInt(savedProgress);
        }
        
        updateAuthUI();
        updateProgressTracker();
    }
    
    
    initTestimonialsSlider();
});

function openModal(showSignUp = false) {
    authModal.classList.add('active');
    if (showSignUp) {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    } else {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
    }
}

function closeModal() {
    authModal.classList.remove('active');
}

btnSignIn.addEventListener('click', () => openModal(false));
btnSignUp.addEventListener('click', () => openModal(true));
btnGetStarted.addEventListener('click', () => {
    if (!isLoggedIn) {
        openModal(true);
    } else {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    }
});
modalClose.addEventListener('click', closeModal);

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModal();
    }
});

switchToSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
});

switchToSignIn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        userProgress = Math.floor(Math.random() * 40) + 50;
        localStorage.setItem('userProgress', userProgress);
        
        updateAuthUI();
        updateProgressTracker();
        closeModal();
        loginForm.reset();
        showNotification('Welcome back! You are now logged in.');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (name && email && password) {
        currentUser = {
            email: email,
            name: name
        };
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        userProgress = 15;
        localStorage.setItem('userProgress', userProgress);
        
        updateAuthUI();
        updateProgressTracker();
        closeModal();
        registerForm.reset();
        showNotification('Account created successfully! Welcome to SKILL BUILD.');
    }
});

btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProgress');
    updateAuthUI();
    hideProgressTracker();
    showNotification('You have been logged out.');
});

function updateAuthUI() {
    if (isLoggedIn && currentUser) {
        btnSignIn.style.display = 'none';
        btnSignUp.style.display = 'none';
        userProfile.style.display = 'flex';
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    } else {
        btnSignIn.style.display = 'block';
        btnSignUp.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

function updateProgressTracker() {
    if (isLoggedIn) {
        progressTracker.style.display = 'block';
        progressPercentage.textContent = userProgress + '%';
        progressBarFill.style.width = userProgress + '%';
        
        setTimeout(() => {
            progressBarFill.style.width = userProgress + '%';
        }, 100);
    }
}

function hideProgressTracker() {
    progressTracker.style.display = 'none';
}

function incrementProgress(amount = 5) {
    if (isLoggedIn && userProgress < 100) {
        userProgress = Math.min(100, userProgress + amount);
        localStorage.setItem('userProgress', userProgress);
        updateProgressTracker();
    }
}

searchIconBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
        searchInput.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchIconBtn.contains(e.target)) {
        searchInput.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.classList.contains('active')) {
        searchInput.classList.remove('active');
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    console.log('Searching for:', query);
});

btnMoreCourses.addEventListener('click', () => {
    const hiddenCourses = document.querySelectorAll('.course-card.course-hidden');
    const visibleCourses = document.querySelectorAll('.course-card.course-visible');
    
    if (!coursesExpanded) {
        hiddenCourses.forEach((course, index) => {
            setTimeout(() => {
                course.classList.remove('course-hidden');
                course.classList.add('course-visible');
            }, index * 100);
        });
        btnMoreCourses.innerHTML = 'Show Less <span class="arrow-icon">↑</span>';
        btnMoreCourses.classList.add('expanded');
        coursesExpanded = true;
        
        incrementProgress(3);
    } else {
        visibleCourses.forEach(course => {
            course.classList.remove('course-visible');
            course.classList.add('course-hidden');
        });
        btnMoreCourses.innerHTML = 'More <span class="arrow-icon">→</span>';
        btnMoreCourses.classList.remove('expanded');
        coursesExpanded = false;
    }
});

btnMoreProjects.addEventListener('click', () => {
    const hiddenProjects = document.querySelectorAll('.project-card.project-hidden');
    const visibleProjects = document.querySelectorAll('.project-card.project-visible');
    
    if (!projectsExpanded) {
        hiddenProjects.forEach((project, index) => {
            setTimeout(() => {
                project.classList.remove('project-hidden');
                project.classList.add('project-visible');
            }, index * 100);
        });
        btnMoreProjects.innerHTML = 'Show Less <span class="arrow-icon">↑</span>';
        btnMoreProjects.classList.add('expanded');
        projectsExpanded = true;
        
        incrementProgress(3);
    } else {
        visibleProjects.forEach(project => {
            project.classList.remove('project-visible');
            project.classList.add('project-hidden');
        });
        btnMoreProjects.innerHTML = 'More <span class="arrow-icon">→</span>';
        btnMoreProjects.classList.remove('expanded');
        projectsExpanded = false;
    }
});

roadmapTopicCards.forEach(card => {
    card.addEventListener('click', () => {
        const topic = card.getAttribute('data-topic');
        showRoadmapDetail(topic);
        
        incrementProgress(5);
    });
});

function showRoadmapDetail(topic) {
    currentRoadmap = topic;
    
    roadmapTopics.style.display = 'none';
    roadmapDetail.style.display = 'block';
    
    document.getElementById('roadmapCSE').style.display = 'none';
    document.getElementById('roadmapECE').style.display = 'none';
    document.getElementById('roadmapBUSINESS').style.display = 'none';
    
    const roadmapId = 'roadmap' + topic.toUpperCase();
    const roadmapElement = document.getElementById(roadmapId);
    if (roadmapElement) {
        roadmapElement.style.display = 'block';
    }
    
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btnBackToRoadmaps.addEventListener('click', () => {
    roadmapDetail.style.display = 'none';
    roadmapTopics.style.display = 'grid';
    currentRoadmap = null;
    
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    startTestimonialRotation();
}

function goToTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonialIndex = index;
    
    stopTestimonialRotation();
    startTestimonialRotation();
}

function nextTestimonial() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
    goToTestimonial(currentTestimonialIndex);
}

function startTestimonialRotation() {
    testimonialInterval = setInterval(nextTestimonial, 4000); // Change every 4 seconds
}

function stopTestimonialRotation() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

document.querySelector('.testimonials-slider')?.addEventListener('mouseenter', stopTestimonialRotation);
document.querySelector('.testimonials-slider')?.addEventListener('mouseleave', startTestimonialRotation);

const aiResponses = [
    "That's a great question! For programming fundamentals, I recommend starting with Python as it has a gentle learning curve and versatile applications.",
    "I understand your concern. The best way to learn is through consistent practice. Try building small projects daily and gradually increase complexity.",
    "Excellent question! For web development, master HTML, CSS, and JavaScript first before moving to frameworks like React or Vue.",
    "Data structures and algorithms are crucial for technical interviews. Start with arrays, linked lists, and trees, then progress to graphs and dynamic programming.",
    "Version control with Git is essential for modern development. Start by learning basic commands like commit, push, pull, and branch.",
    "For backend development, Node.js is beginner-friendly if you already know JavaScript. Alternatively, Python with Django or Flask is also great.",
    "Responsive design is best achieved using CSS Flexbox and Grid. Practice with real projects and use mobile-first approach.",
    "Consistency is key in learning! Try to code for at least 30-60 minutes every day. Small daily progress adds up over time.",
    "For embedded systems, start with Arduino. It's perfect for beginners to understand hardware-software interaction without being overwhelming.",
    "Business analytics requires both technical skills (Excel, SQL, Power BI) and business understanding. Start with Excel basics and work your way up.",
    "Digital marketing is evolving rapidly. Focus on SEO, social media marketing, and analytics. Google Analytics and Facebook Ads are great starting points.",
    "For machine learning, ensure you have a strong foundation in Python, statistics, and linear algebra before diving into TensorFlow or PyTorch.",
];

function openAIChatModal() {
    aiChatModal.classList.add('active');
    aiChatInput.focus();
    incrementProgress(2);
}

function closeAIChatModal() {
    aiChatModal.classList.remove('active');
}

btnChatAI.addEventListener('click', (e) => {
    e.stopPropagation();
    openAIChatModal();
});

myBotCard.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-support')) {
        openAIChatModal();
    }
});

aiChatClose.addEventListener('click', closeAIChatModal);


aiChatModal.addEventListener('click', (e) => {
    if (e.target === aiChatModal) {
        closeAIChatModal();
    }
});


function sendAIMessage() {
    const message = aiChatInput.value.trim();
    
    if (message === '') return;
    
    addAIMessage(message, 'user');
    aiChatInput.value = '';
    
    incrementProgress(1);
    
    setTimeout(() => {
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addAIMessage(randomResponse, 'bot');
    }, 1000);
}

function addAIMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}`;
    avatar.textContent = sender === 'bot' ? '🤖' : (currentUser ? currentUser.name.charAt(0).toUpperCase() : '👤');
    
    const content = document.createElement('div');
    content.className = 'message-content';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}
aiChatSend.addEventListener('click', sendAIMessage);
aiChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendAIMessage();
    }
});
btnJoinDiscussion.addEventListener('click', () => {
    showNotification('Discussion forum coming soon! Connect with fellow learners.');
    incrementProgress(2);
});

mobileMenuToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#fff';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
            
            incrementProgress(1);
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .course-card, .project-card, .roadmap-step, .roadmap-topic-card, .support-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

window.addEventListener('resize', () => {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.padding = '0';
        navLinks.style.boxShadow = 'none';
    } else {
        navLinks.style.display = 'none';
    }
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #D4A373 0%, #C49363 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

feedbackButton.addEventListener('click', () => {
    feedbackModal.classList.add('active');
});

feedbackModalClose.addEventListener('click', () => {
    feedbackModal.classList.remove('active');
});

feedbackModal.addEventListener('click', (e) => {
    if (e.target === feedbackModal) {
        feedbackModal.classList.remove('active');
    }
});


function loadNotes() {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }
}

function saveNotes() {
    const notes = notesTextarea.value;
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
    showNotification('Notes saved successfully!');
}

function openNotesModal() {
    notesModal.classList.add('active');
    loadNotes();
    notesTextarea.focus();
}

function closeNotesModal() {
    notesModal.classList.remove('active');
}

notesButton.addEventListener('click', openNotesModal);
notesModalClose.addEventListener('click', closeNotesModal);
btnCloseNotes.addEventListener('click', closeNotesModal);

btnSaveNotes.addEventListener('click', saveNotes);

notesModal.addEventListener('click', (e) => {
    if (e.target === notesModal) {
        closeNotesModal();
    }
});

setInterval(() => {
    if (notesTextarea.value.trim() !== '') {
        const currentNotes = notesTextarea.value;
        const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
        

        if (currentNotes !== savedNotes) {
            localStorage.setItem(NOTES_STORAGE_KEY, currentNotes);
            console.log('Notes auto-saved');
        }
    }
}, 30000);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (notesModal.classList.contains('active')) {
            e.preventDefault();
            saveNotes();
        }
    }
});

let lastSection = null;
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id && entry.target.id !== lastSection) {
            lastSection = entry.target.id;
            if (isLoggedIn) {
                incrementProgress(2);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

console.log('SKILL BUILD - Website loaded successfully!');
console.log('✅ Testimonials: Auto-rotating, one visible at a time');
console.log('✅ AI Doubt Solver: Opens as modal on "My Bot" click');
console.log('✅ Student Community: Ready for connections');
console.log('✅ Notes feature: Persistent storage enabled');