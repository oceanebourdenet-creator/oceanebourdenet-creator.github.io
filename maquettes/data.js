// Données de la maquette.
// Les publications sont des EXEMPLES trouvés en ligne (pas celles d'Océane) : elles servent
// uniquement à juger la mise en page. Les compétences associées sont fictives.
// Les chiffres sont ceux affichés publiquement par les plateformes, relevés le 10 octobre 2026.
// Les champs reprennent le schéma des fiches du brief (section 5.2), plus un champ
// `competences` (techniques / humaines) à ajouter au schéma.

window.PORTFOLIO = {
  categories: [
    { slug: "enquetes-osint", libelle: "Enquêtes OSINT", description: "Enquêtes en sources ouvertes : images satellites, géolocalisation, vérification d'images." },
    { slug: "tendances", libelle: "Tendances", description: "Ce qui devient viral sur les réseaux sociaux, expliqué et remis en contexte." },
    { slug: "reportages", libelle: "Reportages", description: "Du terrain, en vidéo pour les réseaux sociaux ou à l'écrit." },
    { slug: "mini-documentaires", libelle: "Mini-documentaires", description: "Des formats plus longs pour prendre le temps d'un sujet." },
    { slug: "temoignages", libelle: "Témoignages", description: "Une personne raconte, à la première personne." }
  ],

  competences: {
    techniques: {
      osint: "OSINT", satellite: "Images satellites", donnees: "Collecte de données", archives: "Recherche d'archives", carto: "Cartographie", verif: "Vérification d'images", geoloc: "Géolocalisation", tournage: "Tournage",
      mojo: "Mojo", montage: "Montage Premiere Pro", soustitrage: "Sous-titrage", interview: "Interview",
      anglais: "Anglais", arabe: "Arabe", dataviz: "Data visualisation", ecriture: "Écriture web", seo: "Référencement SEO",
      script: "Script vidéo", motion: "Motion design After Effects", incarnation: "Incarnation face caméra", photoshop: "Photoshop"
    },
    humaines: {
      rigueur: "Rigueur", tenacite: "Ténacité", pedagogie: "Pédagogie", synthese: "Esprit de synthèse",
      reactivite: "Réactivité", humour: "Sens de l'humour", aisance: "Aisance relationnelle",
      ecoute: "Écoute", empathie: "Empathie", confiance: "Mise en confiance", curiosite: "Curiosité",
      adaptabilite: "Adaptabilité", organisation: "Organisation", sangfroid: "Sang-froid"
    }
  },

  // Publications réelles (liste fournie dans videos.docx + article de L'Orient-Le Jour).
  // Titres et compétences proposés pour la maquette : à valider par Océane.
  // `role` (« Mon rôle ») : à renseigner seulement quand il diffère du rôle par défaut ci-dessous.
  // `collaboration` : publication Instagram partagée entre plusieurs comptes ; le lecteur intégré
  // n'affiche alors que les j'aime d'un compte, le site le signale.
  // `phare` : position dans le carrousel de l'accueil (1 = première carte). Absent = pas en phare.
  // `serie` : regroupe plusieurs vidéos d'un même événement en une seule carte sur la page Publications.
  // Chiffres : j'aime publics relevés le 10 octobre 2026.
  roleParDefaut: "sujet, script, tournage, montage et motion design",
  // Compétences techniques implicites d'une vidéo réalisée de A à Z (comptées dans le CV et les filtres,
  // sans être répétées sur chaque carte). Ne s'appliquent pas si la fiche a un `role` spécifique.
  competencesParDefaut: ["script", "tournage", "montage", "motion"],

  series: {
    "tour-des-yoles-2026": {
      titre: "Tour des yoles rondes de Martinique 2026",
      accroche: "Quatre jours de course, quatre vidéos tournées, montées et publiées le jour même, de la première étape à la finale.",
      categorie: "reportages", media: "France-Antilles", phare: 7,
      coulisses: "Pendant le Tour des yoles de Martinique, chaque vidéo correspond à une journée de course, et tout se faisait le jour même. Le matin, je définissais l'angle et je préparais le sujet avec des recherches documentaires et des images d'archives. J'allais ensuite sur le terrain pour les interviews et les images de la compétition, puis je rentrais à la rédaction monter la vidéo en trois heures sur Premiere Pro, pour la publier le soir même."
    }
  },

  publications: [
    // ---------- Enquêtes OSINT ----------
    {
      titre: "Iran : ce que montrent les images satellites des sites nucléaires après les frappes",
      media: "TV5MONDE", date: "2026-05-13", url: "https://www.instagram.com/reel/DYSfkk2s8gN/",
      categorie: "enquetes-osint", format: "video", plateforme: "instagram", embed: "DYSfkk2s8gN", phare: 2,
      accroche: "Images satellites des attaques israélo-américaines en Iran, en juin 2025 et en février 2026.",
      coulisses: "J'ai demandé à Airbus des images satellites Pléiades pour comprendre les dégâts causés par les attaques israélo-américaines du 28 février 2026 en Iran. En les analysant, je me suis aperçue que certains sites avaient déjà été détruits par Israël, avec l'aide des États-Unis, en juin 2025. J'ai donc interrogé Emmanuelle Galichet, chercheuse au CNAM, sur l'impact de ces attaques sur le programme nucléaire iranien. Elle m'a confirmé que détruire un programme nucléaire, comme le prétend Donald Trump, se fait en plusieurs étapes.",
      image: "vignettes/ig-DYSfkk2s8gN.jpg",
      vues: 4500, likes: 83, commentaires: 2, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: false,
      competences: { techniques: ["incarnation", "satellite", "osint", "interview"], humaines: ["rigueur", "tenacite"] }
    },
    {
      titre: "Détroit d'Ormuz : une catastrophe écologique en cours au large de l'Iran ? Ces images satellite interpellent",
      media: "TV5MONDE", date: "2026-04-01", url: "https://information.tv5monde.com/international/detroit-dormuz-une-catastrophe-ecologique-en-cours-au-large-de-liran-ces-images-satellite-interpellent-2818677", phare: 5,
      // Date à vérifier : le site bloque les robots et l'article n'est pas archivé.
      categorie: "enquetes-osint", format: "article",
      accroche: "Des photos prises par satellite montrent l'apparition de nappes sombres à la surface de la mer dans le détroit d'Ormuz, depuis le début de la guerre déclenchée par les États-Unis et Israël contre l'Iran.",
      image: "vignettes/tv5-2818677.jpg",
      coulisses: ["J'ai récupéré les images satellites sur Copernicus.", "J'ai construit un comparatif avant / après sur Flourish.", "J'ai interviewé la géographe Isabella Damiani pour décrypter les images."],
      competences: { techniques: ["satellite", "dataviz", "interview"], humaines: ["rigueur"] }
    },
    {
      titre: "Syrie : Kurdes intégrés dans l'armée, retrait des forces gouvernementales… Ce que prévoit l'accord entre les deux parties",
      media: "TV5MONDE", date: "2026-02-02", url: "https://information.tv5monde.com/international/syrie-kurdes-integres-dans-larmee-retrait-des-forces-gouvernementales-ce-que-prevoit-laccord-entre-les-deux-parties-2808039",
      categorie: "enquetes-osint", format: "article",
      accroche: "Les enjeux de l'accord entre le gouvernement d'Al-Charaa et les Forces démocratiques syriennes (FDS), à majorité kurde, expliqués avec une carte.",
      coulisses: "Pour comprendre les enjeux de l'accord entre le gouvernement d'Al-Charaa et les Forces démocratiques syriennes, à majorité kurde, j'ai réalisé une carte interactive à partir de données en sources ouvertes.",
      image: "vignettes/tv5-2808039.jpg",
      competences: { techniques: ["carto", "osint"], humaines: ["pedagogie"] }
    },
    {
      titre: "Les Martiniquais sont-ils plus armés qu'avant ?",
      media: "France-Antilles", date: "2025-09-12", url: "https://www.martinique.franceantilles.fr/actualite/faitsdivers/les-martiniquais-sont-ils-plus-armes-quavant-1050020.php", phare: 8,
      categorie: "enquetes-osint", format: "article",
      accroche: "150 nouveaux détenteurs d'armes enregistrés depuis janvier par la préfecture : une hausse de 9 % en six mois, qui se traduit aussi par une plus grande fréquentation des stands de tir sportif.",
      coulisses: ["J'ai collecté les données sur les sites du ministère de l'Intérieur et du ministère des Outre-mer.", "J'ai mené des interviews sur le terrain, dans des stands de tir et auprès de vendeurs d'armes.", "J'ai créé une infographie pour comprendre l'évolution du port d'armes en Martinique."],
      image: "vignettes/fa-1050020.jpg",
      competences: { techniques: ["donnees", "interview", "dataviz"], humaines: ["tenacite", "rigueur"] }
    },

    // ---------- Tendances ----------
    {
      titre: "Mauritanie : le « train du désert », nouvelle star des réseaux sociaux",
      media: "TV5MONDE", date: "2025-12-13", url: "https://www.instagram.com/reel/DSM2egujY-F/",
      categorie: "tendances", format: "video", plateforme: "instagram", embed: "DSM2egujY-F", collaboration: true, phare: 6,
      accroche: "Explainer et interview d'un jeune qui a pris l'« Iron Train » au milieu du désert, en Mauritanie.",
      coulisses: "J'ai observé une tendance sur les réseaux sociaux : des jeunes montent dans un train en Mauritanie et se font filmer à l'intérieur. J'ai interviewé un jeune passager pour comprendre ses motivations. En enquêtant sur ce train, j'ai découvert qu'il s'agit du plus grand train de minerai de Mauritanie, et que monter à bord est dangereux et surtout totalement interdit.",
      image: "vignettes/ig-DSM2egujY-F.jpg",
      vues: 1100000, likes: 21860, commentaires: 54, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["incarnation", "interview", "verif"], humaines: ["curiosite", "pedagogie"] }
    },
    {
      titre: "Kaly Putic, le créateur éthiopien comparé à Khaby Lame",
      media: "TV5MONDE", date: "2026-04-29", url: "https://www.instagram.com/reel/DXtpMCIjc4v/",
      categorie: "tendances", format: "video", plateforme: "instagram", embed: "DXtpMCIjc4v", phare: 10,
      accroche: "Kaly Putic est un créateur éthiopien devenu viral sur les réseaux sociaux. Certains médias éthiopiens le comparent déjà à Khaby Lame, le vidéaste et influenceur sénégalo-italien.",
      coulisses: "J'ai observé son profil sur les réseaux sociaux et fait des recherches sur lui dans la presse éthiopienne. J'ai enquêté à partir de son compte TikTok pour en savoir plus sur sa ville d'origine, la date de création de son compte et savoir s'il était monétisé.",
      image: "vignettes/ig-DXtpMCIjc4v.jpg",
      vues: 22500, likes: 1045, commentaires: 7, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["osint", "verif"], humaines: ["curiosite", "rigueur"] }
    },
    {
      titre: "Sasha Wenk, la star du kung-fu de Shaolin sur les réseaux sociaux",
      media: "TV5MONDE", date: "2026-04-21", url: "https://www.instagram.com/p/DXZ3TB1EROT/",
      categorie: "tendances", format: "video", plateforme: "instagram", embed: "DXZ3TB1EROT", phare: 4,
      accroche: "Sasha Wenk est allemand et suisse. C'est une star du kung-fu sur les réseaux sociaux. Il pratique cet art martial chinois à Shaolin, un site religieux devenu tendance.",
      coulisses: "À l'occasion de la sortie de son livre, j'ai cherché à l'interviewer pour comprendre l'engouement autour des maîtres Shaolin. J'ai préparé les questions, réalisé l'interview, puis monté la vidéo sur Premiere Pro.",
      image: "vignettes/ig-DXZ3TB1EROT.jpg",
      vues: 4100000, likes: 13403, commentaires: 79, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["interview", "montage"], humaines: ["curiosite", "aisance"] }
    },
    {
      titre: "Des chercheurs ont reproduit numériquement le cerveau d'une mouche",
      media: "TV5MONDE", date: "2026-09-20", url: "https://www.instagram.com/p/Ddg1RlfNr8V/",
      categorie: "tendances", format: "video", plateforme: "instagram", embed: "Ddg1RlfNr8V", phare: 1,
      accroche: "Des chercheurs de Google Research et du HHMI Janelia ont répliqué numériquement le cerveau d'une mouche du vinaigre. Une avancée qui pourrait rendre l'intelligence artificielle plus efficace et plus sobre en énergie.",
      coulisses: "J'ai lu l'étude des chercheurs sur cette découverte et je l'ai vulgarisée pour la rendre accessible, à l'aide de vidéos publiées sur les réseaux sociaux et d'interviews de chercheurs.",
      image: "vignettes/ig-Ddg1RlfNr8V.jpg",
      vues: 20700, likes: 310, commentaires: 4, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["script", "verif"], humaines: ["pedagogie", "synthese"] }
    },

    // ---------- Reportages ----------
    {
      titre: "« On est le 14 juillet et on perd » : les supporters français après France-Espagne",
      media: "TV5MONDE", date: "2026-07-15", url: "https://www.instagram.com/reel/DazpijzN3LA/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "DazpijzN3LA", collaboration: true, phare: 3,
      accroche: "TV5MONDE a assisté à l'élimination de la France en demi-finale du Mondial, face à l'Espagne. Une défaite 2-0 qui n'a pas empêché les supporters français réunis à Paris de faire la fête.",
      coulisses: "Pour la demi-finale de la Coupe du monde, j'ai fait un reportage sur le terrain avec des supporters de la France. J'avais cherché mes interlocuteurs en amont. L'enjeu : tourner à l'iPhone avec micro et lumière, puis revenir à la rédaction et monter sur Premiere Pro en moins de 24 heures.",
      image: "vignettes/ig-DazpijzN3LA.jpg",
      vues: 1000000, likes: 17036, commentaires: 11, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["mojo", "interview", "montage"], humaines: ["reactivite", "aisance"] }
    },
    {
      titre: "Mauvais Djo, de speaker à chanteur, sort L'Undertaker partie 2",
      media: "TV5MONDE", date: "2026-09-04", url: "https://www.instagram.com/p/Dc3_k3gN5kT/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "Dc3_k3gN5kT", collaboration: true, phare: 9,
      accroche: "D'abord speaker, il s'est imposé comme chanteur et enchaîne les succès : Charger avec le groupe Triangle des Bermudes en 2025, puis Pilé et Maladie en solo. Son album sort ce vendredi 4 septembre.",
      coulisses: "J'ai contacté son attaché de presse et organisé une interview avec l'artiste et son agent, pour qu'elle puisse être diffusée à l'antenne de TV5MONDE et sur les réseaux sociaux. Pour la préparer, j'ai visionné ses entretiens dans d'autres médias et analysé les réactions de ses fans en ligne. J'ai ensuite écrit les questions, préparé le dispositif de tournage, réalisé l'interview, puis monté et publié la vidéo.",
      image: "vignettes/ig-Dc3_k3gN5kT.jpg",
      vues: 2000000, likes: 4887, commentaires: 3, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["interview", "tournage", "montage"], humaines: ["organisation", "aisance"] }
    },
    {
      titre: "Tour des yoles : la première étape rend hommage à Gabriel Mélidor",
      media: "France-Antilles", date: "2026-07-27", url: "https://www.instagram.com/p/DbRrzMhRdpe/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "DbRrzMhRdpe", serie: "tour-des-yoles-2026",
      accroche: "Figure de la yole, il avait participé au tout premier Tour en 1985. Ses proches racontent ce que cet hommage représente.",
      image: "vignettes/ig-DbRrzMhRdpe.jpg",
      vues: 28700, likes: 567, commentaires: 7, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["archives", "interview", "montage"], humaines: ["ecoute", "empathie"] }
    },
    {
      titre: "Tour des yoles : Félix Merine savoure la victoire d'Ufr-Chanflor au Robert",
      media: "France-Antilles", date: "2026-07-28", url: "https://www.instagram.com/p/DbVpTvVRn7G/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "DbVpTvVRn7G", serie: "tour-des-yoles-2026",
      accroche: "Douze fois vainqueur du Tour et maire du Robert, il fête la victoire de la deuxième étape, à domicile.",
      image: "vignettes/ig-DbVpTvVRn7G.jpg",
      vues: 113000, likes: 2048, commentaires: 15, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["tournage", "interview", "montage"], humaines: ["reactivite", "adaptabilite"] }
    },
    {
      titre: "Tour des yoles : à 19 ans, Georgy Lagier-Lamon mène la yole CMA CGM",
      media: "France-Antilles", date: "2026-07-31", url: "https://www.instagram.com/p/Dbd-Ddix5Qg/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "Dbd-Ddix5Qg", serie: "tour-des-yoles-2026",
      accroche: "Portrait du plus jeune patron de yole du Tour, après la 5e étape entre Saint-Pierre et Fort-de-France.",
      image: "vignettes/ig-Dbd-Ddix5Qg.jpg",
      vues: 28900, likes: 841, commentaires: 15, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["tournage", "interview", "montage"], humaines: ["confiance", "adaptabilite"] }
    },
    {
      titre: "Tour des yoles : le maire de Gorée assiste à la finale",
      media: "France-Antilles", date: "2026-08-03", url: "https://www.instagram.com/p/DblV2FXRSxx/",
      categorie: "reportages", format: "video", plateforme: "instagram", embed: "DblV2FXRSxx", serie: "tour-des-yoles-2026",
      accroche: "La visite d'Augustin Senghor rappelle les liens entre le Sénégal et la Martinique, où la yole est un symbole de fraternité.",
      image: "vignettes/ig-DblV2FXRSxx.jpg",
      vues: 20300, likes: 297, commentaires: 9, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["tournage", "interview", "montage"], humaines: ["curiosite", "aisance"] }
    },

    // ---------- Témoignages ----------
    {
      titre: "« Ça m'a détruit mentalement » : Carlos, expulsé des États-Unis par l'ICE",
      media: "TV5MONDE", date: "2026-02-13", url: "https://www.youtube.com/shorts/5Qen6jLocCU",
      categorie: "temoignages", format: "video", plateforme: "youtube", vertical: true, embed: "5Qen6jLocCU", duree: "1 min 36",
      accroche: "Carlos est Mexicain. Il a été arrêté par l'ICE, la police de l'immigration américaine, incarcéré puis expulsé, sans avoir commis la moindre infraction.",
      coulisses: "J'ai vu sur les réseaux sociaux la vidéo de l'arrestation d'un Mexicain, et je l'ai contacté pour avoir sa version des faits. Il m'a transmis des documents judiciaires, que j'ai décryptés pour m'assurer des faits. Je l'ai ensuite interviewé via Teams, puis j'ai monté la vidéo avec des images d'archives.",
      image: "vignettes/yt-5Qen6jLocCU.jpg",
      vues: 6239, dateChiffres: "2026-10-10", sourceChiffres: "public", afficherChiffres: true,
      competences: { techniques: ["incarnation", "verif", "interview", "archives"], humaines: ["confiance", "rigueur"] }
    }
  ],

  // Repris du CV (septembre 2026). Pas d'adresse ni de téléphone (brief, 6.4).
  cv: {
    profil: {
      nom: "Océane Bourdenet",
      titre: "Journaliste vidéo et web",
      ville: "Paris",
      accroche: "Enquêtes en sources ouvertes, reportages et témoignages pour les réseaux sociaux, entre Paris, Beyrouth et la Martinique.",
      resume: "Formée à l'ESJ Lille et à Sciences Po Lille, j'ai travaillé pour TV5MONDE, France-Antilles, L'Orient-Le Jour et l'AFP, entre Paris, la Martinique, Beyrouth et Le Caire. Je porte mes sujets de l'idée à la publication : angle, recherches, script, contact des sources, tournage, montage, motion design sur After Effects.",
      reseaux: [
        { nom: "LinkedIn", url: "https://fr.linkedin.com/in/oc%C3%A9ane-bourdenet-6babb7200" }
      ]
    },
    experiences: [
      { media: "Journaliste pigiste", poste: "Piges pour TV5MONDE", type: "Indépendante", lieu: "Paris", debut: "2026-09", fin: "aujourd'hui",
        description: "Sujets vidéo et web proposés et réalisés pour TV5MONDE." },
      { media: "TV5MONDE", logo: "logos/tv5monde.svg", pageAuteur: "https://information.tv5monde.com/auteur/oceane-bourdenet/556",
        poste: "Journaliste vidéo / web", type: "Alternance", lieu: "Paris", debut: "2025-09", fin: "2026-09",
        description: "Vidéos courtes pour les réseaux sociaux et articles web pour la rédaction numérique." },
      { media: "France-Antilles", logo: "logos/franceantilles.png", poste: "Journaliste vidéo", type: "CDD", lieu: "Martinique", debut: "2025-07", fin: "2025-09",
        description: "Reportages vidéo pour le site et les réseaux sociaux du quotidien." },
      { media: "AFP", logo: "logos/afp.svg", poste: "Journaliste d'agence", type: "Stage d'un mois", lieu: "Le Caire, Égypte", debut: "2024-01", fin: "2024-01",
        description: "Rédaction de dépêches au bureau du Caire." },
      { media: "L'Orient-Le Jour", logo: "logos/lorientlejour.svg", pageAuteur: "https://www.lorientlejour.com/author/9702-oceane-bourdenet",
        poste: "Service vidéo et service économie", type: "Stage", lieu: "Beyrouth, Liban", debut: "2023-02", fin: "2023-06",
        description: "Vidéos pour les réseaux sociaux et articles pour le service économie." }
    ],
    formations: [
      { etablissement: "ESJ Lille et Sciences Po Lille", logos: ["logos/esj.svg", "logos/sciencespo.svg"], diplome: "Master de journalisme, spécialité internationale", debut: "2024-09", fin: "2026-06",
        description: "Vidéo, OSINT, cours d'arabe." },
      { etablissement: "École Supérieure de Journalisme de Lille (ESJ Lille) - Université de Lille", logos: ["logos/esj.svg"], diplome: "DEUG Économie-Gestion, option journalisme", debut: "2023-09", fin: "2024-06" },
      { etablissement: "École Supérieure de Journalisme de Lille (ESJ Lille) - Université de Lille", logos: ["logos/esj.svg"], diplome: "Licence de science politique, option journalisme, mention Bien", debut: "2020-09", fin: "2023-06",
        // Échange effectué pendant la licence : affiché en retrait, rattaché à celle-ci
        echange: { titre: "Échange universitaire", etablissement: "Université Saint-Joseph de Beyrouth (Liban)", logos: ["logos/usj.jpg"], debut: "2022-09", fin: "2023-06" } }
    ],
    // Compétences du CV : 3 phares, puis des groupes calqués sur « De l'idée à la publication ».
    // `cle` relie une compétence aux fiches de publication (nombre de preuves + lien filtré).
    competences: {
      phares: [
        { titre: "Enquête en sources ouvertes", cle: "osint",
          texte: "Images satellites, géolocalisation, recoupements : je vérifie ce que montrent les images avant de les publier.",
          exemple: { titre: "Iran : les images satellites des sites nucléaires", url: "https://www.instagram.com/reel/DYSfkk2s8gN/" } },
        { titre: "Motion design", cle: "motion",
          texte: "Cartes, chiffres et titres animés sur After Effects pour rendre un sujet lisible en quelques secondes.",
          exemple: { titre: "Mauritanie : le « train du désert »", url: "https://www.instagram.com/reel/DSM2egujY-F/" } },
        { titre: "Tournage et montage", cle: "tournage",
          texte: "Caméra ou smartphone selon le terrain, puis un montage pensé pour le format vertical et le visionnage sans le son.",
          exemple: { titre: "Les supporters après France-Espagne", url: "https://www.instagram.com/reel/DazpijzN3LA/" } }
      ],
      groupes: [
        { groupe: "Recherche et enquête", items: [{ nom: "OSINT", cle: "osint" }, { nom: "Images satellites (Copernicus, Airbus Pléiades)", cle: "satellite" }, { nom: "Vérification d'images et de documents", cle: "verif" }, { nom: "Collecte de données", cle: "donnees" }, { nom: "Recherche d'archives", cle: "archives" }] },
        { groupe: "Tournage", items: [{ nom: "Tournage", cle: "tournage" }, { nom: "Interview", cle: "interview" }, { nom: "Incarnation face caméra", cle: "incarnation" }, { nom: "Journalisme mobile", cle: "mojo" }, { nom: "Prise de son" }],
          materiel: ["Sony α7", "Panasonic GH5", "Kit Mojo", "Drone · brevet catégorie ouverte A1/A3"] },
        { groupe: "Montage et habillage", items: [{ nom: "Montage Premiere Pro", cle: "montage" }, { nom: "Motion design After Effects", cle: "motion" }, { nom: "Sous-titrage", cle: "soustitrage" }, { nom: "Photoshop", cle: "photoshop" }] },
        { groupe: "Écriture et publication", items: [{ nom: "Script vidéo", cle: "script" }, { nom: "Écriture web", cle: "ecriture" }, { nom: "Référencement SEO", cle: "seo" }, { nom: "Data visualisation (Flourish)", cle: "dataviz" }, { nom: "Cartographie", cle: "carto" }, { nom: "WordPress" }] }
      ]
    },
    langues: [
      { langue: "Anglais", niveau: "C1" },
      { langue: "Arabe classique", niveau: "B1" },
      { langue: "Arabe libanais", niveau: "A2" }
    ],
    engagement: [
      { structure: "Pangéa Lille", logo: "logos/pangea.jpg", lien: { libelle: "Voir Pangéa sur Instagram", url: "https://www.instagram.com/pangeaassociation/" }, role: "Présidente", debut: "2023-09", fin: "2026-09", description: "Association pour l'intégration des étudiants en exil.",
        missions: ["Gestion financière de l'association", "Création de cours de français", "Suivi administratif des dossiers des étudiants en exil", "Demandes de subventions auprès des collectivités, de la Région et des universités"] }
    ]
  }
};
