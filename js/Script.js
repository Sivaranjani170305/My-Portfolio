// ===========================
// TYPING ANIMATION
// ===========================

const roles = [
  "Python Full Stack Developer",
  "React Developer",
  "Django Backend Developer",
  "Frontend Web Developer"
];

let roleIndex = 0;
let charIndex = 0;
let typingElement = document.getElementById("typing");
let deleting = false;

function typeEffect(){

  const currentRole = roles[roleIndex];

  if(!deleting){
    typingElement.textContent = currentRole.substring(0,charIndex++);
    if(charIndex > currentRole.length){
      deleting = true;
      setTimeout(typeEffect,1500);
      return;
    }
  }else{
    typingElement.textContent = currentRole.substring(0,charIndex--);
    if(charIndex < 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect,deleting ? 50 : 100);
}

typeEffect();


// ===========================
// ACTIVE NAVBAR ON SCROLL
// ===========================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll",()=>{

  let current = "";

  sections.forEach(section=>{

    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if(pageYOffset >= sectionTop){
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach(link=>{

    link.classList.remove("active");

    if(link.getAttribute("href") === "#" + current){
      link.classList.add("active");
    }

  });

});


 // ===============================
// CONTACT FORM
// ===============================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const submitButton = document.getElementById("contactSubmit");
        const formMessage = document.getElementById("formMessage");

        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="bi bi-hourglass-split"></i>
            Sending...
        `;

        formMessage.innerHTML = "";

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000);

        try {
            const response = await fetch(
                "https://my-portfolio-fl8g.onrender.com/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    }),
                    signal: controller.signal
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to send message"
                );
            }

            formMessage.innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle-fill"></i>
                    ${data.message || "Message sent successfully!"}
                </div>
            `;

            contactForm.reset();

        } catch (error) {
            console.error("Contact Form Error:", error);

            const errorMessage = error.name === "AbortError"
                ? "Request timed out. Please try again."
                : "Unable to send message. Please try again.";

            formMessage.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-circle-fill"></i>
                    ${errorMessage}
                </div>
            `;

        } finally {
            clearTimeout(timeoutId);

            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="bi bi-send-fill"></i>
                Send Message
            `;
        }
    });
}