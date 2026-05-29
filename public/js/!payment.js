/**
 * ──────────────────────────────────────────────────────────────────────────────
 * EduStreamix — Payment Access Flow Scripts (Direct Razorpay Flow)
 * ──────────────────────────────────────────────────────────────────────────────
 * Structured into clearly labeled sections for maintainability:
 * - SESSION HANDLING
 * - TOAST SYSTEM
 * - RAZORPAY HANDLERS
 * - SUCCESS FLOW
 * ──────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const payButton = document.getElementById('pay-button');
  const paymentStep = document.querySelector('.payment-step');
  const successState = document.getElementById('success-state');
  const overlay = document.getElementById('page-overlay');
  const lockIcon = document.getElementById('lock-icon');
  const statusText = document.querySelector('.overlay-message');

  // Keys
  const SESSION_KEY = 'EduStreamixAccessSession';

  // Global State
  let isPaymentOpen = false;  // Prevents multiple simultaneous Razorpay popups
  let activeTimers = [];      // Track timeouts for clean memory disposal

  // Helper to safely schedule a timeout and track it
  function safeSetTimeout(callback, delay) {
    const timer = setTimeout(() => {
      // Remove self from active list when executed
      const index = activeTimers.indexOf(timer);
      if (index > -1) activeTimers.splice(index, 1);
      callback();
    }, delay);
    activeTimers.push(timer);
    return timer;
  }

  // Clear all pending timers on page unload or state change
  function clearAllTimers() {
    activeTimers.forEach(clearTimeout);
    activeTimers = [];
  }

  // Safe window-unload listener to prevent memory leaks
  window.addEventListener('unload', () => {
    clearAllTimers();
  });


  /* ==========================================================================
     1. SESSION HANDLING
     ========================================================================== */

  function getStoredSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Session JSON corruption:', e);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function clearStoredSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function saveStoredSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  /**
   * Session security validation.
   * Frontend access check is strictly for UI convenience;
   * Server-side route authorization remains primary defense.
   */
  function isSessionActive() {
    const session = getStoredSession();
    if (!session) return false;
    
    // Strict integrity verification
    const hasValidPaidStatus = (session.paid === true);
    const hasExpiryDate = (session.expiresAt && typeof session.expiresAt === 'number');
    const isNotExpired = (hasExpiryDate && Date.now() < session.expiresAt);
    
    if (hasValidPaidStatus && hasExpiryDate && isNotExpired) {
      return true;
    }
    
    // Safely clear corrupted or expired sessions
    console.warn('Session expired or corrupted. Clearing localStorage session.');
    clearStoredSession();
    return false;
  }

  // Initial access checks
  function initializeState() {
    if (isSessionActive()) {
      // Prevent layout shift, redirect immediately
      window.location.href = '/';
      return;
    }
    
    // Make sure initial step is visible and clear overlays
    if (paymentStep) {
      paymentStep.classList.remove('hidden');
    }
    if (payButton) {
      requestAnimationFrame(() => {
        payButton.focus();
      });
    }
  }


  /* ==========================================================================
     2. TOAST SYSTEM
     ========================================================================== */

  const toastElement = document.getElementById('payment-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastElement) return;

    // Prevent duplicate toast timers
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    // Set content and animate smoothly using transform + opacity only
    toastElement.textContent = message;
    
    requestAnimationFrame(() => {
      toastElement.classList.remove('hidden');
      // Read offsetHeight to force rendering state before transition class
      const forceReflow = toastElement.offsetHeight;
      toastElement.classList.add('show');
    });

    // Auto-hide toast after 3 seconds
    toastTimer = safeSetTimeout(() => {
      toastElement.classList.remove('show');
      safeSetTimeout(() => {
        toastElement.classList.add('hidden');
      }, 350); // wait for CSS transition duration
    }, 3000);
  }


  /* ==========================================================================
     3. RAZORPAY HANDLERS
     ========================================================================== */

  function setLoading(isLoading) {
    if (!payButton) return;
    payButton.disabled = isLoading;
    
    const textNode = payButton.querySelector('.btn-text');
    const spinner = payButton.querySelector('.btn-spinner');
    
    if (isLoading) {
      if (textNode) textNode.textContent = 'PAYING...';
      if (spinner) spinner.classList.remove('hidden');
      payButton.style.cursor = 'wait';
      overlay.classList.add('active');
      if (statusText) statusText.textContent = 'Preparing secure checkout...';
    } else {
      if (textNode) textNode.textContent = 'PAY ₹10 NOW';
      if (spinner) spinner.classList.add('hidden');
      payButton.style.cursor = 'pointer';
      overlay.classList.remove('active');
    }
  }

  async function createOrder() {
    const response = await fetch('/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch((err) => ({ ok: false, _err: err }));

    if (!response || !response.ok) {
      const body = response && response._err ? { error: String(response._err) } : await (response.json().catch(() => ({})));
      throw new Error(body.error || body.message || 'Unable to create payment order.');
    }

    const data = await response.json().catch(() => ({}));
    if (!data || !data.success) {
      throw new Error(data.error || data.message || 'Unable to create payment order.');
    }

    return data;
  }

  async function verifyPaymentServer(payload) {
    const res = await fetch('/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return res.json().catch(() => ({ success: false }));
  }

  function handlePaymentModalClose() {
    isPaymentOpen = false;
    setLoading(false);
    showToast('Payment was not completed.');
  }

  function openRazorpay(orderResponse) {
    if (!window.Razorpay) {
      isPaymentOpen = false;
      throw new Error('Razorpay checkout script failed to load.');
    }

    const order = orderResponse.order;

    const options = {
      key: orderResponse.key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'EduStreamiX',
      description: 'Premium Educational Access',
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      method: {
        upi: true,
        card: false,
        netbanking: false,
        wallet: false,
        emi: false,
        paylater: false
      },
      theme: { color: '#ff8c00', backdrop_color: 'rgba(63,47,30,0.85)' },
      prefill: { name: '', email: '', contact: '' }, // Razorpay collects contact number inside popup
      notes: { platform: 'EduStreamiX' },
      modal: {
        escape: false,
        confirm_close: true,
        ondismiss: function () {
          console.log('Payment modal closed');
          handlePaymentModalClose();
        }
      },
      retry: { enabled: true, max_count: 3 },
      timeout: 900,
      handler: async function (response) {
        try {
          setLoading(true);
          if (statusText) statusText.textContent = 'Verifying Payment...';

          const data = await verifyPaymentServer(response);
          if (data.success) {
            // Unlocked state flow
            isPaymentOpen = false;
            storePaymentSession();
            triggerSuccessAnimation();
          } else {
            // Verify-Payment Failure Handling
            isPaymentOpen = false;
            showToast('Payment verification failed.');
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          isPaymentOpen = false;
          showToast('Payment verification failed.');
          setLoading(false);
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error(response.error);
      isPaymentOpen = false;
      showToast('Payment was not completed.');
      setLoading(false);
    });

    isPaymentOpen = true;
    rzp.open();
  }

  async function handlePayment() {
    // Safe Guard double openings
    if (isPaymentOpen) return;

    try {
      setLoading(true);
      const orderResponse = await createOrder();
      openRazorpay(orderResponse);
    } catch (error) {
      // Network Failure Handling
      console.error(error);
      isPaymentOpen = false;
      showToast('Unable to connect. Please try again.');
      setLoading(false);
    }
  }

  if (payButton) {
    payButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (payButton.disabled || isPaymentOpen) return;
      handlePayment();
    });
  }


  /* ==========================================================================
     4. SUCCESS FLOW
     ========================================================================== */

  function storePaymentSession() {
    const now = Date.now();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000;
    saveStoredSession({
      paid: true,
      paidAt: now,
      expiresAt
    });
  }

  // Custom Confetti Burst Drawing Animation
  function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#ff8c00', '#ffb300', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
    const particleCount = 45;
    
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.backgroundColor = color;
      
      // Center placement
      p.style.left = '50%';
      p.style.top = '50%';
      
      const size = Math.random() * 8 + 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.transform = 'translate(-50%, -50%) scale(0)';
      
      container.appendChild(p);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 40;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 25; // upward bias
      
      const duration = Math.random() * 800 + 1000;
      const rotation = Math.random() * 360 + 180;
      
      p.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1) rotate(45deg)', opacity: 1, offset: 0.15 },
        { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1) rotate(${rotation}deg)`, opacity: 1, offset: 0.75 },
        { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0) rotate(${rotation + 90}deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
        fill: 'forwards'
      });
    }
  }

  function triggerSuccessAnimation() {
    setLoading(false);
    
    // Clear overlay state
    overlay.classList.remove('active');

    // Fade the body background slightly brighter
    document.body.style.background = 'var(--body-bg-success)';

    // Transition info sections to success step
    requestAnimationFrame(() => {
      if (lockIcon) {
        lockIcon.textContent = '🔓';
        lockIcon.classList.remove('locked');
        lockIcon.classList.add('unlocked');
      }
      
      paymentStep.classList.add('fade-out-step');
      
      safeSetTimeout(() => {
        paymentStep.classList.add('hidden');
        paymentStep.classList.remove('fade-out-step');
        
        successState.classList.remove('hidden');
        successState.classList.add('fade-in-step');
        
        // Trigger drawing animations
        triggerConfetti();

        // 2 seconds auto redirect to home "/"
        safeSetTimeout(() => {
          document.body.classList.add('fade-out');
          safeSetTimeout(() => {
            window.location.href = '/';
          }, 400); // fade out length
        }, 1600); // 1600ms + 400ms = exactly 2000ms (2 seconds)
      }, 250);
    });
  }

  // Begin initial state setup
  initializeState();
});
