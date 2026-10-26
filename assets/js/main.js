/**
 * Portfolio Mahasiswa Teknik Informatika - Main JavaScript
 * Handles: Theme toggle, Smooth Scrollspy, Mobile Menu, Contact Form, WhatsApp link, & Toast alerts
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initScrollSpy();
  initContactForm();
  initBackToTop();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   1. Theme Management (Dark Mode / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");
  const body = document.body;

  // Check saved preference or default to dark theme
  const savedTheme = localStorage.getItem("dika_portfolio_theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (savedTheme === "light" || (!savedTheme && prefersLight)) {
    body.classList.add("light-theme");
    updateThemeIcons(true);
  } else {
    body.classList.remove("light-theme");
    updateThemeIcons(false);
  }

  function toggle() {
    const isLight = body.classList.toggle("light-theme");
    localStorage.setItem("dika_portfolio_theme", isLight ? "light" : "dark");
    updateThemeIcons(isLight);
  }

  if (themeToggle) themeToggle.addEventListener("click", toggle);
  if (themeToggleMobile) themeToggleMobile.addEventListener("click", toggle);

  function updateThemeIcons(isLight) {
    const iconName = isLight ? "moon" : "sun";
    [themeIcon, themeIconMobile].forEach((icon) => {
      if (icon) {
        icon.setAttribute("data-lucide", iconName);
      }
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

/* ==========================================================================
   2. Navbar, Mobile Menu, and Sticky Effects
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById("main-header");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  // Sticky navbar blur/shadow update on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("shadow-md", "py-3");
      header.classList.remove("py-5");
    } else {
      header.classList.remove("shadow-md", "py-3");
      header.classList.add("py-5");
    }
  });

  // Toggle mobile menu drawer
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");

      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", isExpanded ? "menu" : "x");
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Close mobile menu when a navigation item is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }
}

/* ==========================================================================
   3. ScrollSpy (Active Navigation Link Highlighting)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   4. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
      backToTopBtn.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
    } else {
      backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
      backToTopBtn.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   5. Interactive Contact Form with WhatsApp & Email Integration
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const sendEmailBtn = document.getElementById("send-email-btn");
  const sendWhatsAppBtn = document.getElementById("send-whatsapp-btn");

  // WhatsApp number (ganti jika punya nomor khusus)
  const defaultWhatsAppNumber = "6285182301681"; // Format internasional tanpa simbol +
  const defaultEmail = "yudhadika.8030@gmail.com";

  if (!contactForm) return;

  // WhatsApp Sender Handler
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.getElementById("contact-name").value.trim();
      const subject = document.getElementById("contact-subject").value.trim();
      const message = document.getElementById("contact-message").value.trim();

      if (!name || !message) {
        showToast("Mohon isi Nama dan Pesan terlebih dahulu sebelum mengirim ke WhatsApp.", "warning");
        return;
      }

      const formattedText = `*Pesan Baru dari Web Portofolio Mahasiswa Baru 2026*%0A%0A*Nama:* ${encodeURIComponent(name)}%0A*Kategori/Subjek:* ${encodeURIComponent(subject || 'Diskusi / Belajar Bareng')}%0A*Pesan:*%0A${encodeURIComponent(message)}`;
      const waUrl = `https://api.whatsapp.com/send?phone=${defaultWhatsAppNumber}&text=${formattedText}`;

      showToast("Membuka WhatsApp...", "info");
      window.open(waUrl, "_blank");
    });
  }

  // Direct Form Submit / Email Handler
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      showToast("Harap lengkapi semua bidang isian bertanda bintang (*).", "warning");
      return;
    }

    // Validasi email sederhana
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast("Format alamat email tidak valid.", "warning");
      return;
    }

    // Buat link mailto
    const mailtoSubject = encodeURIComponent(`[Portofolio Maba 2026] ${subject || 'Pesan Baru'} dari ${name}`);
    const mailtoBody = encodeURIComponent(`Halo Dika,\n\nNama Pengirim: ${name}\nEmail Pengirim: ${email}\nTopik: ${subject}\n\nIsi Pesan:\n${message}\n\n---\nDikirim melalui Web Portofolio Mahasiswa Baru Teknik Informatika 2026`);
    const mailtoUrl = `mailto:${defaultEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Tampilkan notifikasi dan trigger mailto
    showToast("Terima kasih! Membuka aplikasi email Anda...", "success");
    window.location.href = mailtoUrl;

    // Reset formulir setelah dikirim
    contactForm.reset();
  });
}

/* ==========================================================================
   6. Toast Notifications Helper
   ========================================================================== */
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-md";

  // Setting colors according to type
  if (type === "success") {
    toast.className += " bg-emerald-950/90 text-emerald-200 border-emerald-700/50";
    toast.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i><span>${message}</span>`;
  } else if (type === "warning") {
    toast.className += " bg-amber-950/90 text-amber-200 border-amber-700/50";
    toast.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i><span>${message}</span>`;
  } else {
    toast.className += " bg-blue-950/90 text-blue-200 border-blue-700/50";
    toast.innerHTML = `<i data-lucide="info" class="w-5 h-5 text-blue-400"></i><span>${message}</span>`;
  }

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}
