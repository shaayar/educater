// Vars
let currentCourseId = null;

/* ============================================================
  PARTIAL LOADING (HEADER & FOOTER)
   ============================================================ */

/**
 * Loads an HTML partial into a target element
 * @param {string} id - Target element ID
 * @param {string} file - Path to partial HTML file
 */
async function loadPartial(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  const container = document.getElementById(id);
  if (container) {
    container.innerHTML = html;
  }
}

// Load shared layout sections
loadPartial("site-header", "/partials/header.html");
loadPartial("site-footer", "/partials/footer.html");


/* ============================================================
  HERO SECTION: WORD-BY-WORD ANIMATION
   ============================================================ */

/**
 * Animates hero heading text word-by-word upwards.
 * - Preserves spaces
 * - Preserves <br>
 * - Supports inline elements like <span class="strike">
 */
const heading = document.querySelector(".animate-words");

if (heading) {
  const nodes = Array.from(heading.childNodes);
  heading.innerHTML = "";

  let delay = 0;

  nodes.forEach((node) => {
    // Plain text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.trim().split(/\s+/);

      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        span.style.animationDelay = `${delay}s`;

        heading.appendChild(span);
        heading.appendChild(document.createTextNode(" "));
        delay += 0.08;
      });
    }

    // Inline elements (e.g. <span class="strike">)
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
      const span = document.createElement("span");
      span.className = `word ${node.className}`;
      span.textContent = node.textContent;
      span.style.animationDelay = `${delay}s`;

      heading.appendChild(span);
      heading.appendChild(document.createTextNode(" "));
      delay += 0.08;
    }

    // Line breaks
    if (node.nodeName === "BR") {
      heading.appendChild(document.createElement("br"));
    }
  });
}


/* ============================================================
  HOW IT WORKS SECTION: AUTO STEP ANIMATION
   ============================================================ */

/**
 * Automatically cycles through steps and updates the visual
 */
const steps = document.querySelectorAll(".step-item");
const stepImage = document.getElementById("stepImage");

if (steps.length > 0 && stepImage) {
  let currentStep = 0;
  const intervalTime = 3000; // milliseconds per step

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });

    // Smooth image transition
    stepImage.style.opacity = 0;

    setTimeout(() => {
      stepImage.src = `../assets/step-${index + 1}.svg`;
      stepImage.style.opacity = 1;
    }, 200);
  }

  setInterval(() => {
    currentStep = (currentStep + 1) % steps.length;
    showStep(currentStep);
  }, intervalTime);
}


/* ============================================================
  NEWSLETTER FORM SUBMISSION (FRONTEND ONLY)
   ============================================================ */

/**
 * Simple success feedback for newsletter signup
 */
const joinBtn = document.getElementById("joinBtn");

if (joinBtn) {
  joinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Thank you for joining our newsletter!");
  });
}


/* ============================================================
  CART FUNCTIONALITY
   ============================================================ */

/**
 * Cart state management using localStorage
 */
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const savedCart = localStorage.getItem('educaterCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('educaterCart', JSON.stringify(this.cart));
    this.updateCartUI();
  }

  addToCart(course) {
    const existingItem = this.cart.find(item => item.id === course.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      this.cart.push({
        ...course,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.showNotification('Course added to cart!');
  }

  removeFromCart(courseId) {
    this.cart = this.cart.filter(item => item.id !== courseId);
    this.saveCart();
    this.showNotification('Course removed from cart');
  }

  updateQuantity(courseId, quantity) {
    const item = this.cart.find(item => item.id === courseId);
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity) || 1);
      this.saveCart();
    }
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const count = this.getCartCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart manager
const cartManager = new CartManager();

/* ============================================================
  FOOTER / BRAND OUTRO REVEAL ANIMATION
   ============================================================ */

/**
 * Reveals large footer text when it enters the viewport
 */
const revealText = document.querySelector(".reveal-text");

if (revealText) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        revealText.classList.add("in-view");
        observer.disconnect(); // run once
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(revealText);
}

/* ============================================================
  FOOTER: TESTIMONIALS DATA
============================================================ */

/**
 * Demo Testimonials Data
 */

const testimonials = [
  {
    metric: "3×",
    metricText: "faster learning through real projects",
    quote:
      "Educater helped me move from just watching tutorials to actually building projects.",
    author: "Aarav Sharma",
    role: "Frontend Developer (Student)",
    avatar: "../assets/avatar-placeholder.jpg",
  },
  {
    metric: "2.5×",
    metricText: "better confidence in real-world coding",
    quote:
      "The project-based approach made everything click. I finally understand how things work together.",
    author: "Neha Patel",
    role: "CS Undergraduate",
    avatar: "../assets/avatar-placeholder.jpg",
  },
  {
    metric: "100%",
    metricText: "hands-on learning experience",
    quote:
      "This feels closer to real development than any course I’ve taken before.",
    author: "Rohit Verma",
    role: "Self-taught Developer",
    avatar: "../assets/avatar-placeholder.jpg",
  },
];

/**
 * Dynamic Testimonials Logic
 */

let currentTestimonial = 0;

const metricEl = document.getElementById("testimonialMetric");
const metricTextEl = document.getElementById("testimonialMetricText");
const quoteEl = document.getElementById("testimonialQuote");
const authorEl = document.getElementById("testimonialAuthor");
const avatarEl = document.getElementById("testimonialAvatar");
const card = document.querySelector(".testimonial-card");

function showTestimonial(index) {
  const t = testimonials[index];

  card.classList.add("fade-out");

  setTimeout(() => {
    metricEl.textContent = t.metric;
    metricTextEl.textContent = t.metricText;
    quoteEl.textContent = `“${t.quote}”`;
    authorEl.innerHTML = `<strong>${t.author}</strong><br />${t.role}`;
    avatarEl.src = t.avatar;

    card.classList.remove("fade-out");
  }, 300);
}

setInterval(() => {
  currentTestimonial =
    (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

/* ============================================================
  TABS FUNCTIONALITY
   ============================================================ */

/**
 * Course preview card logic
 */

console.log("Tabs and Modals Loaded");

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

const courseCards = document.querySelectorAll(".course-card");
const courseModal = new bootstrap.Modal(
  document.getElementById("courseModal")
);

courseCards.forEach(card => {
  card.addEventListener("click", () => {
    // Populate modal content
    document.getElementById("modalTitle").textContent = card.dataset.title;
    document.getElementById("modalDescription").textContent = card.dataset.description;
    document.getElementById("modalCategory").textContent = card.dataset.category;
    document.getElementById("modalPrice").textContent = card.dataset.price;

    currentCourseId = card.dataset.id;

    const video = document.getElementById("modalVideo");
    if (video) {
      video.src = card.dataset.video || "https://www.pexels.com/download/video/4124024/";
    }

    // Show modal
    courseModal.show();
  });
});

document.getElementById("joinCourseBtn").addEventListener("click", () => {
  window.location.href = `/pages/course-details.html?id=${currentCourseId}`;
});


