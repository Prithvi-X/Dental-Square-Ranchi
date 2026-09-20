/**
 * Dental Square — Appointment Booking Engine
 * Phase 2 Frontend State Machine & Interactions
 * Implements 7-step seamless flow: DISCOVER -> BOOK -> CONFIRM
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    step: 1,
    services: [],
    doctors: [],
    selectedService: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedSlot: null,
    selectedSlotDisplay: null,
    patient: {
      name: '',
      phone: '',
      email: '',
      type: 'NEW',
      notes: ''
    },
    heldBooking: null,
    confirmedBooking: null,
    holdTimerInterval: null,
    holdExpiresAt: null
  };

  // --- DOM ELEMENTS ---
  const elements = {
    app: document.getElementById('bookingApp'),
    stepperBar: document.getElementById('stepperBar'),
    stepperLabel: document.getElementById('stepperLabel'),
    stepperProgressFill: document.getElementById('stepperProgressFill'),
    stepBackBtn: document.getElementById('stepBackBtn'),
    globalAlertBanner: document.getElementById('globalAlertBanner'),
    globalAlertText: document.getElementById('globalAlertText'),

    // Step Panels
    panels: {
      1: document.getElementById('step1Panel'),
      2: document.getElementById('step2Panel'),
      3: document.getElementById('step3Panel'),
      4: document.getElementById('step4Panel'),
      5: document.getElementById('step5Panel'),
      6: document.getElementById('step6Panel'),
      7: document.getElementById('step7Panel'),
      8: document.getElementById('step8Panel')
    },

    // Step 1
    servicesListContainer: document.getElementById('servicesListContainer'),
    servicesLoadingState: document.getElementById('servicesLoadingState'),
    step1NextBtn: document.getElementById('step1NextBtn'),

    // Step 2
    doctorsListContainer: document.getElementById('doctorsListContainer'),
    step2NextBtn: document.getElementById('step2NextBtn'),

    // Step 3
    datesCarouselTrack: document.getElementById('datesCarouselTrack'),
    selectedDateCallout: document.getElementById('selectedDateCallout'),
    calloutDayText: document.getElementById('calloutDayText'),
    calloutHoursText: document.getElementById('calloutHoursText'),
    step3NextBtn: document.getElementById('step3NextBtn'),

    // Step 4
    slotsContainer: document.getElementById('slotsContainer'),
    slotsLoadingState: document.getElementById('slotsLoadingState'),
    morningSessionBlock: document.getElementById('morningSessionBlock'),
    morningSlotsGrid: document.getElementById('morningSlotsGrid'),
    eveningSessionBlock: document.getElementById('eveningSessionBlock'),
    eveningSlotsGrid: document.getElementById('eveningSlotsGrid'),
    emptySlotsCard: document.getElementById('emptySlotsCard'),
    chooseAnotherDateBtn: document.getElementById('chooseAnotherDateBtn'),
    step4NextBtn: document.getElementById('step4NextBtn'),

    // Step 5
    patientForm: document.getElementById('patientDetailsForm'),
    patientNameInput: document.getElementById('patientNameInput'),
    patientPhoneInput: document.getElementById('patientPhoneInput'),
    patientEmailInput: document.getElementById('patientEmailInput'),
    patientNotesInput: document.getElementById('patientNotesInput'),
    nameErrorMsg: document.getElementById('nameErrorMsg'),
    phoneErrorMsg: document.getElementById('phoneErrorMsg'),
    emailErrorMsg: document.getElementById('emailErrorMsg'),
    step5NextBtn: document.getElementById('step5NextBtn'),

    // Step 6
    reviewServiceThumb: document.getElementById('reviewServiceThumb'),
    reviewServiceName: document.getElementById('reviewServiceName'),
    reviewServiceDuration: document.getElementById('reviewServiceDuration'),
    reviewDoctorAvatar: document.getElementById('reviewDoctorAvatar'),
    reviewDoctorName: document.getElementById('reviewDoctorName'),
    reviewDoctorSpec: document.getElementById('reviewDoctorSpec'),
    reviewDateStr: document.getElementById('reviewDateStr'),
    reviewDateDay: document.getElementById('reviewDateDay'),
    reviewTimeStr: document.getElementById('reviewTimeStr'),
    reviewPatientName: document.getElementById('reviewPatientName'),
    reviewPatientType: document.getElementById('reviewPatientType'),
    reviewPatientPhone: document.getElementById('reviewPatientPhone'),
    reviewPatientEmail: document.getElementById('reviewPatientEmail'),
    reviewDepositAmount: document.getElementById('reviewDepositAmount'),
    confirmBookingSubmitBtn: document.getElementById('confirmBookingSubmitBtn'),
    confirmSpinner: document.getElementById('confirmSpinner'),

    // Step 7 Demo Payment
    holdCountdownTimer: document.getElementById('holdCountdownTimer'),
    holdReservationRefText: document.getElementById('holdReservationRefText'),
    checkoutDepositAmount: document.getElementById('checkoutDepositAmount'),
    simulateFailToggle: document.getElementById('simulateFailToggle'),
    paymentErrorBanner: document.getElementById('paymentErrorBanner'),
    paymentErrorText: document.getElementById('paymentErrorText'),
    cancelAndReleaseHoldBtn: document.getElementById('cancelAndReleaseHoldBtn'),
    executeDemoPaymentBtn: document.getElementById('executeDemoPaymentBtn'),
    paySpinner: document.getElementById('paySpinner'),

    // Step 8 Confirmed
    confirmedRefCode: document.getElementById('confirmedRefCode'),
    copyRefBtn: document.getElementById('copyRefBtn'),
    copyRefText: document.getElementById('copyRefText'),
    confirmedDocName: document.getElementById('confirmedDocName'),
    confirmedServiceName: document.getElementById('confirmedServiceName'),
    confirmedDateTime: document.getElementById('confirmedDateTime'),
    confirmedPatientName: document.getElementById('confirmedPatientName'),
    confirmedDepositPaid: document.getElementById('confirmedDepositPaid'),
    confirmedPaymentRef: document.getElementById('confirmedPaymentRef'),
    downloadIcsBtn: document.getElementById('downloadIcsBtn'),

    // Modal
    lookupModalOverlay: document.getElementById('lookupModalOverlay'),
    lookupModalOpenBtn: document.getElementById('lookupModalOpenBtn'),
    lookupModalCloseBtn: document.getElementById('lookupModalCloseBtn'),
    lookupForm: document.getElementById('lookupForm'),
    lookupRefInput: document.getElementById('lookupRefInput'),
    lookupPhoneInput: document.getElementById('lookupPhoneInput'),
    lookupResultBox: document.getElementById('lookupResultBox'),
    lookupResultDoc: document.getElementById('lookupResultDoc'),
    lookupResultStatus: document.getElementById('lookupResultStatus'),
    lookupResultService: document.getElementById('lookupResultService'),
    lookupResultDateTime: document.getElementById('lookupResultDateTime'),
    cancelAppointmentBtn: document.getElementById('cancelAppointmentBtn'),
    lookupErrorAlert: document.getElementById('lookupErrorAlert'),
    lookupErrorText: document.getElementById('lookupErrorText')
  };

  // --- INITIALIZATION ---
  async function init() {
    setupEventListeners();
    await loadInitialData();
    renderDateCarousel();
    parseQueryParams();
  }

  // --- STEP NAVIGATION ---
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 8) return;

    hideAlert();
    state.step = stepNumber;

    // Toggle panels
    Object.keys(elements.panels).forEach((s) => {
      const panel = elements.panels[s];
      if (panel) {
        if (parseInt(s, 10) === stepNumber) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      }
    });

    // Update Stepper (Steps 1 to 7 active, Step 8 Confirmation)
    if (stepNumber >= 1 && stepNumber <= 7) {
      elements.stepperBar.style.display = 'block';
      elements.stepperLabel.textContent = `Step ${stepNumber} of 8`;
      const progressPercent = (stepNumber / 8) * 100;
      elements.stepperProgressFill.style.width = `${progressPercent}%`;
      elements.stepBackBtn.style.visibility = stepNumber > 1 ? 'visible' : 'hidden';
    } else {
      // Step 8: Confirmation state
      elements.stepperBar.style.display = 'none';
      elements.stepBackBtn.style.visibility = 'hidden';
    }

    // Scroll gently to top of booking app
    elements.app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showAlert(msg) {
    elements.globalAlertText.textContent = msg;
    elements.globalAlertBanner.style.display = 'flex';
  }

  function hideAlert() {
    elements.globalAlertBanner.style.display = 'none';
  }

  // --- DATA FETCHING ---
  async function loadInitialData() {
    try {
      const [servicesRes, doctorsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/doctors')
      ]);

      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        state.services = Array.isArray(sData) ? sData : (sData.services || []);
        renderServicesList(state.services);
      }

      if (doctorsRes.ok) {
        const dData = await doctorsRes.json();
        state.doctors = Array.isArray(dData) ? dData : (dData.doctors || []);
      }
    } catch (err) {
      console.error('Failed to load services or doctors:', err);
      showAlert('Could not load clinic services. Please refresh the page or check your connection.');
    }
  }

  // --- URL PARAMS HANDLER ---
  function parseQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const doctorParam = params.get('doctor');

    if (serviceParam && state.services.length > 0) {
      const cleanParam = serviceParam.toLowerCase();
      const match = state.services.find(
        (s) => s.id.toLowerCase() === cleanParam || s.id.replace('serv_', '').toLowerCase() === cleanParam.replace('serv_', '')
      );
      if (match) {
        selectService(match);
      }
    }

    if (doctorParam) {
      const docCard = document.querySelector(`.doctor-select-card[data-doctor-id="${doctorParam}"]`);
      if (docCard) {
        selectDoctorCard(docCard);
      }
    }
  }

  // --- STEP 1: SERVICES ---
  function renderServicesList(services) {
    if (elements.servicesLoadingState) {
      elements.servicesLoadingState.remove();
    }
    elements.servicesListContainer.innerHTML = '';

    services.forEach((srv) => {
      const card = document.createElement('div');
      card.className = 'service-select-card';
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.setAttribute('tabindex', '0');
      card.dataset.serviceId = srv.id;

      const title = srv.name || srv.title || 'Specialist Care';
      const duration = srv.duration_minutes || srv.duration || 30;
      const category = srv.category || 'Specialist Care';

      card.innerHTML = `
        <img src="${srv.image_url}" alt="${title}" class="service-card-thumb" width="44" height="44" onerror="this.src='assets/images/service-rct-3d.png'">
        <div class="service-card-info">
          <div class="service-card-title">${title}</div>
          <span class="service-card-meta mono">${duration} min &middot; ${category}</span>
        </div>
        <div class="selection-radio-indicator" aria-hidden="true"></div>
      `;

      card.addEventListener('click', () => selectService(srv, card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectService(srv, card);
        }
      });

      elements.servicesListContainer.appendChild(card);
    });
  }

  function selectService(service, targetCard) {
    state.selectedService = service;

    document.querySelectorAll('.service-select-card').forEach((c) => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });

    const card = targetCard || document.querySelector(`.service-select-card[data-service-id="${service.id}"]`);
    if (card) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }

    elements.step1NextBtn.removeAttribute('disabled');
    hideAlert();
  }

  // --- STEP 2: DOCTORS ---
  function selectDoctorCard(card) {
    const docId = card.dataset.doctorId;

    document.querySelectorAll('.doctor-select-card').forEach((c) => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });

    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');

    if (docId === 'any') {
      state.selectedDoctor = {
        id: 'any',
        name: 'Any Available Specialist',
        specialization: 'Earliest Available Slot',
        affiliation: 'Assigned between Dr. Anuj & Dr. Kumari Vandana',
        photo_url: 'assets/images/logo.png'
      };
    } else {
      const doc = state.doctors.find((d) => d.id === docId);
      if (doc) {
        state.selectedDoctor = {
          id: doc.id,
          name: doc.full_name || doc.name,
          specialization: doc.specialization || '',
          affiliation: doc.affiliations || doc.affiliation || '',
          photo_url: card.querySelector('img')?.getAttribute('src') || 'assets/images/doctor-anuj.png'
        };
      } else {
        // Fallback info from card markup
        state.selectedDoctor = {
          id: docId,
          name: card.querySelector('.doc-select-name')?.textContent.trim() || 'Specialist',
          specialization: card.querySelector('.doc-select-spec')?.textContent.trim() || '',
          affiliation: card.querySelector('.doc-select-affil')?.textContent.trim() || '',
          photo_url: card.querySelector('img')?.getAttribute('src') || 'assets/images/doctor-anuj.png'
        };
      }
    }

    elements.step2NextBtn.removeAttribute('disabled');
    hideAlert();
  }

  // --- STEP 3: DATES CAROUSEL ---
  function renderDateCarousel() {
    elements.datesCarouselTrack.innerHTML = '';
    const today = new Date();

    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const isoDate = `${yyyy}-${mm}-${dd}`;

      const dayName = daysMap[d.getDay()];
      const dayNum = d.getDate();
      const monthName = monthsMap[d.getMonth()];
      const isSunday = d.getDay() === 0;

      const dateBtn = document.createElement('button');
      dateBtn.type = 'button';
      dateBtn.className = 'date-card-btn';
      dateBtn.dataset.date = isoDate;
      dateBtn.dataset.isSunday = isSunday ? 'true' : 'false';
      dateBtn.setAttribute('role', 'radio');
      dateBtn.setAttribute('aria-checked', 'false');

      dateBtn.innerHTML = `
        <span class="date-day-name mono">${i === 0 ? 'Today' : (i === 1 ? 'Tmrw' : dayName)}</span>
        <span class="date-day-number">${dayNum}</span>
        <span class="date-month-name">${monthName}</span>
        ${isSunday ? '<span class="date-sunday-tag mono">SUN 10-2</span>' : ''}
      `;

      dateBtn.addEventListener('click', () => selectDate(isoDate, d, isSunday, dateBtn));
      elements.datesCarouselTrack.appendChild(dateBtn);
    }
  }

  function selectDate(isoDate, dateObj, isSunday, btnElement) {
    state.selectedDate = isoDate;

    document.querySelectorAll('.date-card-btn').forEach((b) => {
      b.classList.remove('selected');
      b.setAttribute('aria-checked', 'false');
    });

    btnElement.classList.add('selected');
    btnElement.setAttribute('aria-checked', 'true');

    // Update Callout
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.calloutDayText.textContent = dateObj.toLocaleDateString('en-US', options);
    elements.calloutHoursText.textContent = isSunday
      ? 'Sunday clinic hours: 10:00 AM – 2:00 PM (Morning session only)'
      : 'Clinic hours: 10:00 AM – 07:30 PM (Morning & Evening sessions)';
    elements.selectedDateCallout.style.display = 'flex';

    elements.step3NextBtn.removeAttribute('disabled');
    hideAlert();
  }

  // --- STEP 4: TIME SLOTS ---
  async function loadSlots() {
    if (!state.selectedDoctor || !state.selectedDate) return;

    elements.slotsLoadingState.style.display = 'flex';
    elements.morningSessionBlock.style.display = 'none';
    elements.eveningSessionBlock.style.display = 'none';
    elements.emptySlotsCard.style.display = 'none';
    elements.step4NextBtn.setAttribute('disabled', 'true');
    state.selectedSlot = null;
    state.selectedSlotDisplay = null;

    try {
      const url = `/api/availability?doctorId=${encodeURIComponent(state.selectedDoctor.id)}&date=${encodeURIComponent(state.selectedDate)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Availability API error');

      const data = await res.json();
      elements.slotsLoadingState.style.display = 'none';

      let totalAvailable = 0;

      // Morning Slots
      if (data.morningSlots && data.morningSlots.length > 0) {
        elements.morningSlotsGrid.innerHTML = '';
        elements.morningSessionBlock.style.display = 'block';

        data.morningSlots.forEach((slot) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'time-slot-pill mono';
          pill.textContent = slot.displayTime || slot.time;
          pill.dataset.time = slot.time;
          pill.dataset.displayTime = slot.displayTime || slot.time;

          if (slot.status !== 'AVAILABLE') {
            pill.classList.add('disabled');
            pill.setAttribute('disabled', 'true');
            pill.title = slot.status === 'FULL' ? 'Slot booked' : 'Past slot';
          } else {
            totalAvailable++;
            pill.addEventListener('click', () => selectSlot(slot.time, slot.displayTime || slot.time, pill));
          }

          elements.morningSlotsGrid.appendChild(pill);
        });
      }

      // Evening Slots (empty on Sundays)
      if (data.eveningSlots && data.eveningSlots.length > 0) {
        elements.eveningSlotsGrid.innerHTML = '';
        elements.eveningSessionBlock.style.display = 'block';

        data.eveningSlots.forEach((slot) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'time-slot-pill mono';
          pill.textContent = slot.displayTime || slot.time;
          pill.dataset.time = slot.time;
          pill.dataset.displayTime = slot.displayTime || slot.time;

          if (slot.status !== 'AVAILABLE') {
            pill.classList.add('disabled');
            pill.setAttribute('disabled', 'true');
            pill.title = slot.status === 'FULL' ? 'Slot booked' : 'Past slot';
          } else {
            totalAvailable++;
            pill.addEventListener('click', () => selectSlot(slot.time, slot.displayTime || slot.time, pill));
          }

          elements.eveningSlotsGrid.appendChild(pill);
        });
      }

      if (totalAvailable === 0) {
        elements.emptySlotsCard.style.display = 'block';
      }
    } catch (err) {
      console.error('Error loading slots:', err);
      elements.slotsLoadingState.style.display = 'none';
      showAlert('Unable to check live availability. Please try again.');
    }
  }

  function selectSlot(timeStr, displayStr, pillElement) {
    state.selectedSlot = timeStr;
    state.selectedSlotDisplay = displayStr;

    document.querySelectorAll('.time-slot-pill').forEach((p) => p.classList.remove('selected'));
    pillElement.classList.add('selected');

    elements.step4NextBtn.removeAttribute('disabled');
    hideAlert();
  }

  // --- STEP 5: PATIENT DETAILS VALIDATION ---
  function validatePatientDetails() {
    let isValid = true;

    // Name
    const nameVal = elements.patientNameInput.value.trim();
    if (nameVal.length < 2) {
      elements.nameErrorMsg.style.display = 'block';
      isValid = false;
    } else {
      elements.nameErrorMsg.style.display = 'none';
    }

    // Phone (10 digits Indian)
    const rawPhone = elements.patientPhoneInput.value.replace(/\D/g, '');
    if (rawPhone.length !== 10) {
      elements.phoneErrorMsg.style.display = 'block';
      isValid = false;
    } else {
      elements.phoneErrorMsg.style.display = 'none';
    }

    // Email (optional, but must be valid if provided)
    const emailVal = elements.patientEmailInput.value.trim();
    if (emailVal.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        elements.emailErrorMsg.style.display = 'block';
        isValid = false;
      } else {
        elements.emailErrorMsg.style.display = 'none';
      }
    } else {
      elements.emailErrorMsg.style.display = 'none';
    }

    if (isValid) {
      const patientTypeChecked = document.querySelector('input[name="patientTypeRadio"]:checked');
      state.patient = {
        name: nameVal,
        phone: rawPhone,
        email: emailVal,
        type: patientTypeChecked ? patientTypeChecked.value : 'NEW',
        notes: elements.patientNotesInput.value.trim()
      };
    }

    return isValid;
  }

  // --- STEP 6: POPULATE REVIEW SUMMARY ---
  function populateReviewSummary() {
    // Service
    if (state.selectedService) {
      const title = state.selectedService.name || state.selectedService.title || 'Specialist Care';
      const duration = state.selectedService.duration_minutes || state.selectedService.duration || 30;
      elements.reviewServiceName.textContent = title;
      elements.reviewServiceDuration.textContent = `${duration} min consultation`;
      if (state.selectedService.image_url) {
        elements.reviewServiceThumb.src = state.selectedService.image_url;
      }
    }

    // Doctor
    if (state.selectedDoctor) {
      elements.reviewDoctorName.textContent = state.selectedDoctor.name;
      elements.reviewDoctorSpec.textContent = state.selectedDoctor.specialization || 'Dental Specialist';
      if (state.selectedDoctor.photo_url) {
        elements.reviewDoctorAvatar.src = state.selectedDoctor.photo_url;
      }
    }

    // Date
    if (state.selectedDate) {
      const d = new Date(state.selectedDate + 'T00:00:00');
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      elements.reviewDateStr.textContent = d.toLocaleDateString('en-US', options);
      elements.reviewDateDay.textContent = d.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // Slot
    elements.reviewTimeStr.textContent = state.selectedSlotDisplay || state.selectedSlot || 'Not selected';

    // Patient
    elements.reviewPatientName.textContent = state.patient.name;
    elements.reviewPatientType.textContent = state.patient.type === 'RETURNING' ? 'Returning Patient' : 'First Time Visit';
    elements.reviewPatientPhone.textContent = `+91 ${state.patient.phone}`;
    elements.reviewPatientEmail.textContent = state.patient.email ? state.patient.email : 'No email provided';
    // Deposit amount
    if (elements.reviewDepositAmount) {
      elements.reviewDepositAmount.textContent = '₹500.00';
    }
  }

  // --- TIMER & HOLD EXPIRATION LOGIC ---
  function startHoldTimer() {
    stopHoldTimer();
    updateHoldTimerDisplay();
    state.holdTimerInterval = setInterval(() => {
      updateHoldTimerDisplay();
    }, 1000);
  }

  function stopHoldTimer() {
    if (state.holdTimerInterval) {
      clearInterval(state.holdTimerInterval);
      state.holdTimerInterval = null;
    }
  }

  function updateHoldTimerDisplay() {
    if (!state.holdExpiresAt) return;
    const now = Date.now();
    const diff = state.holdExpiresAt - now;

    if (diff <= 0) {
      stopHoldTimer();
      if (elements.holdCountdownTimer) {
        elements.holdCountdownTimer.textContent = '00:00';
        elements.holdCountdownTimer.classList.add('timer-expired');
      }
      showPaymentError('Your 10-minute reservation hold has expired. Please select another slot.');
      if (elements.executeDemoPaymentBtn) {
        elements.executeDemoPaymentBtn.setAttribute('disabled', 'true');
      }
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const formatted = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    if (elements.holdCountdownTimer) {
      elements.holdCountdownTimer.textContent = formatted;
      if (totalSec < 120) {
        elements.holdCountdownTimer.classList.add('timer-warning');
        elements.holdCountdownTimer.classList.remove('timer-expired');
      } else {
        elements.holdCountdownTimer.classList.remove('timer-warning', 'timer-expired');
      }
    }
  }

  function showPaymentError(msg) {
    if (elements.paymentErrorText && elements.paymentErrorBanner) {
      elements.paymentErrorText.textContent = msg;
      elements.paymentErrorBanner.style.display = 'flex';
    }
  }

  function hidePaymentError() {
    if (elements.paymentErrorBanner) {
      elements.paymentErrorBanner.style.display = 'none';
    }
  }

  // --- STEP 6 TO STEP 7: RESERVE SLOT HOLD ---
  async function reserveSlotHold() {
    hideAlert();
    elements.confirmBookingSubmitBtn.setAttribute('disabled', 'true');
    elements.confirmSpinner.style.display = 'inline-block';

    const payload = {
      serviceId: state.selectedService ? state.selectedService.id : 'serv_rct',
      doctorId: state.selectedDoctor ? state.selectedDoctor.id : 'any',
      appointmentDate: state.selectedDate,
      appointmentTime: state.selectedSlot,
      patientName: state.patient.name,
      patientPhone: state.patient.phone,
      patientEmail: state.patient.email || undefined,
      patientType: state.patient.type,
      notes: state.patient.notes || undefined
    };

    try {
      const res = await fetch('/api/appointments/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      elements.confirmBookingSubmitBtn.removeAttribute('disabled');
      elements.confirmSpinner.style.display = 'none';

      if (res.status === 201) {
        const heldData = await res.json();
        state.heldBooking = heldData;
        state.holdExpiresAt = new Date(heldData.holdExpiresAt).getTime();

        if (elements.holdReservationRefText) {
          elements.holdReservationRefText.textContent = `Ref: ${heldData.bookingReference} · Held for 10 minutes`;
        }
        if (elements.checkoutDepositAmount) {
          elements.checkoutDepositAmount.textContent = `₹${heldData.paymentAmount || 500}.00`;
        }

        hidePaymentError();
        if (elements.executeDemoPaymentBtn) {
          elements.executeDemoPaymentBtn.removeAttribute('disabled');
        }

        startHoldTimer();
        goToStep(7);
      } else if (res.status === 409) {
        const err = await res.json();
        showAlert(err.error || 'That time is currently being reserved or already booked. Please choose another slot.');
        setTimeout(() => {
          goToStep(4);
          loadSlots();
        }, 1800);
      } else {
        const err = await res.json();
        showAlert(err.error || 'Could not reserve appointment slot. Please try again.');
      }
    } catch (err) {
      console.error('Reservation hold error:', err);
      elements.confirmBookingSubmitBtn.removeAttribute('disabled');
      elements.confirmSpinner.style.display = 'none';
      showAlert('Connection error. Please check your internet and try again.');
    }
  }

  // --- STEP 7 TO STEP 8: EXECUTE DEMO PAYMENT ---
  async function executeDemoPayment() {
    if (!state.heldBooking) {
      showAlert('No active reservation hold found. Please select a slot.');
      goToStep(4);
      return;
    }

    if (state.holdExpiresAt && Date.now() >= state.holdExpiresAt) {
      showPaymentError('Your 10-minute reservation hold has expired. Please choose another slot.');
      return;
    }

    hidePaymentError();
    elements.executeDemoPaymentBtn.setAttribute('disabled', 'true');
    elements.paySpinner.style.display = 'inline-block';

    const simulateFailure = elements.simulateFailToggle ? elements.simulateFailToggle.checked : false;
    const activeMethodCard = document.querySelector('.demo-method-card.active');
    const paymentMethod = activeMethodCard ? activeMethodCard.getAttribute('data-method') : 'UPI';

    try {
      const res = await fetch(`/api/appointments/${state.heldBooking.bookingReference}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateFailure, paymentMethod })
      });

      elements.executeDemoPaymentBtn.removeAttribute('disabled');
      elements.paySpinner.style.display = 'none';

      if (res.status === 200) {
        const confirmedData = await res.json();
        stopHoldTimer();
        state.confirmedBooking = confirmedData;
        renderConfirmation(confirmedData);
        goToStep(8);
      } else if (res.status === 402) {
        const err = await res.json();
        showPaymentError(err.error || 'Simulated payment failed (card declined or transaction rejected). You can retry before your 10-minute slot hold expires.');
      } else if (res.status === 400) {
        const err = await res.json();
        stopHoldTimer();
        showPaymentError(err.error || 'Slot reservation hold has expired.');
        setTimeout(() => {
          state.heldBooking = null;
          goToStep(4);
          loadSlots();
        }, 2200);
      } else {
        const err = await res.json();
        showPaymentError(err.error || 'Payment processing error. Please retry.');
      }
    } catch (err) {
      console.error('Payment execution error:', err);
      elements.executeDemoPaymentBtn.removeAttribute('disabled');
      elements.paySpinner.style.display = 'none';
      showPaymentError('Connection error contacting demo checkout. Please try again.');
    }
  }

  // --- RELEASE HOLD AND GO BACK TO SLOTS ---
  async function releaseHoldAndReturnToStep4() {
    stopHoldTimer();
    if (state.heldBooking) {
      try {
        await fetch(`/api/appointments/${state.heldBooking.bookingReference}/release-hold`, {
          method: 'POST'
        });
      } catch (_) {}
      state.heldBooking = null;
    }
    goToStep(4);
    loadSlots();
  }

  // --- STEP 8: RENDER CONFIRMATION ---
  function renderConfirmation(appointment) {
    if (elements.confirmedRefCode) elements.confirmedRefCode.textContent = appointment.bookingReference;
    if (elements.confirmedDocName) elements.confirmedDocName.textContent = appointment.doctorName;
    if (elements.confirmedServiceName) elements.confirmedServiceName.textContent = appointment.serviceName;
    if (elements.confirmedDateTime) elements.confirmedDateTime.textContent = `${appointment.appointmentDate} at ${appointment.displayTime || appointment.appointmentTime}`;
    if (elements.confirmedPatientName) elements.confirmedPatientName.textContent = appointment.patientName;
    if (elements.confirmedDepositPaid) {
      const amt = appointment.paymentAmount || 500;
      elements.confirmedDepositPaid.textContent = `₹${amt}.00 (Simulated Demo Paid)`;
    }
    if (elements.confirmedPaymentRef) {
      elements.confirmedPaymentRef.textContent = appointment.paymentReference || 'PAY-DEMO-XXXXXX';
    }

    // Native .ics calendar invite link
    if (elements.downloadIcsBtn) {
      elements.downloadIcsBtn.href = `/api/appointments/${appointment.bookingReference}/calendar.ics`;
    }
  }

  // --- LOOKUP & CANCEL MODAL ---
  function openLookupModal() {
    elements.lookupErrorAlert.style.display = 'none';
    elements.lookupResultBox.style.display = 'none';
    elements.lookupRefInput.value = '';
    elements.lookupPhoneInput.value = '';
    elements.lookupModalOverlay.classList.add('active');
  }

  function closeLookupModal() {
    elements.lookupModalOverlay.classList.remove('active');
  }

  async function handleLookupSubmit(e) {
    e.preventDefault();
    elements.lookupErrorAlert.style.display = 'none';
    elements.lookupResultBox.style.display = 'none';

    const ref = elements.lookupRefInput.value.trim().toUpperCase();
    const phone = elements.lookupPhoneInput.value.replace(/\D/g, '');

    if (!ref.startsWith('DS-') || ref.length < 8) {
      elements.lookupErrorText.textContent = 'Please enter a valid booking reference starting with DS- (e.g. DS-A894B2)';
      elements.lookupErrorAlert.style.display = 'flex';
      return;
    }

    if (phone.length !== 10) {
      elements.lookupErrorText.textContent = 'Please enter your registered 10-digit mobile number.';
      elements.lookupErrorAlert.style.display = 'flex';
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(ref)}`);
      if (res.status === 404) {
        elements.lookupErrorText.textContent = 'No appointment found with that booking reference.';
        elements.lookupErrorAlert.style.display = 'flex';
        return;
      }

      const appointment = await res.json();
      // Verify phone match against stored record
      const storedClean = (appointment.patientPhone || '').replace(/\D/g, '');
      if (!storedClean.endsWith(phone)) {
        elements.lookupErrorText.textContent = 'Mobile number does not match this booking reference.';
        elements.lookupErrorAlert.style.display = 'flex';
        return;
      }

      // Display result
      elements.lookupResultDoc.textContent = appointment.doctorName;
      let statusDisplay = appointment.status;
      if (appointment.paymentStatus === 'SUCCESS') {
        statusDisplay += ' · PAID (SIMULATED)';
      }
      elements.lookupResultStatus.textContent = statusDisplay;
      elements.lookupResultService.textContent = appointment.serviceName;
      elements.lookupResultDateTime.textContent = `${appointment.appointmentDate} at ${appointment.displayTime || appointment.appointmentTime}`;

      if (appointment.status === 'CANCELLED') {
        elements.cancelAppointmentBtn.style.display = 'none';
      } else {
        elements.cancelAppointmentBtn.style.display = 'inline-block';
        elements.cancelAppointmentBtn.onclick = () => cancelAppointment(ref, phone);
      }

      elements.lookupResultBox.style.display = 'block';
    } catch (err) {
      console.error('Lookup failed:', err);
      elements.lookupErrorText.textContent = 'Could not verify booking. Please try again.';
      elements.lookupErrorAlert.style.display = 'flex';
    }
  }

  async function cancelAppointment(ref, phone) {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel appointment ${ref}? This slot will be released.`
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(ref)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      if (res.ok) {
        elements.lookupResultStatus.textContent = 'CANCELLED';
        elements.cancelAppointmentBtn.style.display = 'none';
        alert('Your appointment has been cancelled successfully.');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel appointment.');
      }
    } catch (err) {
      console.error('Cancel request error:', err);
      alert('Could not cancel appointment. Please check your connection.');
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Back button
    elements.stepBackBtn.addEventListener('click', () => {
      if (state.step > 1 && state.step <= 6) {
        goToStep(state.step - 1);
      } else if (state.step === 7) {
        // Voluntarily release held slot and return to slots
        releaseHoldAndReturnToStep4();
      }
    });

    // Step 1 Next
    elements.step1NextBtn.addEventListener('click', () => {
      if (state.selectedService) {
        goToStep(2);
      } else {
        showAlert('Please select a service or consultation to proceed.');
      }
    });

    // Step 2 Doctor Card click handlers
    document.querySelectorAll('.doctor-select-card').forEach((card) => {
      card.addEventListener('click', () => selectDoctorCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDoctorCard(card);
        }
      });
    });

    // Step 2 Next
    elements.step2NextBtn.addEventListener('click', () => {
      if (state.selectedDoctor) {
        goToStep(3);
      } else {
        showAlert('Please select a specialist or choose "Any Available Specialist".');
      }
    });

    // Step 3 Next
    elements.step3NextBtn.addEventListener('click', () => {
      if (state.selectedDate) {
        goToStep(4);
        loadSlots();
      } else {
        showAlert('Please select an appointment date from the calendar.');
      }
    });

    // Step 4 Empty slots change date
    elements.chooseAnotherDateBtn.addEventListener('click', () => {
      goToStep(3);
    });

    // Step 4 Next
    elements.step4NextBtn.addEventListener('click', () => {
      if (state.selectedSlot) {
        goToStep(5);
      } else {
        showAlert('Please select an available consultation time slot.');
      }
    });

    // Step 5 Patient type toggles
    document.querySelectorAll('.type-radio-label').forEach((label) => {
      label.addEventListener('click', () => {
        document.querySelectorAll('.type-radio-label').forEach((l) => l.classList.remove('active'));
        label.classList.add('active');
      });
    });

    // Step 5 Next
    elements.step5NextBtn.addEventListener('click', () => {
      if (validatePatientDetails()) {
        populateReviewSummary();
        goToStep(6);
      }
    });

    // Step 6 Confirm & Reserve Slot Hold
    elements.confirmBookingSubmitBtn.addEventListener('click', () => {
      reserveSlotHold();
    });

    // Step 7 Demo Payment Method Selection
    document.querySelectorAll('.demo-method-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.demo-method-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Step 7 Cancel & Release Hold
    if (elements.cancelAndReleaseHoldBtn) {
      elements.cancelAndReleaseHoldBtn.addEventListener('click', () => {
        releaseHoldAndReturnToStep4();
      });
    }

    // Step 7 Execute Demo Payment
    if (elements.executeDemoPaymentBtn) {
      elements.executeDemoPaymentBtn.addEventListener('click', () => {
        executeDemoPayment();
      });
    }

    // Step 8 Copy Reference Code
    elements.copyRefBtn.addEventListener('click', () => {
      const code = elements.confirmedRefCode.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        elements.copyRefText.textContent = 'Copied!';
        setTimeout(() => {
          elements.copyRefText.textContent = 'Copy';
        }, 2500);
      });
    });

    // Modal Events
    elements.lookupModalOpenBtn.addEventListener('click', openLookupModal);
    elements.lookupModalCloseBtn.addEventListener('click', closeLookupModal);
    elements.lookupModalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.lookupModalOverlay) {
        closeLookupModal();
      }
    });
    elements.lookupForm.addEventListener('submit', handleLookupSubmit);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
