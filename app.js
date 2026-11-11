/**
 * AutoBiz - Automatic Online Business Landing Page
 * Interactive Logic, Live Dashboard Simulation, ROI Calculator, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State Management
  const state = {
    currency: '$',
    currencyRate: 1,
    billingCycle: 'annual', // 'monthly' | 'annual'
    liveRevenue: 28450.00,
    ordersCount: 418,
    activeAgents: 6,
    soundEnabled: false,
    notificationsEnabled: true
  };

  /* ========================================================
     1. Sticky Navigation & Mobile Menu
     ======================================================== */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-slate-950/90', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-2xl');
    } else {
      navbar.classList.remove('bg-slate-950/90', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-2xl');
    }
  });

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking nav links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  /* ========================================================
     2. ROI / Revenue Potential Calculator
     ======================================================== */
  const visitorsSlider = document.getElementById('calc-visitors');
  const priceSlider = document.getElementById('calc-price');
  const convSlider = document.getElementById('calc-conv');

  const visitorsVal = document.getElementById('calc-visitors-val');
  const priceVal = document.getElementById('calc-price-val');
  const convVal = document.getElementById('calc-conv-val');

  const grossRevEl = document.getElementById('calc-gross-revenue');
  const netProfitEl = document.getElementById('calc-net-profit');
  const hoursSavedEl = document.getElementById('calc-hours-saved');
  const annualRevEl = document.getElementById('calc-annual-revenue');

  const currencyBtns = document.querySelectorAll('.currency-toggle-btn');

  function formatMoney(amount) {
    return state.currency + Math.round(amount * state.currencyRate).toLocaleString();
  }

  function updateCalculator() {
    if (!visitorsSlider || !priceSlider || !convSlider) return;

    const visitors = parseInt(visitorsSlider.value, 10);
    const price = parseInt(priceSlider.value, 10);
    const convRate = parseFloat(convSlider.value);

    // Update display labels
    visitorsVal.textContent = visitors.toLocaleString();
    priceVal.textContent = state.currency + Math.round(price * state.currencyRate);
    convVal.textContent = convRate.toFixed(1) + '%';

    // Calculate figures
    const monthlySales = visitors * (convRate / 100);
    const monthlyGross = monthlySales * price;
    // Estimated automated profit margin (~86% for automated digital/SaaS, minimal cloud cost)
    const monthlyNet = monthlyGross * 0.86;
    const annualGross = monthlyGross * 12;
    // Estimated hours saved (manual fulfillment, lead nurture & customer support would take ~40 hrs/wk)
    const hoursSavedPerWeek = Math.min(65, Math.max(22, Math.round(monthlySales * 0.12 + 18)));

    // Animate or set values
    grossRevEl.textContent = formatMoney(monthlyGross);
    netProfitEl.textContent = formatMoney(monthlyNet);
    annualRevEl.textContent = formatMoney(annualGross) + '/yr';
    hoursSavedEl.textContent = `${hoursSavedPerWeek} hrs/wk`;
  }

  if (visitorsSlider && priceSlider && convSlider) {
    [visitorsSlider, priceSlider, convSlider].forEach(slider => {
      slider.addEventListener('input', updateCalculator);
    });

    // Currency Switcher
    currencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currencyBtns.forEach(b => {
          b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
          b.classList.add('bg-slate-800/80', 'text-slate-400', 'border-slate-700');
        });
        btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');
        btn.classList.remove('bg-slate-800/80', 'text-slate-400', 'border-slate-700');

        const curr = btn.getAttribute('data-currency');
        if (curr === 'USD') {
          state.currency = '$';
          state.currencyRate = 1;
        } else if (curr === 'EUR') {
          state.currency = '€';
          state.currencyRate = 0.92;
        } else if (curr === 'GBP') {
          state.currency = '£';
          state.currencyRate = 0.79;
        }
        updateCalculator();
        updatePricing();
      });
    });

    updateCalculator();
  }

  /* ========================================================
     3. Blueprint Showcase Tabs
     ======================================================== */
  const blueprintTabs = document.querySelectorAll('.blueprint-tab-btn');
  const blueprintPanels = document.querySelectorAll('.blueprint-panel');

  blueprintTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      blueprintTabs.forEach(t => {
        t.classList.remove('active', 'bg-indigo-600/20', 'border-indigo-500', 'text-white');
        t.classList.add('text-slate-400', 'border-transparent', 'hover:bg-slate-800/50');
      });

      tab.classList.add('active', 'bg-indigo-600/20', 'border-indigo-500', 'text-white');
      tab.classList.remove('text-slate-400', 'border-transparent', 'hover:bg-slate-800/50');

      blueprintPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
          panel.classList.add('animate-fadeIn');
        } else {
          panel.classList.add('hidden');
        }
      });

      if (window.lucide) window.lucide.createIcons();
    });
  });

  /* ========================================================
     4. Pricing Billing Cycle Toggle (Monthly vs Annual)
     ======================================================== */
  const billingToggle = document.getElementById('billing-toggle');
  const billingMonthlyLabel = document.getElementById('billing-monthly-label');
  const billingAnnualLabel = document.getElementById('billing-annual-label');

  const priceStarter = document.getElementById('price-starter');
  const priceGrowth = document.getElementById('price-growth');
  const priceEmpire = document.getElementById('price-empire');

  const periodStarter = document.getElementById('period-starter');
  const periodGrowth = document.getElementById('period-growth');
  const periodEmpire = document.getElementById('period-empire');

  function updatePricing() {
    if (!billingToggle) return;
    const isAnnual = billingToggle.checked;
    state.billingCycle = isAnnual ? 'annual' : 'monthly';

    if (isAnnual) {
      billingAnnualLabel.classList.add('text-white', 'font-semibold');
      billingAnnualLabel.classList.remove('text-slate-400');
      billingMonthlyLabel.classList.remove('text-white', 'font-semibold');
      billingMonthlyLabel.classList.add('text-slate-400');

      // 20% discount on annual
      priceStarter.textContent = formatMoney(29);
      priceGrowth.textContent = formatMoney(79);
      priceEmpire.textContent = formatMoney(199);

      periodStarter.textContent = '/ month (billed yearly)';
      periodGrowth.textContent = '/ month (billed yearly)';
      periodEmpire.textContent = '/ month (billed yearly)';
    } else {
      billingMonthlyLabel.classList.add('text-white', 'font-semibold');
      billingMonthlyLabel.classList.remove('text-slate-400');
      billingAnnualLabel.classList.remove('text-white', 'font-semibold');
      billingAnnualLabel.classList.add('text-slate-400');

      priceStarter.textContent = formatMoney(39);
      priceGrowth.textContent = formatMoney(99);
      priceEmpire.textContent = formatMoney(249);

      periodStarter.textContent = '/ month';
      periodGrowth.textContent = '/ month';
      periodEmpire.textContent = '/ month';
    }
  }

  if (billingToggle) {
    billingToggle.addEventListener('change', updatePricing);
  }

  /* ========================================================
     5. FAQ Accordion
     ======================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    questionBtn.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.querySelector('.faq-answer').classList.add('hidden');
        otherItem.querySelector('.faq-icon').classList.remove('rotate-180');
        otherItem.classList.remove('border-indigo-500/50');
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
        item.classList.add('border-indigo-500/50');
      }
    });
  });

  /* ========================================================
     6. Live Dashboard Simulation (Real-Time Ticker & Logs)
     ======================================================== */
  const liveRevenueDisplay = document.getElementById('live-revenue-val');
  const liveOrdersDisplay = document.getElementById('live-orders-val');
  const liveOrderFeed = document.getElementById('live-order-feed');
  const dashboardTabs = document.querySelectorAll('.dash-view-btn');
  const dashboardViews = document.querySelectorAll('.dash-view-content');

  // Dashboard subtabs
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.getAttribute('data-view');
      dashboardTabs.forEach(t => {
        t.classList.remove('bg-indigo-600/30', 'text-white', 'border-indigo-500/50');
        t.classList.add('text-slate-400', 'hover:text-slate-200');
      });
      tab.classList.add('bg-indigo-600/30', 'text-white', 'border-indigo-500/50');
      tab.classList.remove('text-slate-400', 'hover:text-slate-200');

      dashboardViews.forEach(v => {
        if (v.id === `dash-view-${view}`) {
          v.classList.remove('hidden');
        } else {
          v.classList.add('hidden');
        }
      });
      if (window.lucide) window.lucide.createIcons();
    });
  });

  const simulatedProducts = [
    { title: "AI Workflow Kit", price: 129, buyer: "Marcus K., CA", agent: "Agent Ava (Sales Bot)" },
    { title: "Turnkey Micro-SaaS Sub", price: 49, buyer: "Elena R., London", agent: "Agent Nexus (Checkout Bot)" },
    { title: "Automated Agency Blueprint", price: 297, buyer: "Devon S., Austin", agent: "Agent Atlas (Fulfillment)" },
    { title: "E-Com Smart Funnel Pack", price: 89, buyer: "Sofia T., Milan", agent: "Agent Echo (Email Recovery)" },
    { title: "Autonomous Ad Creative Suite", price: 179, buyer: "Kenji M., Tokyo", agent: "Agent Ava (Sales Bot)" },
    { title: "Prompt Engineering SaaS Sub", price: 39, buyer: "Hannah L., Sydney", agent: "Agent Nexus (Checkout Bot)" },
    { title: "Digital Creator Accelerator", price: 349, buyer: "Lucas B., Berlin", agent: "Agent Atlas (Fulfillment)" }
  ];

  let simIndex = 0;

  function simulateNewSale() {
    const sale = simulatedProducts[simIndex % simulatedProducts.length];
    simIndex++;

    state.liveRevenue += sale.price;
    state.ordersCount += 1;

    if (liveRevenueDisplay) {
      liveRevenueDisplay.textContent = formatMoney(state.liveRevenue);
    }
    if (liveOrdersDisplay) {
      liveOrdersDisplay.textContent = state.ordersCount.toLocaleString();
    }

    // Add entry to live dashboard feed if it exists
    if (liveOrderFeed) {
      const item = document.createElement('div');
      item.className = 'order-tick-enter flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all';
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
            +$
          </div>
          <div>
            <div class="text-xs font-semibold text-white">${sale.title}</div>
            <div class="text-[11px] text-slate-400">${sale.buyer} • <span class="text-indigo-400 font-mono">${sale.agent}</span></div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-emerald-400">+${formatMoney(sale.price)}</div>
          <div class="text-[10px] text-slate-500">Just now</div>
        </div>
      `;

      liveOrderFeed.insertBefore(item, liveOrderFeed.firstChild);
      // Keep feed max 5 items
      if (liveOrderFeed.children.length > 5) {
        liveOrderFeed.removeChild(liveOrderFeed.lastChild);
      }
    }

    // Trigger toast notification periodically
    if (state.notificationsEnabled && Math.random() > 0.4) {
      showLiveSaleToast(sale);
    }
  }

  // Interval for live sales simulation (every 7 seconds)
  setInterval(simulateNewSale, 7000);

  /* ========================================================
     7. Live Sale Floating Toast
     ======================================================== */
  const toastContainer = document.getElementById('sale-toast');
  const toastText = document.getElementById('sale-toast-text');
  const toastSubtext = document.getElementById('sale-toast-subtext');
  const toastAmount = document.getElementById('sale-toast-amount');
  const toastClose = document.getElementById('sale-toast-close');

  function showLiveSaleToast(sale) {
    if (!toastContainer) return;
    toastText.textContent = `New Order: ${sale.title}`;
    toastSubtext.textContent = `${sale.buyer} via Autonomous Funnel`;
    toastAmount.textContent = `+${formatMoney(sale.price)}`;

    toastContainer.classList.remove('translate-y-32', 'opacity-0');
    toastContainer.classList.add('translate-y-0', 'opacity-100');

    // Auto-hide after 4 seconds
    setTimeout(() => {
      hideToast();
    }, 4500);
  }

  function hideToast() {
    if (!toastContainer) return;
    toastContainer.classList.add('translate-y-32', 'opacity-0');
    toastContainer.classList.remove('translate-y-0', 'opacity-100');
  }

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  /* ========================================================
     8. Interactive Launch / Free Trial Modal
     ======================================================== */
  const launchModal = document.getElementById('launch-modal');
  const openLaunchModalBtns = document.querySelectorAll('.open-launch-modal-btn');
  const closeLaunchModalBtn = document.getElementById('close-launch-modal');
  const launchForm = document.getElementById('launch-business-form');

  const step1 = document.getElementById('launch-step-1');
  const step2 = document.getElementById('launch-step-2');
  const step3 = document.getElementById('launch-step-3');

  const goToStep2Btn = document.getElementById('go-to-step-2');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const businessNicheCards = document.querySelectorAll('.niche-select-card');
  let selectedNiche = 'Digital Products & Templates';

  businessNicheCards.forEach(card => {
    card.addEventListener('click', () => {
      businessNicheCards.forEach(c => {
        c.classList.remove('border-indigo-500', 'bg-indigo-600/10');
        c.classList.add('border-slate-800', 'bg-slate-900/40');
      });
      card.classList.add('border-indigo-500', 'bg-indigo-600/10');
      card.classList.remove('border-slate-800', 'bg-slate-900/40');
      selectedNiche = card.getAttribute('data-niche');
    });
  });

  function openLaunchModal(prefNiche) {
    if (!launchModal) return;
    launchModal.classList.remove('hidden');
    launchModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Reset steps
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');

    if (prefNiche) {
      businessNicheCards.forEach(c => {
        if (c.getAttribute('data-niche').toLowerCase().includes(prefNiche.toLowerCase())) {
          c.click();
        }
      });
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function closeLaunchModal() {
    if (!launchModal) return;
    launchModal.classList.add('hidden');
    launchModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openLaunchModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const niche = btn.getAttribute('data-pref-niche');
      openLaunchModal(niche);
    });
  });

  if (closeLaunchModalBtn) {
    closeLaunchModalBtn.addEventListener('click', closeLaunchModal);
  }

  if (launchModal) {
    launchModal.addEventListener('click', (e) => {
      if (e.target === launchModal) closeLaunchModal();
    });
  }

  if (goToStep2Btn) {
    goToStep2Btn.addEventListener('click', () => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      const nicheSummary = document.getElementById('selected-niche-summary');
      if (nicheSummary) nicheSummary.textContent = selectedNiche;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  if (launchForm) {
    launchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('lead-name');
      const emailInput = document.getElementById('lead-email');

      if (!emailInput.value) return;

      // Switch to Step 3: Deployment Progress Simulation
      step2.classList.add('hidden');
      step3.classList.remove('hidden');

      const progressBar = document.getElementById('deploy-progress-bar');
      const progressText = document.getElementById('deploy-status-text');

      const deploySteps = [
        { pct: 25, text: "Configuring Autonomous AI Core..." },
        { pct: 55, text: `Synthesizing ${selectedNiche} Funnel...` },
        { pct: 85, text: "Connecting Stripe & Global Payment Rails..." },
        { pct: 100, text: "Ready! Your automated business instance is live." }
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < deploySteps.length) {
          const s = deploySteps[stepIndex];
          progressBar.style.width = `${s.pct}%`;
          progressText.textContent = s.text;
          stepIndex++;
        } else {
          clearInterval(interval);
          // Confetti celebration
          if (window.confetti) {
            window.confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          const successBanner = document.getElementById('deploy-success-banner');
          if (successBanner) {
            successBanner.classList.remove('hidden');
          }
        }
      }, 700);
    });
  }

  /* ========================================================
     9. Interactive Demo Video / Interactive Tour Modal
     ======================================================== */
  const demoModal = document.getElementById('demo-modal');
  const openDemoBtns = document.querySelectorAll('.open-demo-modal-btn');
  const closeDemoModalBtn = document.getElementById('close-demo-modal');
  const demoPlayBtn = document.getElementById('demo-play-btn');
  const demoProgressBar = document.getElementById('demo-progress');
  const demoChapterBtns = document.querySelectorAll('.demo-chapter-btn');
  const demoVideoState = document.getElementById('demo-video-state');

  let isPlaying = false;
  let demoProgress = 0;
  let demoTimer = null;

  function openDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('hidden');
    demoModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    startDemoPlay();
    if (window.lucide) window.lucide.createIcons();
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.add('hidden');
    demoModal.classList.remove('flex');
    document.body.style.overflow = '';
    pauseDemo();
  }

  function startDemoPlay() {
    isPlaying = true;
    if (demoPlayBtn) {
      demoPlayBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    clearInterval(demoTimer);
    demoTimer = setInterval(() => {
      demoProgress += 1;
      if (demoProgress > 100) demoProgress = 0;
      if (demoProgressBar) demoProgressBar.style.width = `${demoProgress}%`;

      // Update chapter highlighting based on progress
      if (demoProgress < 25) {
        setChapterActive(0);
      } else if (demoProgress < 50) {
        setChapterActive(1);
      } else if (demoProgress < 75) {
        setChapterActive(2);
      } else {
        setChapterActive(3);
      }
    }, 200);
  }

  function pauseDemo() {
    isPlaying = false;
    clearInterval(demoTimer);
    if (demoPlayBtn) {
      demoPlayBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 ml-0.5"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function setChapterActive(index) {
    demoChapterBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('bg-indigo-600/30', 'border-indigo-500', 'text-white');
        btn.classList.remove('border-slate-800', 'text-slate-400');
        const title = btn.querySelector('.chapter-title');
        if (demoVideoState && title) {
          demoVideoState.textContent = `Scene: ${title.textContent}`;
        }
      } else {
        btn.classList.remove('bg-indigo-600/30', 'border-indigo-500', 'text-white');
        btn.classList.add('border-slate-800', 'text-slate-400');
      }
    });
  }

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal();
    });
  });

  if (closeDemoModalBtn) closeDemoModalBtn.addEventListener('click', closeDemoModal);
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeDemoModal();
    });
  }

  if (demoPlayBtn) {
    demoPlayBtn.addEventListener('click', () => {
      if (isPlaying) pauseDemo();
      else startDemoPlay();
    });
  }

  demoChapterBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      demoProgress = idx * 25;
      if (demoProgressBar) demoProgressBar.style.width = `${demoProgress}%`;
      setChapterActive(idx);
      if (!isPlaying) startDemoPlay();
    });
  });

  /* ========================================================
     10. Live AI Chatbot Widget (Bottom Right)
     ======================================================== */
  const chatToggleBtn = document.getElementById('chat-widget-toggle');
  const chatBox = document.getElementById('chat-widget-box');
  const chatCloseBtn = document.getElementById('chat-widget-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatPromptChips = document.querySelectorAll('.chat-chip-btn');

  const botResponses = {
    'how it works': "AutoBiz uses 5 specialized AI agents to handle 100% of your business operations: lead capture, sales conversion, payment processing, product delivery, and ongoing support. You select a blueprint, connect your payment payout account, and the engine runs 24/7 autonomously.",
    'technical skills': "None whatsoever! You don't need to write code, design websites, or set up databases. AutoBiz is a completely turnkey system designed for entrepreneurs who value time.",
    'how i get paid': "All sales are processed via our direct Stripe & PayPal integrations straight into your local bank account. AutoBiz does not hold your funds—payouts are transferred automatically on a rolling 24-hour schedule.",
    'pricing': "We offer a 14-day zero-risk trial. Plans start at $29/mo (Starter), $79/mo (Growth Engine - most popular), and $199/mo (Turnkey Empire). You can cancel anytime with 1-click.",
    'default': "Thanks for asking! AutoBiz allows anyone to launch and scale an autonomous online business in under 15 minutes. Would you like to see how the automated funnels work, or calculate your revenue potential?"
  };

  function appendChatMessage(sender, text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`;

    if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="max-w-[85%] bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs font-medium shadow-md">
          ${text}
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="flex gap-2 max-w-[85%]">
          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm">
            AI
          </div>
          <div class="bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs leading-relaxed">
            ${text}
          </div>
        </div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserChat(text) {
    if (!text.trim()) return;
    appendChatMessage('user', text);
    if (chatInput) chatInput.value = '';

    // Simulate AI thinking and reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = botResponses['default'];

      if (lower.includes('work') || lower.includes('how') || lower.includes('blueprint')) {
        reply = botResponses['how it works'];
      } else if (lower.includes('code') || lower.includes('skill') || lower.includes('beginner')) {
        reply = botResponses['technical skills'];
      } else if (lower.includes('pay') || lower.includes('money') || lower.includes('payout') || lower.includes('bank')) {
        reply = botResponses['how i get paid'];
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        reply = botResponses['pricing'];
      }

      appendChatMessage('bot', reply);
    }, 600);
  }

  if (chatToggleBtn && chatBox) {
    chatToggleBtn.addEventListener('click', () => {
      chatBox.classList.toggle('hidden');
      if (!chatBox.classList.contains('hidden') && chatInput) {
        chatInput.focus();
      }
    });

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', () => {
        chatBox.classList.add('hidden');
      });
    }

    if (chatSendBtn && chatInput) {
      chatSendBtn.addEventListener('click', () => {
        handleUserChat(chatInput.value);
      });

      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleUserChat(chatInput.value);
        }
      });
    }

    chatPromptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        handleUserChat(query);
      });
    });
  }

  /* ========================================================
     11. Smooth Scrolling for Anchor Links
     ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Re-run icons creation on finish
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
