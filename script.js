// Mobile nav toggle
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggleBtn && nav) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Auto close when clicking a link (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Back to top
const backtop = document.getElementById("backtop");
const onScroll = () => {
  if (!backtop) return;
  if (window.scrollY > 700) backtop.classList.add("show");
  else backtop.classList.remove("show");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (backtop) {
  backtop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Lightbox (images inside [data-lightbox])
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

const openLightbox = (src, alt = "") => {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Ảnh phóng to";
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-lightbox] img").forEach(img => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    // click outside image closes
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Scrollspy for nav + toc
const spyLinks = [
  ...document.querySelectorAll(".site-nav a"),
  ...document.querySelectorAll("#toc-links a[data-spy]")
];

const sections = spyLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActive = (id) => {
  spyLinks.forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === `#${id}`);
  });
};

const spy = new IntersectionObserver((entries) => {
  // choose most visible
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible?.target?.id) setActive(visible.target.id);
}, {
  root: null,
  threshold: [0.25, 0.35, 0.5, 0.65]
});

sections.forEach(sec => spy.observe(sec));
