/**
 * FindMy Hostel - Global JavaScript Functions
 * Handles CSRF tokens, AJAX requests, and common utilities
 */

// Get CSRF token from cookie
function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue || document.querySelector('[name=csrfmiddlewaretoken]')?.value;
}

// Store CSRF token globally
const csrftoken = getCSRFToken();

/**
 * Generic AJAX request helper
 */
function ajaxRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'X-CSRFToken': csrftoken
        }
    };
    
    if (method !== 'GET' && data) {
        if (data instanceof FormData) {
            options.body = data;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
    }
    
    return fetch(url, options);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate phone
 */
function isValidPhone(phone) {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Loading spinner
 */
function showSpinner(element) {
    if (element) {
        const spinner = element.querySelector('.spinner-border');
        if (spinner) {
            spinner.classList.remove('d-none');
        }
    }
}

function hideSpinner(element) {
    if (element) {
        const spinner = element.querySelector('.spinner-border');
        if (spinner) {
            spinner.classList.add('d-none');
        }
    }
}

/**
 * Confirm dialog
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Debounce function for search inputs
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Ready on document load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if Bootstrap tooltips are available
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

console.log('✅ FindMy Hostel JavaScript loaded');
