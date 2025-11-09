'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Simple and reliable email configuration
const EMAIL_CONFIG = {
  // Using Formspree - a reliable form backend service
  FORMSPREE_URL: 'https://formspree.io/f/mvgdpbna', // Free Formspree endpoint
  BACKUP_EMAIL: 'thaolinh1922tp@gmail.com'
};

// Show notification function
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Choose appropriate icon
  let iconName = 'checkmark-circle';
  if (type === 'error') iconName = 'alert-circle';
  if (type === 'info') iconName = 'information-circle';
  
  notification.innerHTML = `
    <div class="notification-content">
      <ion-icon name="${iconName}"></ion-icon>
      <span>${message}</span>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Hide and remove notification after 6 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 6000);
}

// Simple and reliable form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(form);
  const fullname = formData.get('fullname');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Validate required fields
  if (!fullname || !email || !message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show loading state
  const originalText = formBtn.innerHTML;
  formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
  formBtn.disabled = true;
  
  // Prepare form data for submission
  const submitData = {
    name: fullname,
    email: email,
    message: message,
    _subject: `Portfolio Contact from ${fullname}`,
    _replyto: email
  };
  
  // Send via Formspree (reliable form backend service)
  fetch(EMAIL_CONFIG.FORMSPREE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submitData)
  })
  .then(response => {
    if (response.ok) {
      // Success!
      showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
      form.reset();
      formBtn.disabled = true; // Keep disabled until form is filled again
    } else if (response.status === 422) {
      // Validation error
      throw new Error('Please check your information and try again.');
    } else {
      // Other error
      throw new Error('Service temporarily unavailable.');
    }
  })
  .catch(error => {
    console.error('Form submission error:', error);
    
    // Show fallback with contact information
    showContactFallback(fullname, email, message);
  })
  .finally(() => {
    // Reset button state
    formBtn.innerHTML = originalText;
    formBtn.disabled = false;
  });
});

// Fallback function when form submission fails
function showContactFallback(fullname, email, message) {
  const contactMessage = `
    <div style="text-align: left;">
      <p><strong>Don't worry!</strong> You can reach me directly:</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid var(--orange-yellow-crayola);">
        📧 <strong>Email:</strong> <a href="mailto:${EMAIL_CONFIG.BACKUP_EMAIL}?subject=Portfolio Contact from ${fullname}&body=Hi! I'm ${fullname} (${email}).%0A%0A${encodeURIComponent(message)}" style="color: var(--orange-yellow-crayola); text-decoration: none;">${EMAIL_CONFIG.BACKUP_EMAIL}</a>
        <br><br>
        <small>Click the email above to open your email client with your message pre-filled!</small>
      </div>
    </div>
  `;
  
  // Create modal for contact info
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
    align-items: center; justify-content: center; padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="
      background: var(--eerie-black-2); color: var(--white-2); padding: 30px; 
      border-radius: 12px; max-width: 500px; width: 100%; 
      border: 1px solid var(--jet); box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: var(--orange-yellow-crayola);">📬 Let's Connect!</h3>
        <button onclick="this.closest('div').parentElement.remove()" style="
          background: none; border: none; color: var(--white-2); 
          font-size: 24px; cursor: pointer; padding: 0; line-height: 1;
        ">&times;</button>
      </div>
      ${contactMessage}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Show info notification
  showNotification('Form service temporarily unavailable. Please use the direct email link above!', 'info');
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}