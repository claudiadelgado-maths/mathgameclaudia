const DEFAULT_MONTH_FILE = "abril2026.json";
const CONTENT_BASE_PATH = "content";
const DEFAULT_AVATAR_PATH = "assets/avatars/default-avatar.png";
const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

document.addEventListener("DOMContentLoaded", () => {
  initRepositorio();
});

async function initRepositorio() {
  const preferredFile = getCurrentMonthFileName();
  const status = document.getElementById("repo-status");

  status.textContent = "Cargando publicaciones...";

  try {
    const loaded = await loadMonthlyContent(preferredFile, DEFAULT_MONTH_FILE);
    renderRepositorio(loaded.data, loaded.fileName);
    status.textContent = `${loaded.data.publicaciones.length} publicación(es) cargada(s).`;
  } catch (error) {
    console.error("No se pudo cargar el repositorio:", error);
    status.textContent = "No se pudo cargar el contenido mensual.";
    renderEmptyState("No fue posible leer el archivo mensual del repositorio.");
  }
}

function getCurrentMonthFileName(date = new Date()) {
  const monthName = MONTH_NAMES[date.getMonth()];
  return `${monthName}${date.getFullYear()}.json`;
}

async function loadMonthlyContent(preferredFile, fallbackFile) {
  const candidates = [preferredFile];

  if (fallbackFile && fallbackFile !== preferredFile) {
    candidates.push(fallbackFile);
  }

  for (const fileName of candidates) {
    const response = await fetch(`${CONTENT_BASE_PATH}/${fileName}`);

    if (!response.ok) {
      continue;
    }

    const data = await response.json();

    if (!Array.isArray(data.publicaciones)) {
      throw new Error(`El archivo ${fileName} no tiene una lista válida de publicaciones.`);
    }

    return { data, fileName };
  }

  throw new Error("No se encontró ningún archivo mensual disponible.");
}

function renderRepositorio(data, fileName) {
  const feed = document.getElementById("repo-feed");

  feed.innerHTML = "";

  if (data.publicaciones.length === 0) {
    renderEmptyState("Todavía no hay publicaciones en este mes.");
    return;
  }

  const cards = data.publicaciones.map(createPostCard);
  cards.forEach(card => feed.appendChild(card));

  typesetMath(feed);
}

function renderEmptyState(message) {
  const feed = document.getElementById("repo-feed");
  feed.innerHTML = "";

  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;

  feed.appendChild(empty);
}

function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  const header = document.createElement("div");
  header.className = "post-head";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar";
  avatar.src = post.avatar || DEFAULT_AVATAR_PATH;
  avatar.alt = `Avatar de ${post.nickname || "autor desconocido"}`;
  avatar.loading = "lazy";
  avatar.addEventListener("error", () => {
    if (avatar.src !== new URL(DEFAULT_AVATAR_PATH, window.location.href).href) {
      avatar.src = DEFAULT_AVATAR_PATH;
    }
  });

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const nickname = document.createElement("h3");
  nickname.textContent = post.nickname || "Autor desconocido";

  meta.appendChild(nickname);

  if (post.fecha) {
    const postDate = document.createElement("p");
    postDate.className = "post-date";
    postDate.textContent = post.fecha;
    meta.appendChild(postDate);
  }

  header.appendChild(avatar);
  header.appendChild(meta);

  const postTop = document.createElement("div");
  postTop.className = "post-top";

  const postTitle = document.createElement("h4");
  postTitle.className = "post-title";
  postTitle.textContent = post.titulo || "Publicación sin título";

  const toggle = document.createElement("button");
  toggle.className = "post-toggle";
  toggle.type = "button";
  toggle.textContent = "Ver";

  postTop.appendChild(postTitle);
  postTop.appendChild(toggle);

  const bodyShell = document.createElement("div");
  bodyShell.className = "post-body-shell";

  const body = document.createElement("div");
  body.className = "post-body";

  const bodyContent = document.createElement("div");
  bodyContent.className = "post-body-content";

  (post.bloques || []).forEach(block => {
    const blockNode = renderBlock(block);

    if (blockNode) {
      bodyContent.appendChild(blockNode);
    }
  });

  body.appendChild(bodyContent);
  bodyShell.appendChild(body);

  toggle.addEventListener("click", async () => {
    const isExpanded = article.classList.toggle("expandida");
    toggle.textContent = isExpanded ? "Ocultar" : "Ver";

    if (isExpanded) {
      await typesetMath(bodyContent);
    }
  });

  article.appendChild(header);
  article.appendChild(postTop);
  article.appendChild(bodyShell);

  return article;
}

function renderBlock(block) {
  if (!block || !block.tipo) {
    return null;
  }

  if (block.tipo === "texto") {
    const paragraph = document.createElement("p");
    paragraph.className = "content-text";
    paragraph.innerHTML = formatTextBlock(block.contenido || "");
    return paragraph;
  }

  if (block.tipo === "imagen") {
    const figure = document.createElement("figure");
    figure.className = "content-figure";

    const image = document.createElement("img");
    image.className = "content-image";
    image.src = block.src || "";
    image.alt = block.alt || "Imagen adjunta de la publicación";
    image.loading = "lazy";

    figure.appendChild(image);

    if (block.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = block.caption;
      figure.appendChild(caption);
    }

    return figure;
  }

  if (block.tipo === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(block.url);

    if (!embedUrl) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "video-frame";

    const frame = document.createElement("iframe");
    frame.src = embedUrl;
    frame.title = block.titulo || "Video de YouTube";
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;

    wrapper.appendChild(frame);
    return wrapper;
  }

  return null;
}

function formatTextBlock(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }
  } catch (error) {
    console.error("Enlace de YouTube inválido:", error);
  }

  return "";
}

function humanizeMonthFromFile(fileName) {
  const base = fileName.replace(".json", "");
  const match = base.match(/^([a-zñ]+)(\d{4})$/i);

  if (!match) {
    return "Repositorio mensual";
  }

  const monthName = match[1];
  const year = match[2];
  return `${capitalize(monthName)} ${year}`;
}

function capitalize(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function typesetMath(container) {
  if (!window.MathJax || !window.MathJax.typesetPromise) {
    return;
  }

  await window.MathJax.typesetPromise([container]);
}
