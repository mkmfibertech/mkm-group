/* ===== إعدادات الموقع — عدّل هنا فقط ===== */
const MKM = {
  whatsapp: "201012646236",           // رقم واتساب بالصيغة الدولية بدون +
  email: "",                           // اتركه فاضي لو مفيش إيميل، مش هيظهر
  area: "",                            // مثال: "القاهرة والجيزة" — يظهر في صفحة اتصل بنا لو اتكتب
  hours: "",                           // مثال: "السبت إلى الخميس، 10 ص – 8 م"
  social: {                            // اترك الفاضي فاضي — مش هيظهر. أضف الرابط لما الحساب يتحول
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: ""
  }
};

const waLink = (text = "") =>
  `https://wa.me/${MKM.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

/* تحميل الهيدر والفوتر في كل الصفحات (<div data-include="header">) */
async function loadComponents() {
  const slots = document.querySelectorAll("[data-include]");
  await Promise.all([...slots].map(async el => {
    try {
      const res = await fetch(`components/${el.dataset.include}.html`);
      el.innerHTML = await res.text();
    } catch (e) { console.error("component load failed", e); }
  }));
  initChrome();
}

function initChrome() {
  // تمييز الصفحة الحالية في القائمة
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
  // روابط واتساب
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = waLink("مرحباً MKM Group، أريد الاستفسار.");
    a.target = "_blank"; a.rel = "noopener";
  });
  // السوشيال: يظهر فقط اللي له رابط
  const box = document.getElementById("social-links");
  if (box) {
    const names = { facebook: "فيسبوك", youtube: "يوتيوب", instagram: "إنستجرام", tiktok: "تيك توك" };
    const items = Object.entries(MKM.social).filter(([, url]) => url);
    box.innerHTML = items.map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener">${names[k]}</a>`).join("");
    box.hidden = items.length === 0;
  }
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
}

/* نموذج "اطلب خدمة" → رسالة واتساب جاهزة */
function initRequestForm() {
  const form = document.getElementById("request-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = [
      "طلب جديد من موقع MKM Group",
      `الاسم: ${d.get("name")}`,
      `القسم: ${d.get("dept")}`,
      `التفاصيل: ${d.get("details") || "-"}`
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  });
}

document.addEventListener("DOMContentLoaded", () => { loadComponents(); initRequestForm(); });
