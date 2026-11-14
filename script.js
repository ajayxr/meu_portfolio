const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const CONTACT_EMAIL = "";

document.documentElement.classList.add("js-ready");
document.querySelector("#current-year").textContent = new Date().getFullYear();

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      primaryNav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    const projectSelect = document.querySelector('select[name="project"]');
    const plan = link.dataset.plan;
    if (projectSelect && [...projectSelect.options].some((option) => option.value === plan)) {
      projectSelect.value = plan;
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-intro, .plan-card, .project-card, .about-copy, .process-copy, .ownership-inner, .maintenance-card, .testimonial-empty, .faq-list, .final-cta-inner, .contact-form").forEach((element) => {
    element.setAttribute("data-reveal", "");
    revealObserver.observe(element);
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    if (!CONTACT_EMAIL) {
      feedback.textContent = "O formulário está pronto, mas ainda falta configurar o e-mail que receberá as solicitações. Adicione seu endereço em CONTACT_EMAIL no arquivo script.js.";
      return;
    }

    const formData = new FormData(contactForm);
    const subject = `Novo contato pelo site — ${formData.get("project")}`;
    const body = [
      `Nome: ${formData.get("name")}`,
      `WhatsApp: ${formData.get("phone")}`,
      `E-mail: ${formData.get("email")}`,
      `Tipo de projeto: ${formData.get("project")}`,
      "",
      "Sobre o projeto:",
      formData.get("message"),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = "Sua solicitação foi preparada no aplicativo de e-mail. Revise e envie a mensagem para concluir.";
  });
}
