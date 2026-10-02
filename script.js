document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  /* ============================================================
     ПРОСТОЙ ПЕРЕХОД НА ПРИЛОЖЕНИЕ
     ============================================================ */

  const APP_URL = "http://www.sibxtrim.ru/";

  function isIOS() {
    return (
      (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function isSafari() {
    return (
      isIOS() &&
      /Safari/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS|Yandex/.test(navigator.userAgent)
    );
  }

  function isInAppBrowser() {
    const ua = navigator.userAgent || "";
    return (
      isIOS() &&
      (/Instagram|FBAN|FBAV|FB_IAB|Telegram|VK|TikTok|Twitter|Line|Snapchat/i.test(ua) ||
        !isSafari())
    );
  }

  function handleInstallClick() {
    // iOS: если открыто во встроенном браузере — перебрасываем в Safari
    if (isIOS() && isInAppBrowser() && !isSafari()) {
      const safariUrl = "x-safari-" + APP_URL;
      window.location.href = safariUrl;
      return;
    }

    // Всё остальное — просто открываем приложение
    window.open(APP_URL, "_blank");
  }

  window.handleInstallClick = handleInstallClick;

  /* ============================================================
     КОНЕЦ БЛОКА
     ============================================================ */

  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll('a[href^="#"]');

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  function toggleMobileMenu() {
    mobileMenu.classList.toggle("hidden");
    const icon = mobileMenuBtn.querySelector("i");
    if (!mobileMenu.classList.contains("hidden")) {
      icon.setAttribute("data-lucide", "x");
    } else {
      icon.setAttribute("data-lucide", "menu");
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          lucide.createIcons();
        }
      }
    });
  });

  const snowCanvas = document.getElementById("snow-canvas");
  let animationId = null;
  const snowflakes = [];
  const snowCount = 50;

  function resizeCanvas() {
    if (snowCanvas) {
      snowCanvas.width = window.innerWidth;
      snowCanvas.height = window.innerHeight;
    }
  }

  function createSnowflakes() {
    snowflakes.length = 0;
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.6 + 0.15,
        wind: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  function drawSimpleSnowflake(ctx, x, y, radius, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(0.5, radius * 0.3);
    ctx.lineCap = "round";

    const size = radius * 2.5;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    if (radius > 1.2) {
      const diag = size * 0.7;
      ctx.beginPath();
      ctx.moveTo(-diag, -diag);
      ctx.lineTo(diag, diag);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-diag, diag);
      ctx.lineTo(diag, -diag);
      ctx.stroke();
    }

    ctx.restore();
  }

  let lastTime = 0;
  function drawSnow(currentTime) {
    if (!snowCanvas) return;

    if (currentTime - lastTime < 16) {
      animationId = requestAnimationFrame(drawSnow);
      return;
    }
    lastTime = currentTime;

    const ctx = snowCanvas.getContext("2d");
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach((flake) => {
      flake.rotation += flake.rotationSpeed;
      flake.y += flake.speed;
      flake.x += flake.wind;
      const wobble = Math.sin(flake.rotation * 0.5) * 0.1;

      drawSimpleSnowflake(
        ctx,
        flake.x + wobble,
        flake.y,
        flake.radius,
        flake.rotation,
        flake.opacity,
      );

      if (flake.y > window.innerHeight + 5) {
        flake.y = -5;
        flake.x = Math.random() * window.innerWidth;
      }
      if (flake.x > window.innerWidth) flake.x = 0;
      if (flake.x < 0) flake.x = window.innerWidth;
    });

    animationId = requestAnimationFrame(drawSnow);
  }

  if (snowCanvas) {
    snowCanvas.style.willChange = "transform";
    snowCanvas.style.opacity = "1";
    resizeCanvas();
    createSnowflakes();
    window.addEventListener("resize", () => {
      resizeCanvas();
      createSnowflakes();
    });
    drawSnow(0);
  }

  const heroVideo = document.getElementById("hero-video");
  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        heroVideo.pause();
      } else {
        heroVideo.play();
      }
    });
  }

  function smoothScroll(e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealElements = document.querySelectorAll(
    "section h2, .glass-card, .glass-image",
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    revealObserver.observe(el);
  });

  const progressBar = document.getElementById("scroll-progress");

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;

      if (progressBar) {
        progressBar.style.width = scrolled + "%";
      }
    },
    { passive: true },
  );

  const sections = document.querySelectorAll("section[id]");

  function highlightNav() {
    const scrollPos = window.pageYOffset + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
          link.classList.remove("text-white");
          link.classList.add("text-white/80");
        });

        const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.remove("text-white/80");
          activeLink.classList.add("text-white");
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
});

const MODELS_DATA = {
  "skandic-le-2027": {
    title: 'BRP SKANDIC LE 24"',
    subtitle: "900 ACE • 95 л.с.",
    price: "2 190 000 ₽",
    description:
      "Флагманский утилитарный снегоход, построенный на совершенно новой платформе REV Gen5. Это не просто рабочая лошадка, а настоящий вездеход, созданный для покорения самых суровых зимних ландшафтов и выполнения самых тяжелых задач.",
    image: "images/skandic-le.png",
    features: [
      "Платформа REV Gen5 с телескопической подвеской LTS",
      "Система Multi-LinQ с грузоподъемностью 56.7 кг",
      "Цифровой дисплей 4.5 дюйма",
      "Понижающая передача EasyShift для буксировки",
    ],
  },
  "skandic-se-2027": {
    title: 'BRP SKANDIC SE 24"',
    subtitle: "900 ACE • 95 л.с.",
    price: "2 260 000 ₽",
    description:
      "Утилитарный снегоход, построенный на абсолютно новой платформе REV Gen5. В отличие от чисто рабочей версии LE, модель SE делает акцент на комфорте, технологиях и универсальности.",
    image: "images/skandic-se.png",
    features: [
      "Платформа REV Gen5",
      "Улучшенная эргономика и комфорт",
      "Современные технологии и опции",
      "Универсальность для работы и экспедиций",
    ],
  },
  "expedition-le-20-2027": {
    title: 'BRP EXPEDITION LE 20"',
    subtitle: "900 ACE • 95 л.с.",
    price: "2 130 000 ₽",
    description:
      "Кроссоверный утилитарник на новой платформе REV Gen5: 95 л.с., гусеница 20 дюймов и баланс между работой и приключениями.",
    image: "images/expedition-le.png",
    features: [
      "Платформа REV Gen5",
      "Гусеница 20 дюймов",
      "Баланс между работой и приключениями",
      "Кроссоверная универсальность",
    ],
  },
  "expedition-le-20-turbo-2027": {
    title: 'BRP EXPEDITION LE 20" TURBO R',
    subtitle: "900 ACE Turbo R • 180 л.с.",
    price: "2 420 000 ₽",
    description:
      "Флагманский кроссовер-утилитарник на платформе REV Gen5: 180 л.с. и гусеница 20 дюймов.",
    image: "images/expedition-le-turbo.png",
    features: [
      "Платформа REV Gen5",
      "Турбированный двигатель 900 ACE Turbo R",
      "Гусеница 20 дюймов",
      "Флагманская мощность 180 л.с.",
    ],
  },
  "expedition-se-20-turbo-2027": {
    title: 'BRP EXPEDITION SE 20" TURBO R',
    subtitle: "900 ACE Turbo R • 180 л.с.",
    price: "2 620 000 ₽",
    description:
      "Топовый кроссовер-утилитарник на платформе REV Gen5: 180 л.с., 20-дюймовый трак и премиальный комфорт с дисплеем 10,25″ и кофром LinQ на 135 л.",
    image: "images/expedition-se-turbo.png",
    features: [
      "Платформа REV Gen5",
      'Сенсорный дисплей 10,25"',
      "Кофр LinQ на 135 литров",
      "Премиальный комфорт и 180 л.с.",
    ],
  },
  "expedition-xtreme-2027": {
    title: "BRP EXPEDITION XTREME 900 ACE TURBO R",
    subtitle: "900 ACE Turbo R • 180 л.с. • 2027",
    price: "2 520 000 ₽",
    description:
      "Премиальный кроссовер на платформе REV Gen5 с 180-сильным турбомотором и широкой гусеницей 50 сантиметров. Создан для тех, кто хочет максимум возможностей — от дальних экспедиций до агрессивного катания по целине.",
    image: "images/expedition-xtreme.png",
    features: [
      "Платформа REV Gen5",
      "Турбированный двигатель 900 ACE Turbo R • 180 л.с.",
      "Гусеница 50 см (20 дюймов)",
      "Премиальный пакет оснащения Expedition Xtreme",
    ],
  },
  "summit-expert-turbo-2027": {
    title: "BRP SUMMIT EXPERT TURBO R",
    subtitle: "Turbo R • 180 л.с.",
    price: "2 540 000 ₽",
    description:
      "Эталонный горный снегоход на легкой платформе REV Gen5 для самых техничных склонов: 180 л.с. и сверхкороткий туннель.",
    image: "images/summit.png",
    features: [
      "Легкая платформа REV Gen5",
      "Сверхкороткий туннель",
      "Для самых техничных склонов",
      "180 л.с. мощности",
    ],
  },
  "lynx-commander-re-2027": {
    title: "LYNX COMMANDER RE 900 ACE TURBO R",
    subtitle: "900 ACE Turbo R • 180 л.с.",
    price: "2 790 000 ₽",
    description:
      "Многозадачный кроссовер на платформе Radien²: 180 л.с., широкая гусеница PowderMax и ходовая EasyRide+ с сенсорным дисплеем 10,25″.",
    image: "images/lynx.png",
    features: [
      "Платформа Radien²",
      "Ходовая EasyRide+",
      "Широкая гусеница PowderMax",
      'Сенсорный дисплей 10,25"',
    ],
  },
};

function openModelModal(id) {
  const data = MODELS_DATA[id];
  if (!data) return;

  const modal = document.getElementById("model-modal");
  const content = document.getElementById("model-content");
  const scroll = document.getElementById("model-scroll");

  const featuresHtml = data.features
    .map(
      (f) => `
        <li class="flex items-start">
            <i data-lucide="check-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-slon-blue mr-2 sm:mr-3 flex-shrink-0 mt-0.5"></i>
            <span class="text-gray-300 text-sm">${f}</span>
        </li>
    `,
    )
    .join("");

  scroll.innerHTML = `
        <div class="p-4 sm:p-6 pt-14 sm:pt-16">
            <h2 class="text-xl sm:text-3xl font-bold text-white mb-2">${data.title}</h2>
            <p class="text-base sm:text-xl text-gray-400 mb-4">${data.subtitle}</p>
            <div class="text-xl sm:text-3xl font-bold text-slon-blue mb-6">${data.price}</div>

            <div class="mb-6 rounded-xl overflow-hidden">
                <img src="${data.image}" alt="${data.title}"
                    class="w-full h-auto max-h-[240px] sm:max-h-[360px] object-cover">
            </div>

            <p class="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">${data.description}</p>

            <ul class="space-y-3 mb-8">
                ${featuresHtml}
            </ul>

            <a href="tel:+79137871232"
                class="w-full px-6 sm:px-8 py-3 sm:py-4 glass-button text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slon-blue/25 btn-primary text-center flex items-center justify-center gap-2 text-sm sm:text-base">
                <i data-lucide="phone" class="w-4 h-4 sm:w-5 sm:h-5"></i> Позвонить
            </a>
        </div>
    `;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  scroll.scrollTop = 0;

  requestAnimationFrame(() => {
    content.classList.remove("translate-y-full", "sm:scale-95");
  });

  setTimeout(() => lucide.createIcons(), 50);
}

function closeModelModal() {
  const modal = document.getElementById("model-modal");
  const content = document.getElementById("model-content");
  const scroll = document.getElementById("model-scroll");

  content.classList.add("translate-y-full", "sm:scale-95");

  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    scroll.innerHTML = "";
  }, 300);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModelModal();
});