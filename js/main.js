// ============================================
// IRON HOUSE GYM - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Back to top button ---
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll fade-in animations ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && navItems.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // --- Contact form handling ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          submitBtn.textContent = 'MESSAGE SENT!';
          submitBtn.style.background = '#27ae60';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            contactForm.reset();
          }, 3000);
        } else {
          submitBtn.textContent = 'ERROR — TRY AGAIN';
          submitBtn.style.background = '#c0392b';
          submitBtn.disabled = false;
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
          }, 3000);
        }
      } catch (err) {
        submitBtn.textContent = 'ERROR — TRY AGAIN';
        submitBtn.style.background = '#c0392b';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // --- 3 Day Pass Popup ---
  const passModal = document.getElementById('pass-modal');
  const modalClose = document.getElementById('modal-close');
  const openPassBtn = document.getElementById('open-pass-modal');
  const passForm = document.getElementById('pass-form');

  function openModal() {
    passModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    passModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Auto-show popup after 5 seconds (only once per session)
  if (passModal && !sessionStorage.getItem('passModalShown')) {
    setTimeout(() => {
      openModal();
      sessionStorage.setItem('passModalShown', 'true');
    }, 5000);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on overlay click (not modal content)
  if (passModal) {
    passModal.addEventListener('click', (e) => {
      if (e.target === passModal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && passModal.classList.contains('active')) closeModal();
    });
  }

  // Open modal from banner button
  if (openPassBtn) {
    openPassBtn.addEventListener('click', openModal);
  }

  // Open modal from any element with data-open-pass
  document.querySelectorAll('[data-open-pass]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Pass form submission via Formspree
  if (passForm) {
    passForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = passForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(passForm.action, {
          method: 'POST',
          body: new FormData(passForm),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          submitBtn.textContent = 'DOWNLOADING YOUR PASS!';
          submitBtn.style.background = '#27ae60';

          // Auto-download the 3-Day Pass PDF
          const link = document.createElement('a');
          link.href = 'images/3-day-pass.pdf';
          link.download = 'Iron_House_3_Day_Pass.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            closeModal();
            passForm.reset();
            submitBtn.textContent = 'Claim';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        } else {
          submitBtn.textContent = 'ERROR — TRY AGAIN';
          submitBtn.style.background = '#c0392b';
          submitBtn.disabled = false;
          setTimeout(() => {
            submitBtn.textContent = 'Claim';
            submitBtn.style.background = '';
          }, 3000);
        }
      } catch (err) {
        submitBtn.textContent = 'ERROR — TRY AGAIN';
        submitBtn.style.background = '#c0392b';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = 'Claim';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // --- Trainer consult pre-fill ---
  const trainerEmails = {
    'Daniel Lott': 'macrodosemuscle@gmail.com',
    'AmberLynn': 'tamber548@gmail.com',
    'Priscilla': 'priscillatamborini@gmail.com',
    'Julian Magdaleno': 'coachjulian.enigma@gmail.com',
    'Stella': 'Luzabinuman@hotmail.com'
  };

  document.querySelectorAll('[data-trainer]').forEach(link => {
    link.addEventListener('click', () => {
      const trainer = link.getAttribute('data-trainer');
      const interest = document.getElementById('interest');
      const message = document.getElementById('message');
      const subject = document.querySelector('input[name="_subject"]');
      const trainerField = document.getElementById('trainer-field');
      const trainerCc = document.getElementById('trainer-cc');

      if (interest) interest.value = 'personal-training';
      if (message) message.value = `I'd like to book a free consult with ${trainer}.`;
      if (subject) subject.value = `Trainer Consult Request — ${trainer}`;
      if (trainerField) trainerField.value = trainer;
      if (trainerCc && trainerEmails[trainer]) trainerCc.value = trainerEmails[trainer];
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
