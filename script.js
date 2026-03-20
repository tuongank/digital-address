// Mobile nav toggle
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const header = document.querySelector(".site-header");

const syncHeaderHeight = () => {
  if (!header) return;
  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
};

syncHeaderHeight();
window.addEventListener("resize", syncHeaderHeight);

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

// TOC drawer toggle
const tocToggle = document.getElementById("tocToggle");
const tocDrawer = document.getElementById("tocDrawer");
const tocOverlay = document.getElementById("tocOverlay");

const setTocOpen = (isOpen) => {
  if (!tocDrawer || !tocToggle || !tocOverlay) return;
  tocDrawer.classList.toggle("open", isOpen);
  tocOverlay.classList.toggle("show", isOpen);
  tocToggle.setAttribute("aria-expanded", String(isOpen));
  tocDrawer.setAttribute("aria-hidden", String(!isOpen));
  tocOverlay.setAttribute("aria-hidden", String(!isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
};

if (tocToggle && tocDrawer && tocOverlay) {
  tocToggle.addEventListener("click", () => {
    setTocOpen(!tocDrawer.classList.contains("open"));
  });

  tocOverlay.addEventListener("click", () => setTocOpen(false));

  tocDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setTocOpen(false));
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
  if (e.key === "Escape") setTocOpen(false);
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


// --- Custom Audio Player ---
const ttsAudio = document.getElementById('ttsAudio');
const btnPlayAudio = document.getElementById('btnPlayAudio');

if (btnPlayAudio && ttsAudio) {
  btnPlayAudio.addEventListener('click', () => {
    if (ttsAudio.paused) {
      // Bắt lỗi khi không có file audio hoặc không play được
      ttsAudio.play().then(() => {
        btnPlayAudio.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
      }).catch(err => {
        console.error("Audio play error:", err);
        alert("Không thể phát file âm thanh (kiểm tra lại tên file audio/den-ba.mp3).");
      });
    } else {
      ttsAudio.pause();
      btnPlayAudio.innerHTML = '<i class="fa-solid fa-play"></i> Nghe thuyết minh';
    }
  });

  ttsAudio.addEventListener('ended', () => {
    btnPlayAudio.innerHTML = '<i class="fa-solid fa-play"></i> Nghe thuyết minh';
  });
}
