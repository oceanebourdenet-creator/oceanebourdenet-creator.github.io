// Script de la maquette : rendu des cartes, vidéos chargées au clic, filtres, CV.
(() => {
  const D = window.PORTFOLIO;
  const CHARGEMENT = Date.now();
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Couleur d'accent choisie dans la page de présentation des maquettes (?accent=…)
  const ACCENTS = { framboise: "#a3324f", encre: "#1f4a8a", foret: "#2d6a4f" };
  const accent = new URLSearchParams(location.search).get("accent");
  if (ACCENTS[accent]) document.documentElement.style.setProperty("--accent", ACCENTS[accent]);

  // ---------- Formatage (une seule fonction, comme demandé dans le brief 5.6) ----------
  const nf = new Intl.NumberFormat("fr-FR");
  const mois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
  const jour = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const parseDate = (s) => new Date(s.length === 7 ? s + "-01T12:00:00" : s + "T12:00:00");

  function chiffre(n, unite) {
    // « 850 vues », « 12 k vues », « 2,4 M de vues »
    if (n >= 1e6) {
      const v = Math.floor(n / 1e5) / 10;
      return `${nf.format(v)} M ${/^[aeiouéh]/i.test(unite) ? "d'" : "de "}${unite}`;
    }
    if (n >= 1e4) return `${nf.format(Math.floor(n / 1000))} k ${unite}`;
    return `${nf.format(n)} ${unite}`;
  }

  const CAT = Object.fromEntries(D.categories.map((c) => [c.slug, c]));
  const SKT = D.competences.techniques, SKH = D.competences.humaines;
  const FORMATS = { article: "Article", reportage: "Reportage", enquete: "Enquête", podcast: "Podcast", video: "Vidéo", interview: "Interview", autre: "Autre" };
  const PLATEFORMES = { youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram" };
  const pubs = [...D.publications].sort((a, b) => b.date.localeCompare(a.date));
  // Toutes les compétences d'une fiche : explicites + implicites des vidéos réalisées de A à Z
  const toutesCompetences = (p) => [...new Set([
    ...(p.competences?.techniques || []), ...(p.competences?.humaines || []),
    ...(p.format === "video" && !p.role ? D.competencesParDefaut || [] : [])
  ])];

  const ICON = {
    vues: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    likes: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.8 3.6 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.3 4.3 6.3C19.5 15.4 12 20 12 20Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    commentaires: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    partages: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>'
  };

  // ---------- Carte de prévisualisation ----------
  // Une compétence = un lien vers les publications qui la mobilisent
  const skillLinks = (c) => [
    ...(c?.techniques || []).map((k) => `<li><a class="sk sk--t" href="publications.html?competence=${k}">${esc(SKT[k])}</a></li>`),
    ...(c?.humaines || []).map((k) => `<li><a class="sk sk--h" href="publications.html?competence=${k}">${esc(SKH[k])}</a></li>`)
  ].join("");
  const statsHTML = (vues, likes, partages, dateChiffres, commentaires) => {
    const bits = [];
    if (vues) bits.push(`<span>${ICON.vues}<strong>${esc(chiffre(vues, "vues"))}</strong></span>`);
    if (likes) bits.push(`<span>${ICON.likes}<strong>${esc(chiffre(likes, "j'aime"))}</strong></span>`);
    if (commentaires) bits.push(`<span>${ICON.commentaires}<strong>${esc(chiffre(commentaires, commentaires > 1 ? "commentaires" : "commentaire"))}</strong></span>`);
    if (partages) bits.push(`<span>${ICON.partages}<strong>${esc(chiffre(partages, "partages"))}</strong></span>`);
    if (bits.length && dateChiffres) bits.push(`<em>${esc(mois.format(parseDate(dateChiffres)))}</em>`);
    return bits.length ? `<p class="stats">${bits.join("")}</p>` : "";
  };
  // Maquette : paramètre anti-cache pour voir tout de suite une vignette remplacée
  const img = (src) => `${esc(src)}?v=${CHARGEMENT}`;
  const vignette = (p, cat) => p.image && p.plateforme === "youtube" && !p.vertical
      ? `<img class="bg" src="${img(p.image)}" alt="" loading="lazy" aria-hidden="true"><img class="fg" src="${img(p.image)}" alt="" loading="lazy">`
      : p.image
      ? `<img src="${img(p.image)}" alt="" loading="lazy">`
      : `<div class="card-fallback" data-teinte="${[...p.url].reduce((h, c) => h + c.charCodeAt(0), 0) % 4}" aria-hidden="true"><small>${esc(FORMATS[p.format])} · ${esc(cat.libelle)}</small><b>${esc(p.media)}</b></div>`;

  // Texte « Les coulisses » : celui de la fiche, sinon celui de sa série
  const coulissesDe = (p) => p.coulisses || (p.serie && D.series?.[p.serie]?.coulisses) || "";
  const coulissesHTML = (c) => !c ? "" : `<div class="coulisses"><p class="coulisses-titre">Les coulisses</p>${
    Array.isArray(c) ? `<ul>${c.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : `<p>${esc(c)}</p>`}</div>`;

  function card(p, seq = "page") {
    const cat = CAT[p.categorie];
    const plat = PLATEFORMES[p.plateforme];
    const date = parseDate(p.date);
    const out = plat ? `Voir sur ${plat}` : `Lire sur ${p.media}`;
    // Vignette 16:9 (YouTube) : centrée sur un fond flouté pour garder des cartes de même hauteur
    const media = vignette(p, cat);
    // Étiquette sur la vignette : plateforme pour les vidéos, format pour le reste (« Article »)
    const etiquette = plat || FORMATS[p.format];
    const badge = `<span class="badge">${esc(etiquette)}${p.duree ? " · " + esc(p.duree) : ""}</span>`;
    const play = p.embed ? `<button class="play" type="button" data-play="${esc(p.url)}" data-seq="${esc(seq)}">${ICON.play}<span>Afficher la vidéo ${esc(plat)}</span></button>` : "";

    const stats = p.afficherChiffres ? statsHTML(p.vues, p.likes, p.partages, p.dateChiffres, p.commentaires) : "";
    const sk = skillLinks(p.competences);

    return `<article class="card" data-categorie="${p.categorie}">
      <div class="card-media${p.plateforme === "youtube" && !p.vertical ? " card-media--wide" : ""}">${media}${badge}${play}</div>
      <div class="card-body">
        <p class="card-cat">${esc(cat.libelle)}</p>
        <h3 class="card-title"><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.titre)}</a></h3>
        <p class="card-hook">${esc(p.accroche)}</p>
        ${p.role ? `<p class="card-role"><span>Mon rôle</span> ${esc(p.role)}</p>` : ""}
        <p class="card-meta"><b>${esc(p.media)}</b><span>·</span><time datetime="${p.date}">${esc(jour.format(date))}</time><span>·</span><span>${esc(FORMATS[p.format])}</span></p>
        ${stats}
        ${sk ? `<ul class="skills" aria-label="Compétences mobilisées">${sk}</ul>` : ""}
        ${coulissesDe(p) ? `<button class="coulisses-btn" type="button" data-play="${esc(p.url)}" data-seq="${esc(seq)}">Les coulisses <span aria-hidden="true">→</span></button>` : ""}
        <p class="card-out">${esc(out)} <span aria-hidden="true">↗</span><span class="sr"> (nouvel onglet)</span></p>
      </div>
    </article>`;
  }

  // ---------- Carte « série » : plusieurs vidéos d'un même événement ----------
  function serieCard(id, eps) {
    const s = D.series[id], cat = CAT[s.categorie];
    const first = eps[0], last = eps[eps.length - 1];
    const shown = eps.filter((p) => p.afficherChiffres);
    const sum = (k) => shown.reduce((t, p) => t + (p[k] || 0), 0);
    const comp = { techniques: [...new Set(eps.flatMap((p) => p.competences?.techniques || []))].slice(0, 3),
                   humaines: [...new Set(eps.flatMap((p) => p.competences?.humaines || []))].slice(0, 2) };
    const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
    return `<article class="card card--serie" data-categorie="${s.categorie}">
      <div class="card-media">${vignette(first, cat)}<span class="badge">Série · ${eps.length} vidéos</span>
        <span class="serie-stack" aria-hidden="true">${eps.slice(1, 4).map((p) => `<img src="${img(p.image)}" alt="">`).join("")}</span>
        <button class="play" type="button" data-play="${esc(first.url)}" data-seq="${esc(id)}">${ICON.play}<span>Voir les ${eps.length} vidéos</span></button></div>
      <div class="card-body">
        <p class="card-cat">${esc(cat.libelle)}</p>
        <h3 class="card-title"><a href="#" data-play="${esc(first.url)}" data-seq="${esc(id)}">${esc(s.titre)}</a></h3>
        <p class="card-hook">${esc(s.accroche)}</p>
        <p class="card-meta"><b>${esc(s.media)}</b><span>·</span><span>${esc(fmt.format(parseDate(first.date)))} – ${esc(jour.format(parseDate(last.date)))}</span><span>·</span><span>Série</span></p>
        ${statsHTML(sum("vues"), sum("likes"), sum("partages"), shown[0]?.dateChiffres, sum("commentaires"))}
        <ul class="skills" aria-label="Compétences mobilisées">${skillLinks(comp)}</ul>
        ${s.coulisses ? `<button class="coulisses-btn" type="button" data-play="${esc(first.url)}" data-seq="${esc(id)}">Les coulisses <span aria-hidden="true">→</span></button>` : ""}
        <p class="card-out">Voir les ${eps.length} vidéos <span aria-hidden="true">→</span></p>
      </div>
    </article>`;
  }

  // ---------- Vidéo intégrée, chargée uniquement au clic (brief 5.6) ----------
  function iframe(plateforme, id, vertical) {
    if (plateforme === "youtube")
      return `<iframe class="${vertical ? "emb-tt" : "emb-yt"}" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Vidéo YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    if (plateforme === "tiktok")
      return `<iframe class="emb-tt" src="https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=0&music_info=0" title="Vidéo TikTok" allow="autoplay; encrypted-media; fullscreen"></iframe>`;
    return `<iframe class="emb-ig" src="https://www.instagram.com/p/${id}/embed/" title="Vidéo Instagram" allow="autoplay; encrypted-media; fullscreen" scrolling="no"></iframe>`;
  }
  // Lecteur en fenêtre : la grille ne bouge pas, on passe d'une vidéo à l'autre.
  // SEQ associe un nom de suite à une liste de publications lisibles (page, phares, série).
  const SEQ = {};
  Object.keys(D.series || {}).forEach((id) => (SEQ[id] = pubs.filter((p) => p.serie === id).reverse()));
  const dlg = document.createElement("dialog");
  dlg.className = "lecteur";
  dlg.setAttribute("aria-labelledby", "lecteur-titre");
  dlg.innerHTML = `<div class="lecteur-in">
      <button class="lecteur-fermer" type="button" aria-label="Fermer le lecteur">×</button>
      <div class="lecteur-video"></div>
      <div class="lecteur-info"></div>
    </div>`;
  document.body.append(dlg);
  let cur = { seq: null, i: 0 };

  function afficher(seqName, i) {
    const list = SEQ[seqName] || [];
    if (!list.length) return;
    cur = { seq: seqName, i: (i + list.length) % list.length };
    const p = list[cur.i], plat = PLATEFORMES[p.plateforme], cat = CAT[p.categorie], serie = D.series?.[seqName];
    const wide = p.plateforme === "youtube" && !p.vertical;
    dlg.classList.toggle("is-wide", wide && !!p.embed);
    dlg.classList.toggle("is-article", !p.embed);
    // Vidéo : lecteur intégré. Article : image d'aperçu ou visuel de remplacement.
    dlg.querySelector(".lecteur-video").innerHTML = p.embed ? iframe(p.plateforme, p.embed, p.vertical)
      : `<div class="card-media lecteur-visuel">${vignette(p, cat)}</div>`;
    const prev = list[(cur.i - 1 + list.length) % list.length], next = list[(cur.i + 1) % list.length];
    dlg.querySelector(".lecteur-info").innerHTML = `
      <p class="card-cat">${esc(cat.libelle)}${serie ? ` · ${esc(serie.titre)}` : ""}</p>
      ${serie ? `<p class="lecteur-ep">Vidéo ${cur.i + 1} sur ${list.length}</p>` : ""}
      <h2 id="lecteur-titre">${esc(p.titre)}</h2>
      <p class="card-meta"><b>${esc(p.media)}</b><span>·</span><span>${esc(jour.format(parseDate(p.date)))}</span><span>·</span><span>${esc(FORMATS[p.format])}</span></p>
      <p class="card-hook">${esc(p.accroche)}</p>
      ${p.role ? `<p class="card-role"><span>Mon rôle</span> ${esc(p.role)}</p>` : ""}
      ${coulissesHTML(coulissesDe(p))}
      ${p.afficherChiffres ? statsHTML(p.vues, p.likes, p.partages, p.dateChiffres, p.commentaires) : ""}
      ${p.collaboration && p.plateforme === "instagram" && p.likes ? `<p class="note-collab">Publication en collaboration : le lecteur Instagram n'affiche que les j'aime d'un des comptes. Total : ${esc(nf.format(p.likes))} j'aime.</p>` : ""}
      <ul class="skills">${skillLinks(p.competences)}</ul>
      ${serie ? `<ol class="lecteur-liste">${list.map((q, j) => `<li><button type="button" data-goto="${j}" ${j === cur.i ? 'aria-current="true"' : ""}><img src="${img(q.image)}" alt=""><span>${esc(q.titre.replace(/^Tour des yoles : /, "").replace(/^./, (c) => c.toUpperCase()))}</span></button></li>`).join("")}</ol>` : ""}
      ${p.embed ? `<p class="third-party">Vidéo intégrée depuis ${esc(plat)}, qui peut déposer des cookies.</p>` : ""}
      <a class="${p.embed ? "more" : "btn"}" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${p.embed ? `Voir sur ${esc(plat)}` : `Lire l'article sur ${esc(p.media)}`} ↗</a>
      ${list.length > 1 ? `<div class="lecteur-nav">
        <button type="button" data-nav="-1"><span>← Précédente</span><small>${esc(prev.titre)}</small></button>
        <button type="button" data-nav="1"><span>Suivante →</span><small>${esc(next.titre)}</small></button>
      </div>` : ""}`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-play]");
    if (!b) return;
    e.preventDefault();
    const list = SEQ[b.dataset.seq] || [];
    afficher(b.dataset.seq, Math.max(0, list.findIndex((p) => p.url === b.dataset.play)));
    if (!dlg.open) dlg.showModal();
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest(".lecteur-fermer")) return dlg.close();
    const nav = e.target.closest("[data-nav]"), go = e.target.closest("[data-goto]");
    if (nav) afficher(cur.seq, cur.i + Number(nav.dataset.nav));
    if (go) afficher(cur.seq, Number(go.dataset.goto));
  });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") afficher(cur.seq, cur.i + 1);
    if (e.key === "ArrowLeft") afficher(cur.seq, cur.i - 1);
  });
  // À la fermeture, on vide le lecteur pour couper le son
  dlg.addEventListener("close", () => (dlg.querySelector(".lecteur-video").innerHTML = ""));
  // Instagram indique la hauteur de son lecteur : on ajuste l'iframe en conséquence.
  window.addEventListener("message", (e) => {
    if (!/(^|\.)instagram\.com$/.test(new URL(e.origin).hostname)) return;
    let d = e.data;
    try { if (typeof d === "string") d = JSON.parse(d); } catch { return; }
    if (d?.type !== "MEASURE" || !d.details?.height) return;
    document.querySelectorAll("iframe.emb-ig").forEach((f) => { if (f.contentWindow === e.source) f.style.height = d.details.height + "px"; });
  });


  // Liens de démonstration (PDF, mentions légales, formulaire)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-demo]");
    if (!a) return;
    e.preventDefault();
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = a.dataset.demo;
    t.className = "is-on";
    clearTimeout(t._h); t._h = setTimeout(() => (t.className = ""), 2600);
  });
  document.querySelectorAll("form[data-demo-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    f.querySelector(".form-note").textContent = "Maquette : sur le site, le message sera envoyé via Formspree.";
  }));

  const page = document.body.dataset.page;

  // ---------- Accueil ----------
  if (page === "accueil") {
    // Phares : publications et séries (une série = une carte), dans l'ordre du champ `phare`
    const phares = [
      ...pubs.filter((p) => p.phare && !p.serie).map((p) => ({ ordre: p.phare, p })),
      ...Object.entries(D.series || {}).filter(([, s]) => s.phare).map(([id, s]) => ({ ordre: s.phare, serie: id }))
    ].sort((a, b) => a.ordre - b.ordre);
    const rail = $("#phares");
    SEQ.phares = phares.filter((e) => e.p).map((e) => e.p);
    rail.innerHTML = phares.map((e) => e.serie ? serieCard(e.serie, SEQ[e.serie].slice()) : card(e.p, "phares")).join("");
    // Flèches du carrousel : défilement d'une carte, désactivées aux extrémités
    const btns = document.querySelectorAll("[data-rail]");
    const majFleches = () => {
      btns[0].disabled = rail.scrollLeft < 8;
      btns[1].disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    btns.forEach((b) => b.addEventListener("click", () => {
      const pas = rail.querySelector(".card").getBoundingClientRect().width + 28;
      rail.scrollBy({ left: pas * Number(b.dataset.rail), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }));
    rail.addEventListener("scroll", majFleches, { passive: true });
    majFleches();
    $("#catlinks").innerHTML = D.categories
      .map((c) => ({ c, n: pubs.filter((p) => p.categorie === c.slug).length }))
      .filter((x) => x.n)
      .map(({ c, n }) => `<li><a href="publications.html?categorie=${c.slug}${accent ? "&accent=" + accent : ""}">${esc(c.libelle)} · ${n}</a></li>`).join("");

    const likes = pubs.filter((p) => p.afficherChiffres && p.likes).reduce((s, p) => s + p.likes, 0);
    const plusDe = (n) => (n >= 1e6 ? `${nf.format(Math.floor(n / 1e5) / 10)} M` : n >= 1e4 ? `${nf.format(Math.floor(n / 1e4) * 10)} k` : nf.format(Math.floor(n / 100) * 100));
    $("#kpi-likes").textContent = plusDe(likes);
    $("#kpi-vues").textContent = plusDe(pubs.filter((p) => p.afficherChiffres && p.vues && p.plateforme === "instagram").reduce((s, p) => s + p.vues, 0));
    const debut = Math.min(...D.cv.experiences.map((x) => parseDate(x.debut).getFullYear()));
    $("#kpi-ans").textContent = new Date().getFullYear() - debut;

    $("#xp").innerHTML = D.cv.experiences.map((x) => `<li>
        <span class="xp-date">${esc(periode(x.debut, x.fin, true))}</span>
        <div>${x.logo ? `<img class="xp-logo" src="${esc(x.logo)}" alt="${esc(x.media)}">` : `<p class="xp-media">${esc(x.media)}</p>`}<p class="xp-role">${esc(x.poste)} · ${esc(x.type)} · ${esc(x.lieu)}</p></div>
      </li>`).join("");
  }

  // ---------- Publications ----------
  if (page === "publications") {
    const grid = $("#grid"), tabs = $("#tabs");
    const params = new URLSearchParams(location.search);
    const state = { categorie: params.get("categorie") || "", media: params.get("media") || "", format: params.get("format") || "", competence: params.get("competence") || "", tri: params.get("tri") || "" };
    // Tri « Plus vues » : uniquement sur les vues renseignées et affichées (jamais mélangées aux j'aime).
    const audience = (p) => (p.afficherChiffres && p.vues ? p.vues : 0);
    // Le bouton n'apparaît que si au moins la moitié des vidéos ont des vues affichées.
    const videos = pubs.filter((p) => p.format === "video");
    const triPossible = videos.length > 0 && videos.filter(audience).length >= videos.length / 2;
    if (!triPossible) { state.tri = ""; document.querySelector(".tri").hidden = true; }

    const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const medias = [...new Set(pubs.map((p) => p.media))].sort((a, b) => a.localeCompare(b, "fr"));
    const formats = [...new Set(pubs.map((p) => p.format))];
    const comps = [...new Set(pubs.flatMap(toutesCompetences))];

    $("#f-media").innerHTML = `<option value="">Tous les médias</option>` + medias.map((m) => `<option value="${slug(m)}">${esc(m)}</option>`).join("");
    $("#f-format").innerHTML = `<option value="">Tous les formats</option>` + formats.map((f) => `<option value="${f}">${esc(FORMATS[f])}</option>`).join("");
    $("#f-competence").innerHTML = `<option value="">Toutes les compétences</option>`
      + `<optgroup label="Techniques">${comps.filter((k) => SKT[k]).map((k) => `<option value="${k}">${esc(SKT[k])}</option>`).join("")}</optgroup>`
      + `<optgroup label="Humaines">${comps.filter((k) => SKH[k]).map((k) => `<option value="${k}">${esc(SKH[k])}</option>`).join("")}</optgroup>`;

    const matchSecondary = (p) =>
      (!state.media || slug(p.media) === state.media) &&
      (!state.format || p.format === state.format) &&
      (!state.competence || toutesCompetences(p).includes(state.competence));

    // Pages auteur des médias : tirées des expériences du CV (un seul endroit à mettre à jour)
    const auteurs = D.cv.experiences.filter((x) => x.pageAuteur);
    const lienAuteur = (x) => `<a href="${esc(x.pageAuteur)}" target="_blank" rel="noopener noreferrer">${esc(x.media)} ↗</a>`;
    $("#auteurs-intro").innerHTML = auteurs.length
      ? `Une sélection de mon travail. Tous mes articles sont sur ${auteurs.map(lienAuteur).join(" et ")}.` : "";
    const blocAuteurs = document.createElement("section");
    blocAuteurs.className = "auteurs";
    blocAuteurs.setAttribute("aria-labelledby", "t-auteurs");
    blocAuteurs.innerHTML = `<div class="auteurs-head"><h2 id="t-auteurs">Tous mes articles</h2>
        <p>Ici, une sélection. L'ensemble de mes articles est publié sur les sites des médias.</p></div>
      <ul>${auteurs.map((x) => `<li><a href="${esc(x.pageAuteur)}" target="_blank" rel="noopener noreferrer">
        ${x.logo ? `<img src="${esc(x.logo)}" alt="${esc(x.media)}">` : `<b>${esc(x.media)}</b>`}
        <span>Voir mes articles <span aria-hidden="true">↗</span><span class="sr"> sur ${esc(x.media)} (nouvel onglet)</span></span></a></li>`).join("")}</ul>`;

    function render() {
      const base = pubs.filter(matchSecondary);
      // Une série compte pour une publication
      const nb = (arr) => arr.filter((p) => !p.serie).length + new Set(arr.filter((p) => p.serie).map((p) => p.serie)).size;
      const cats = D.categories.map((c) => ({ ...c, n: nb(base.filter((p) => p.categorie === c.slug)) }));
      const keep = accent ? `&accent=${accent}` : "";
      tabs.innerHTML = [`<a href="?${keep.slice(1)}" data-cat="" ${!state.categorie ? 'aria-current="true"' : ""}>Tout <span>${nb(base)}</span></a>`]
        .concat(cats.filter((c) => c.n || c.slug === state.categorie).map((c) =>
          `<a href="?categorie=${c.slug}${keep}" data-cat="${c.slug}" ${state.categorie === c.slug ? 'aria-current="true"' : ""}>${esc(c.libelle)} <span>${c.n}</span></a>`)).join("");
      $("#cat-desc").textContent = state.categorie ? CAT[state.categorie].description : "Enquêtes, tendances, reportages et témoignages, du plus récent au plus ancien.";

      const list = base.filter((p) => !state.categorie || p.categorie === state.categorie);
      // Regroupe les vidéos d'une même série en une seule entrée
      const entries = [], vues = new Set();
      list.forEach((p) => {
        if (!p.serie) return entries.push({ p, date: p.date, aud: audience(p) });
        if (vues.has(p.serie)) return;
        vues.add(p.serie);
        const eps = list.filter((q) => q.serie === p.serie).sort((a, b) => a.date.localeCompare(b.date));
        entries.push({ serie: p.serie, eps, date: eps[eps.length - 1].date, aud: eps.reduce((t, q) => t + audience(q), 0) });
      });
      // Sans vues : en fin de liste, du plus récent au plus ancien
      if (state.tri === "vues") entries.sort((a, b) => (b.aud > 0) - (a.aud > 0) || b.aud - a.aud || b.date.localeCompare(a.date));
      SEQ.page = entries.filter((e) => e.p).map((e) => e.p);

      let html = "", annee = "";
      entries.forEach((e) => {
        const y = e.date.slice(0, 4);
        if (state.tri !== "vues" && y !== annee) { annee = y; html += `<h2 class="year">${y}</h2>`; }
        html += e.serie ? serieCard(e.serie, e.eps) : card(e.p, "page");
      });
      grid.innerHTML = html || `<p class="empty">Aucune publication ne correspond à ces filtres.</p>`;
      $("#count").textContent = `${entries.length} publication${entries.length > 1 ? "s" : ""}`;
      document.querySelectorAll("[data-tri]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tri === state.tri));
      // Filtre « Article » : le bloc des pages auteur remonte au-dessus des résultats
      if (auteurs.length) $(state.format === "article" ? "#auteurs-haut" : "#auteurs-bas").append(blocAuteurs);
      $("#f-media").value = state.media; $("#f-format").value = state.format; $("#f-competence").value = state.competence;
      $("#reset").hidden = !(state.media || state.format || state.competence || state.categorie);

      const q = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => v && q.set(k, v));
      if (accent) q.set("accent", accent);
      history.replaceState(null, "", q.toString() ? "?" + q : location.pathname);
    }
    tabs.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-cat]");
      if (!a) return;
      e.preventDefault();
      state.categorie = a.dataset.cat;
      render();
    });
    ["media", "format", "competence"].forEach((k) => $("#f-" + k).addEventListener("change", (e) => { state[k] = e.target.value; render(); }));
    $("#reset").addEventListener("click", () => { ["categorie", "media", "format", "competence"].forEach((k) => (state[k] = "")); render(); });
    document.querySelectorAll("[data-tri]").forEach((b) => b.addEventListener("click", () => { state.tri = b.dataset.tri; render(); }));
    // Clic sur une compétence d'une carte : on filtre sans recharger la page
    grid.addEventListener("click", (e) => {
      const a = e.target.closest("a.sk");
      if (!a) return;
      e.preventDefault();
      state.competence = new URL(a.href).searchParams.get("competence");
      state.categorie = "";
      render();
      $("#tabs").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    render();
  }

  // ---------- CV ----------
  function periode(debut, fin, court) {
    const f = (s) => court ? parseDate(s).getFullYear() : new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" }).format(parseDate(s));
    if (fin === "aujourd'hui") return court ? `Depuis ${f(debut)}` : `Depuis ${new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(parseDate(debut))}`;
    if (debut === fin) return String(f(debut));
    const a = f(debut), b = fin === "aujourd'hui" ? "aujourd'hui" : f(fin);
    return a === b ? String(a) : `${a} – ${b}`;
  }

  if (page === "cv") {
    const cv = D.cv;
    const keep = accent ? `&accent=${accent}` : "";
    const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    $("#exp").innerHTML = cv.experiences.map((x) => {
      const n = pubs.filter((p) => slug(p.media) === slug(x.media)).length;
      // Lien vers la page auteur du média si elle existe, sinon vers les publications filtrées du site
      const lien = x.pageAuteur
        ? `<a class="more ext" href="${esc(x.pageAuteur)}" target="_blank" rel="noopener noreferrer">Voir mes articles sur ${esc(x.media)} ↗</a>`
        : n ? `<a class="more pubs" href="publications.html?media=${slug(x.media)}${keep}">Voir mes publications pour ${esc(x.media)} (${n})</a>` : "";
      return `<li class="entry">
        <span class="entry-date">${esc(periode(x.debut, x.fin))}</span>
        <div>
          ${x.logo ? `<div class="entry-logos"><img src="${esc(x.logo)}" alt=""></div>` : ""}
          <h3 class="${x.logo ? "sr" : ""}">${esc(x.media)}</h3>
          <p class="role">${esc(x.poste)} <span>· ${esc(x.type)} · ${esc(x.lieu)}</span></p>
          <p class="desc">${esc(x.description)}</p>
          ${lien}
        </div>
      </li>`;
    }).join("");
    $("#form").innerHTML = cv.formations.map((x) => `<li class="entry">
        <span class="entry-date">${esc(periode(x.debut, x.fin))}</span>
        <div>${x.logos ? `<div class="entry-logos">${x.logos.map((l) => `<img src="${esc(l)}" alt="">`).join("")}</div>` : ""}<h3>${esc(x.diplome)}</h3><p class="role"><span>${esc(x.etablissement)}</span></p>${x.description ? `<p class="desc">${esc(x.description)}</p>` : ""}
        ${x.echange ? `<div class="sub-entry">
          <span class="entry-date">${esc(periode(x.echange.debut, x.echange.fin))}</span>
          <div>${x.echange.logos ? `<div class="entry-logos">${x.echange.logos.map((l) => `<img src="${esc(l)}" alt="">`).join("")}</div>` : ""}
            <h4>${esc(x.echange.titre)}</h4><p class="role"><span>${esc(x.echange.etablissement)}</span></p></div>
        </div>` : ""}</div>
      </li>`).join("");
    $("#eng").innerHTML = cv.engagement.map((x) => `<li class="entry">
        <span class="entry-date">${esc(periode(x.debut, x.fin))}</span>
        <div><div class="entry-logos">${x.logo ? `<img class="carre" src="${esc(x.logo)}" alt="">` : `<span class="mono" aria-hidden="true">${esc(x.structure[0])}</span>`}</div><h3>${esc(x.structure)}</h3><p class="role">${esc(x.role)}</p><p class="desc">${esc(x.description)}</p>${x.missions ? `<ul class="missions">${x.missions.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}${x.lien ? `<a class="more ext" href="${esc(x.lien.url)}" target="_blank" rel="noopener noreferrer">${esc(x.lien.libelle)} ↗</a>` : ""}</div>
      </li>`).join("");
    // Nombre de publications qui prouvent une compétence, avec lien vers la page filtrée
    const nbPreuves = (cle) => pubs.filter((p) => toutesCompetences(p).includes(cle)).length;
    const preuve = (cle) => {
      const n = cle ? nbPreuves(cle) : 0;
      return n ? `<a class="preuve" href="publications.html?competence=${cle}${keep}">${n} publication${n > 1 ? "s" : ""}</a>` : "";
    };
    const C = cv.competences;
    $("#skills-phares").innerHTML = C.phares.map((c) => `<li>
        <h3>${esc(c.titre)}</h3>
        <p>${esc(c.texte)}</p>
        <p class="exemple">Exemple : <a href="${esc(c.exemple.url)}" target="_blank" rel="noopener noreferrer">${esc(c.exemple.titre)} ↗</a></p>
        ${nbPreuves(c.cle) ? `<a class="more" href="publications.html?competence=${c.cle}${keep}">${nbPreuves(c.cle) > 1 ? `Voir les ${nbPreuves(c.cle)} publications` : "Voir la publication"}</a>` : ""}
      </li>`).join("");
    $("#skills").innerHTML = C.groupes.map((g, i) => `<div class="sk-groupe">
        <h3><span>${String(i + 1).padStart(2, "0")}</span>${esc(g.groupe)}</h3>
        <ul>${g.items.map((it) => `<li><span>${esc(it.nom)}</span>${preuve(it.cle)}</li>`).join("")}</ul>
        ${g.materiel ? `<p class="materiel-titre">Matériel</p><ul class="materiel">${g.materiel.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
      </div>`).join("");

    // Savoir-être : calculé à partir des fiches, avec lien vers les publications concernées
    const counts = {};
    pubs.forEach((p) => (p.competences?.humaines || []).forEach((k) => (counts[k] = (counts[k] || 0) + 1)));
    $("#soft").innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `<li><a href="publications.html?competence=${k}${keep}">${esc(SKH[k])} <span>${n}</span></a></li>`).join("");

    const LV = ["A1", "A2", "B1", "B2", "C1", "C2"];
    $("#langs").innerHTML = cv.langues.map((l) => {
      const i = LV.indexOf(l.niveau);
      return `<li><span>${esc(l.langue)}</span><span class="meter" aria-hidden="true">${LV.map((_, j) => `<i class="${j <= i ? "on" : ""}"></i>`).join("")}</span><b>${esc(l.niveau)}</b></li>`;
    }).join("");
  }

  // Garde la couleur d'accent choisie quand on navigue entre les pages de la maquette
  if (accent) document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((a) => {
    const [path, hash] = a.getAttribute("href").split("#");
    a.setAttribute("href", `${path}${path.includes("?") ? "&" : "?"}accent=${accent}${hash ? "#" + hash : ""}`);
  });
})();
