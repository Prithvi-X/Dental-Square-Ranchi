/**
 * Dental Square — Patient Website Script (Phase 1 Final Implementation)
 * Features:
 *   1. Mobile Navigation Drawer (Open / Close / Focus Management)
 *   2. Phase 2 Booking Bridge Modal Dialog
 *   3. FAQ Accordion Expansion
 *   4. Sticky Header Dynamic Shadow
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Mobile Menu Drawer Navigation
  // ==========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  let lastFocusedElement = null;

  function openDrawer() {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    lastFocusedElement = document.activeElement;
    mobileDrawer.classList.add('active');
    mobileDrawerOverlay.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    if (drawerCloseBtn) {
      setTimeout(() => drawerCloseBtn.focus(), 100);
    }
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    mobileDrawer.classList.remove('active');
    mobileDrawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 2. Phase 2 Live Appointment Booking
  // ==========================================================================
  // In Phase 2, booking buttons and service cards navigate directly to book.html
  // and specialist/service sub-paths.

  // ==========================================================================
  // 3. FAQ Accordion Toggle
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-row-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-header-btn');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherTrigger = otherItem.querySelector('.faq-header-btn');
        if (otherTrigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================================================
  // 4. Global Keyboard Listener (Escape key)
  // ==========================================================================
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (bookingModal && bookingModal.classList.contains('active')) {
        closeBookingModal();
      } else if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  // ==========================================================================
  // 5. Sticky Header Scroll Indicator
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.style.boxShadow = '0 2px 10px rgba(15, 44, 89, 0.08)';
    } else {
      siteHeader.style.boxShadow = 'none';
    }
  }, { passive: true });

  // ==========================================================================
  // 6. 360° Virtual Tour Redirection
  // ==========================================================================
  const googleMaps360Url = "https://www.google.com/maps/place/Dental+Square/@23.373404,85.337637,3a,75y,80h,90t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgIC4yrOGxQE!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAHRPTWlpWa_CK8AJX16fG5uVHTmIT4thxf5ijekeCQgcRRRweSBAlnJT5XUc9ukEPXFtZdyWGZEjMGR2qvlS8HZIgJFey4W2L-UystDRAJI45du_-Gjw8PRJSnMgUspNCJpSdx9RSb7whQ%3Dw900-h600-k-no-pi0-ya80-ro0-fo100!7i10742!8i5371!4m9!3m8!1s0x39f51d89aaaaaaab:0x12b76d40171d710d!8m2!3d23.3708656!4d85.3392612!10e5!14m1!1BCgIgARICCAI!16s%2Fg%2F11c5fz4s0d?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D";
  const tourTriggers = document.querySelectorAll('.tour-mockup-frame, [data-tour-trigger="true"]');
  tourTriggers.forEach(el => {
    if (el.tagName !== 'A') {
      el.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        window.open(googleMaps360Url, '_blank', 'noopener,noreferrer');
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(googleMaps360Url, '_blank', 'noopener,noreferrer');
        }
      });
    }
  });

})();
