// ==================== State Management ====================
let currentStep = 1;
const totalSteps = 3;

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
    updateProgressBar();
});

function initializeForm() {
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
        });
    });

    // Update progress on input change
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.addEventListener('change', updateProgressBar);
    }
}

// ==================== Multi-Step Form Navigation ====================
function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormDisplay();
            updateProgressBar();
        }
    } else {
        showValidationError();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormDisplay();
        updateProgressBar();
    }
}

function updateFormDisplay() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update button visibility
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function validateStep(step) {
    const form = document.getElementById('assessmentForm');
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);

    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = form.querySelector(`input[name="${field.name}"]:checked`);
            if (!radioGroup) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        }
    });

    return isValid;
}

function showValidationError() {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'validation-error';
    errorMsg.textContent = 'Please fill in all required fields.';
    errorMsg.style.cssText = `
        background: #fee2e2;
        color: #991b1b;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeInUp 0.3s ease;
    `;

    const form = document.getElementById('assessmentForm');
    form.insertBefore(errorMsg, form.firstChild);

    setTimeout(() => {
        errorMsg.remove();
    }, 3000);
}

function updateProgressBar() {
    const filledFields = getFilledFieldsCount();
    const totalFields = getTotalFieldsCount();
    const percentage = Math.round((filledFields / totalFields) * 100);

    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = percentage;
}

function getFilledFieldsCount() {
    const form = document.getElementById('assessmentForm');
    let count = 0;

    // Count filled text inputs and selects
    form.querySelectorAll('input[type="number"], select').forEach(field => {
        if (field.value) count++;
    });

    // Count checked radio buttons (one per group)
    const radioGroups = new Set();
    form.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.checked) {
            radioGroups.add(radio.name);
        }
    });
    count += radioGroups.size;

    return count;
}

function getTotalFieldsCount() {
    const form = document.getElementById('assessmentForm');
    let count = 0;

    // Count all text inputs and selects
    count += form.querySelectorAll('input[type="number"], select').length;

    // Count radio button groups
    const radioGroups = new Set();
    form.querySelectorAll('input[type="radio"]').forEach(radio => {
        radioGroups.add(radio.name);
    });
    count += radioGroups.size;

    return count;
}

// ==================== Form Submission ====================
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateStep(currentStep)) {
        showValidationError();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('assessmentForm');

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const payload = buildPayload();
        
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Response:', errorData);
            throw new Error(`API error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
        }

        const data = await response.json();
        showResult(data);

    } catch (error) {
        console.error('Error:', error);
        showErrorResult(error.message);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function buildPayload() {
    const form = document.getElementById('assessmentForm');
    const formData = new FormData(form);

    // Get A-score values
    const aScores = {
        A1_Score: parseInt(formData.get('A1_Score')) || 0,
        A2_Score: parseInt(formData.get('A2_Score')) || 0,
        A3_Score: parseInt(formData.get('A3_Score')) || 0,
        A4_Score: parseInt(formData.get('A4_Score')) || 0,
        A5_Score: parseInt(formData.get('A5_Score')) || 0,
        A6_Score: parseInt(formData.get('A6_Score')) || 0,
        A7_Score: parseInt(formData.get('A7_Score')) || 0,
        A8_Score: parseInt(formData.get('A8_Score')) || 0,
        A9_Score: parseInt(formData.get('A9_Score')) || 0,
        A10_Score: parseInt(formData.get('A10_Score')) || 0,
    };

    // Calculate result (sum of all A scores)
    const resultScore = Object.values(aScores).reduce((a, b) => a + b, 0);

    // Build payload matching FastAPI model exactly
    const payload = {
        A1_Score: aScores.A1_Score,
        A2_Score: aScores.A2_Score,
        A3_Score: aScores.A3_Score,
        A4_Score: aScores.A4_Score,
        A5_Score: aScores.A5_Score,
        A6_Score: aScores.A6_Score,
        A7_Score: aScores.A7_Score,
        A8_Score: aScores.A8_Score,
        A9_Score: aScores.A9_Score,
        A10_Score: aScores.A10_Score,
        age: parseInt(formData.get('age')) || 0,
        gender: formData.get('gender') || '',
        ethnicity: formData.get('ethnicity') || '',
        jaundice: formData.get('jaundice') || '',
        austim: formData.get('autism') || '',
        contry_of_res: formData.get('country') || '',
        used_app_before: formData.get('used_app') || '',
        result: resultScore.toString(),
        relation: formData.get('relation') || ''
    };

    console.log('Payload being sent:', payload);
    return payload;
}

function showResult(data) {
    const resultSection = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');
    const resultBadge = document.getElementById('resultBadge');
    const resultScore = document.getElementById('resultScore');

    // Determine prediction result
    const isPredicted = data.prediction === 1;

    // Update badge and message
    if (isPredicted) {
        resultBadge.className = 'result-badge positive';
        resultBadge.textContent = '⚠️';
        resultMessage.textContent = 'Autism Traits Detected';
        resultMessage.style.color = '#dc2626';
    } else {
        resultBadge.className = 'result-badge negative';
        resultBadge.textContent = '✓';
        resultMessage.textContent = 'No Autism Traits Detected';
        resultMessage.style.color = '#16a34a';
    }

    resultScore.textContent = `Based on your AQ-10 screening results. ${data.result_message}`;

    // Show result section
    resultSection.style.display = 'block';
}

function showErrorResult(errorMessage) {
    const resultSection = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');
    const resultBadge = document.getElementById('resultBadge');
    const resultScore = document.getElementById('resultScore');

    resultBadge.textContent = '❌';
    resultBadge.style.color = '#ef4444';
    resultMessage.textContent = 'Error Processing Assessment';
    resultMessage.style.color = '#dc2626';
    resultScore.textContent = `An error occurred: ${errorMessage}. Please try again.`;

    resultSection.style.display = 'block';
}

function resetForm() {
    // Reset form
    document.getElementById('assessmentForm').reset();

    // Reset to step 1
    currentStep = 1;
    updateFormDisplay();
    updateProgressBar();

    // Hide result section
    document.getElementById('result').style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== Utility Functions ====================
function scrollToAssessment() {
    const assessmentSection = document.getElementById('assessment');
    assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    faqItem.classList.toggle('active');
}

// ==================== Smooth Scroll for Navigation Links ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Accessibility Enhancements ====================
// Add focus visible styles for keyboard navigation
document.querySelectorAll('button, input, select, a').forEach(element => {
    element.addEventListener('focus', function () {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', function () {
        this.style.outline = 'none';
    });
});
