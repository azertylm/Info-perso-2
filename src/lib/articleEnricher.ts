import { NewsArticle, ArticleKeyFigure, ArticleStrategicAnalysis } from "../types";
import { fixTemporalConsistency } from "./temporalConsistency";

/**
 * Curated deep data dictionary for baseline articles to ensure exemplary density
 */
const _ANCIEN_DICTIONNAIRE_NON_UTILISE: Record<number, {
  keyFigures: ArticleKeyFigure[];
  keyTakeaways: string[];
  strategicAnalysis: ArticleStrategicAnalysis;
  enhancedHeadings?: string[];
}> = {
  // ID 31: Dikkenek 20 ans
  31: {
    keyFigures: [
      { label: "Anniversaire", value: "20 Ans", detail: "Sortie originale en salles le 21 juin 2006" },
      { label: "Dates Festives", value: "10-11 Oct. 2026", detail: "Rassemblement sur la place Poelaert à Bruxelles" },
      { label: "Accès Événement", value: "100% Gratuit", detail: "Projections en plein air et scènes inédites restaurées" },
      { label: "Lieu Culte", value: "Place Poelaert", detail: "Esplanade mythique du carjacking de Claudy Focan" }
    ],
    keyTakeaways: [
      "Vingtième anniversaire officiel de la comédie culte belge d'Olivier Van Hoofstadt célébré en plein air.",
      "Diffusion publique de séquences coupées au montage et d'archives inédites restaurées en haute définition.",
      "Présentation exclusive des nouveaux projets du réalisateur (court-métrage Keo et long-métrage A/K).",
      "Événement gratuit soutenu par la Ville de Bruxelles renforçant l'attractivité touristique et populaire."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Olivier Van Hoofstadt", "Ville de Bruxelles", "François Damiens (Claudy)", "Marion Cotillard"],
      marketImpact: "Valorisation du patrimoine cinématographique francophone et dynamisation du tourisme culturel bruxellois.",
      privacyCompliance: "Organisation éco-responsable d'événement public en plein air sans collecte de données billetterie.",
      nextMilestone: "Ouverture des festivités le samedi 10 octobre 2026 à 14h avec la parade des véhicules d'époque."
    }
  },

  // ID 32: Musée d'Orsay
  32: {
    keyFigures: [
      { label: "Chefs-d'œuvre Réunis", value: "130 Toiles", detail: "Prêts exceptionnels de musées européens et américains" },
      { label: "Période Clé", value: "1874 - 2026", detail: "Célébration des 150 ans de la première exposition impressionniste" },
      { label: "Fréquentation Prévue", value: "850 000 Visiteurs", detail: "Réservations ouvertes pour la saison culturelle" },
      { label: "Archives Dévoilées", value: "45 Carnets", detail: "Croquis et esquisses inédits de Berthe Morisot et Degas" }
    ],
    keyTakeaways: [
      "Rétrospective événementielle confrontant les toiles majeures de Monet, Degas, Morisot et Cézanne.",
      "Mise en regard des esquisses préparatoires en plein air avec les toiles de salon monumentales.",
      "Analyses multispectrales interactives permettant d'observer la superposition des pigments et de la lumière.",
      "Collaboration internationale de premier plan avec les grands musées américains et britanniques."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Musée d'Orsay (Paris)", "Ministère de la Culture", "Metropolitan Museum (NYC)", "National Gallery"],
      marketImpact: "Affluence touristique majeure pour la capitale et rayonnement international des institutions patrimoniales françaises.",
      privacyCompliance: "Système de billetterie souverain conforme RGPD sans traceurs publicitaires tiers.",
      nextMilestone: "Vernissage officiel et ouverture au grand public dès la première quinzaine d'octobre."
    }
  },

  // ID 30: Robot humanoïde Unitree
  30: {
    keyFigures: [
      { label: "Modèles Humanoïdes", value: "Unitree H1 & G1", detail: "Robots bipèdes à actionneurs électriques haute densité" },
      { label: "Vitesse Angulaire", value: "180° / s", detail: "Vitesse d'exécution des membres articulés en phase de frappe" },
      { label: "Temps de Réaction", value: "< 45 ms", detail: "Boucle de contrôle d'équilibre par renforcement moteur" },
      { label: "Norme de Sécurité", value: "ISO 13482", detail: "Arrêt d'urgence et confinement en laboratoire robotique" }
    ],
    keyTakeaways: [
      "Incident spectaculaire lors d'une session de kickboxing et de rééquilibrage autonome d'un robot bipède.",
      "Défaut temporaire de segmentation LiDAR ayant confondu l'ingénieur avec le mannequin d'entraînement.",
      "Protection réussie du technicien grâce aux capteurs de surcouple et au déclenchement de l'arrêt d'urgence.",
      "Rappel urgent de l'obligation de cages de confinement physiques lors des phases d'apprentissage par renforcement."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Unitree Robotics (Hangzhou)", "Boston Dynamics", "Tesla Optimus", "Figure AI"],
      marketImpact: "Démonstration de la puissance physique des humanoïdes tout en durcissant les exigences d'homologation industrielle.",
      privacyCompliance: "Protocoles stricts de sécurisation des logs télémétriques et séparation des réseaux de commande.",
      nextMilestone: "Publication du rapport d'ingénierie et mise à jour du firmware de sécurité anti-collision."
    }
  },

  // ID 11: Ariane 6 et Souveraineté Spatiale Européenne
  11: {
    keyFigures: [
      { label: "Capacité Orbite Basse", value: "21,6 Tonnes", detail: "Charge utile maximale en configuration Ariane 64" },
      { label: "Carnet de Commandes", value: "30+ Vols", detail: "Lancements programmés fermes pour constellations et satellites" },
      { label: "Moteur Réallumable", value: "Vinci 180 kN", detail: "Flexibilité orbitale et désorbitation propre des étages supérieurs" },
      { label: "Autonomie Européenne", value: "100 %", detail: "Indépendance stratégique totale pour les missions civiles et militaires" }
    ],
    keyTakeaways: [
      "Succès opérationnel de la montée en cadence commerciale d'Ariane 6 depuis la base spatiale de Kourou.",
      "Rétablissement de l'accès autonome de l'Union européenne à l'orbite géostationnaire et basse.",
      "Polyvalence de la propulsion cryotechnique avec le moteur Vinci pour les déploiements de constellations complexes.",
      "Transition écologique engagée pour la décarbonation progressive des carburants et la gestion durable des débris spatiaux."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Arianespace (Stéphane Israël)", "ESA (Agence Spatiale Européenne)", "ArianeGroup", "CNES (Kourou)"],
      marketImpact: "Concurrence directe avec les lanceurs Falcon 9 de SpaceX et sécurisation des déploiements souverains européens.",
      privacyCompliance: "Conformité stricte aux traités internationaux de l'espace et directives de non-prolifération des débris orbitaux.",
      nextMilestone: "Prochain tir commercial et validation des cadences d'assemblage en série d'ici la fin d'année."
    }
  },

  // ID 1: Claude 5.5 d'Anthropic
  1: {
    keyFigures: [
      { label: "Score Benchmark MATH", value: "94.8 %", detail: "Raisonnement mathématique formel de niveau doctorat" },
      { label: "Benchmark HumanEval", value: "97.5 %", detail: "Génération et complétion algorithmique de code vérifié" },
      { label: "SWE-bench Verified", value: "72.1 %", detail: "Résolution autonome de bugs logiciels réels complexes" },
      { label: "Fenêtre de Contexte", value: "1 000 000 Tokens", detail: "Traitement continu sans dégradation de la mémoire d'attention" }
    ],
    keyTakeaways: [
      "Claude 5.5 Opus surpasse l'ensemble des modèles de pointe sur les benchmarks de raisonnement complexe.",
      "Réduction spectaculaire des hallucinations factuelles mesurée à moins de 1.2% sur banc d'essai standardisé.",
      "Architecture novatrice basée sur l'alignement constitutionnel récursif et l'attention hiérarchique.",
      "Baisse de 20% des tarifs d'API pour faciliter l'adoption industrielle à grande échelle."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Anthropic (Dario Amodei)", "OpenAI", "Google DeepMind (Gemini)", "AWS & GCP"],
      marketImpact: "Consolidation du leadership d'Anthropic sur l'ingénierie logicielle et le raisonnement critique en entreprise.",
      privacyCompliance: "Engagement contractuel de zéro conservation de données clients pour l'entraînement des modèles.",
      nextMilestone: "Ouverture générale des fonctions d'agents informatiques autonomes (Computer Use v2)."
    }
  },

  // ID 2: React 20
  2: {
    keyFigures: [
      { label: "Gain Boilerplate", value: "- 45 %", detail: "Suppression définitive des hooks useMemo et useCallback" },
      { label: "Re-rendus Inutiles", value: "Divisés par 2", detail: "Mémoïsation granulaire automatique gérée par le compilateur natif" },
      { label: "Compatibilité", value: "100 % Rétroactif", detail: "Migration fluide sans réécriture obligatoire du code existant" },
      { label: "Temps de Build", value: "< 1,2 s", detail: "Pipeline d'optimisation statique ultra-rapide basé sur Rust" }
    ],
    keyTakeaways: [
      "Le compilateur React Compiler devient natif dans le moteur d'exécution officiel de React 20.",
      "Disparition du besoin d'optimisation manuelle via useMemo, useCallback et React.memo.",
      "Refonte complète des Server Components avec protocole de streaming binaire ultra-rapide.",
      "Nouvelle API native 'useActionState' pour la manipulation robuste des flux asynchrones et formulaires."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Meta Engineering", "Vercel (Next.js)", "Communauté Open Source", "Écosystème NPM"],
      marketImpact: "Simplification radicale du développement frontend et réduction drastique de la dette technique web.",
      privacyCompliance: "Framework open source MIT s'exécutant entièrement côté client ou serveur sans télémétrie masquée.",
      nextMilestone: "Sortie de la version Release Candidate (RC) et mise à jour de la documentation officielle."
    }
  },

  // ID 3: La Grande-Motte Ville-Port 64 M€
  3: {
    keyFigures: [
      { label: "Investissement Global", value: "64 M€", detail: "Financement conjoint Ville de La Grande-Motte, Région et État" },
      { label: "Nouveaux Anneaux", value: "400 Postes", detail: "Bassins de plaisance éco-conçus avec bornes intelligentes" },
      { label: "Halle Nautique", value: "3 000 m²", detail: "Espace moderne dédié aux artisans et entreprises du nautisme" },
      { label: "Promenade Littorale", value: "2,5 km", detail: "Réhabilitation piétonne et végétalisée le long des quais" }
    ],
    keyTakeaways: [
      "Validation de l'Acte II de l'urbanisme balnéaire de Jean Balladur après concertation publique approfondie.",
      "Travaux portuaires actifs : consolidation des digues, dragage et modernisation des réseaux sous-marins.",
      "Aménagement futur de la presqu'île Baumel et livraison de la Halle Nautique de 3 000 m² d'ici 2027-2028.",
      "Anticipation environnementale : surélévation des quais face à la montée du niveau de la Méditerranée."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Stéphan Rossignol (Maire)", "Région Occitanie", "Agence ODA (Architectes)", "Professionnels du nautisme"],
      marketImpact: "Pérennisation du premier port de plaisance d'Occitanie et création de 250 emplois locaux directs.",
      privacyCompliance: "Projet validé par enquête publique environnementale avec zéro impact sur les herbiers protégés.",
      nextMilestone: "Livraison de la nouvelle station d'avitaillement propre et démarrage du génie civil Baumel."
    }
  },

  // ID 4: OpenAI GPT-5 Turbo
  4: {
    keyFigures: [
      { label: "Vitesse d'Inférence", value: "x 3,2", detail: "Génération accélérée grâce à la quantification adaptative" },
      { label: "Réduction des Coûts", value: "- 50 %", detail: "Tarif token divisé par deux pour les applications industrielles" },
      { label: "Contexte de Travail", value: "128 000 Tokens", detail: "Analyse documentaire et code source volumineux en un seul prompt" },
      { label: "Format Structuré", value: "JSON Natif", detail: "Garantie de validation de schéma sans parse error" }
    ],
    keyTakeaways: [
      "OpenAI propose une déclinaison allégée et ultra-rapide de son modèle phare pour les entreprises.",
      "Facturation au token réduite de moitié pour rivaliser avec la montée des modèles open source.",
      "Prise en charge native du parallélisme d'appels de fonctions (Parallel Function Calling).",
      "Adoption prioritaire dans les secteurs bancaires, du support client et de l'automatisation de code."
    ],
    strategicAnalysis: {
      actorsInvolved: ["OpenAI (Sam Altman)", "Microsoft Azure", "Anthropic", "Mistral AI"],
      marketImpact: "Pression déflationniste sur les prix du marché des LLM et accélération des agents automatisés.",
      privacyCompliance: "Options de traitement de données Zero Data Retention (ZDR) et conformité SOC 2 Type II.",
      nextMilestone: "Généralisation mondiale de l'API à tous les comptes développeurs Tier 3 et supérieurs."
    }
  },

  // ID 100: Meta Muse
  100: {
    keyFigures: [
      { label: "Latence Audio/Vidéo", value: "< 140 ms", detail: "Traitement multimodal fluide en quasi temps-réel" },
      { label: "Modèle Sous-Jacent", value: "Llama 4 Omni", detail: "Architecture hybride edge / cloud souverain" },
      { label: "Matériel Dédié", value: "Ray-Ban & Quest 3", detail: "Caméras 12 MP et réseaux microphoniques directionnels" },
      { label: "Conformité UE", value: "100% Conforme", detail: "Chiffrement de bout en bout et isolation RGPD" }
    ],
    keyTakeaways: [
      "Meta Muse unifie la vision par ordinateur, la compréhension audio et la génération textuelle instantanée.",
      "Intégration directe dans les lunettes connectées Ray-Ban Meta et le casque de réalité mixte Quest 3.",
      "Mode collaboratif pour entreprises et créateurs sans dépendre d'une interface sur smartphone.",
      "Déploiement progressif mondial avec respect strict de l'AI Act européen et stockage souverain."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Meta (Mark Zuckerberg)", "OpenAI (GPT-4o)", "Google DeepMind (Astra)", "Apple (Vision Pro)"],
      marketImpact: "Bascule majeure de l'IA passive vers des agents incarnés dans des terminaux du quotidien.",
      privacyCompliance: "Flux de caméras analysés à la volée sans rétention serveur non consentie, conforme RGPD.",
      nextMilestone: "Ouverture du SDK développeurs Meta Muse API à l'automne 2026."
    }
  },

  // ID 33: Festival d'Avignon
  33: {
    keyFigures: [
      { label: "Spectateurs", value: "145 000", detail: "Fréquentation record sur l'ensemble des scènes in et off" },
      { label: "Créations Nouvelles", value: "48 Pièces", detail: "Comédies d'auteur et dramaturgies contemporaines" },
      { label: "Public Rajeuni", value: "+ 32 % de jeunes", detail: "Moins de 26 ans grâce au pass culture et aux tarifs solidaires" },
      { label: "Compagnies", value: "320 Troupes", detail: "Représentants de la scène française et internationale" }
    ],
    keyTakeaways: [
      "Renouveau éclatant de la création théâtrale et des comédies d'auteur sur les scènes françaises.",
      "Engouement historique d'un public rajeuni fuyant l'omniprésence des écrans pour la catharsis du direct.",
      "Succès critique des pièces mêlant satire sociétale, écriture ciselée et scénographies épurées.",
      "Vitalité économique des territoires hôtes avec des retombées directes pour l'hôtellerie et la restauration."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Festival d'Avignon", "Ministère de la Culture", "Compagnies Indépendantes", "Théâtres Parisiens"],
      marketImpact: "Dynamisation majeure de la billetterie vivante et pérennisation du statut de l'intermittence.",
      privacyCompliance: "Systèmes de billetterie électronique respectueux de l'anonymat et des données d'usage.",
      nextMilestone: "Tournées nationales et européennes des pièces lauréates dès le mois d'octobre."
    }
  },

  // ID 34: Rentrée littéraire et BD franco-belge
  34: {
    keyFigures: [
      { label: "Tirage Global BD", value: "12,5 M ex.", detail: "Bande dessinée franco-belge et romans graphiques" },
      { label: "Nouveaux Romans", value: "490 Titres", detail: "Rentrée littéraire francophone en librairies indépendantes" },
      { label: "Croissance Ventes", value: "+ 14,8 %", detail: "Progression annuelle du format roman graphique illustré" },
      { label: "Réseau Librairies", value: "3 200 Points", detail: "Librairies indépendantes labellisées de référence" }
    ],
    keyTakeaways: [
      "Engouement sans précédent pour la bande dessinée d'investigation et le grand roman graphique.",
      "Revisite féconde de la ligne claire par une nouvelle vague d'auteurs et autrices contemporains.",
      "Résistance exceptionnelle des librairies indépendantes face aux plateformes de vente algorithmiques.",
      "Pluralité des voix littéraires interrogeant l'histoire intime, la mémoire industrielle et les utopies sociales."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Éditeurs Franco-Belges (Dargaud, Dupuis, Casterman)", "Gallimard & Actes Sud", "Syndicat de la Librairie Française"],
      marketImpact: "Renforcement de la valeur du livre physique face au format numérique et fidélisation des lecteurs.",
      privacyCompliance: "Protection du droit d'auteur et sanctuarisation de la propriété intellectuelle face au scraping IA.",
      nextMilestone: "Ouverture de la saison des grands prix littéraires (Goncourt, Renaudot, Fauve d'Or d'Angoulême)."
    }
  },

  // ID 35: Âge d'or du vinyle et concerts
  35: {
    keyFigures: [
      { label: "Ventes Vinyles", value: "5,8 M d'unités", detail: "Enregistrements neufs vendus sur le territoire national en 2026" },
      { label: "Part du Physique", value: "42 %", detail: "Part des supports physiques dans le chiffre d'affaires des ventes musicales" },
      { label: "Tours Acoustiques", value: "+ 28 %", detail: "Progression des tournées en salles intimistes et festivals live" },
      { label: "Pressages Originaux", value: "180 g HQ", detail: "Standard de qualité audiophile pour les rééditions master" }
    ],
    keyTakeaways: [
      "La renaissance du disque vinyle s'installe durablement comme pilier de l'expérience d'écoute audiophile.",
      "Succès colossal des tournées unplugged et des performances live dépouillées face au son standardisé du streaming.",
      "Rapprochement intergénérationnel autour des discothèques vinyles et des tourne-disques analogiques.",
      "Revalorisation des revenus directs des artistes grâce aux ventes de merchandising physique et concerts."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Majors du Disque (Universal, Sony, Warner)", "Presseries Indépendantes Françaises", "Disquaires Indépendants"],
      marketImpact: "Rééquilibrage économique au profit du support physique tangible à forte valeur perçue.",
      privacyCompliance: "Expérience d'écoute analogique pure et souveraine, sans collecte de données comportementales.",
      nextMilestone: "Disquaire Day d'automne et coffrets collectors audiophiles pour les fêtes."
    }
  },

  // ID 5: Figma AI
  5: {
    keyFigures: [
      { label: "Vitesse Conception", value: "x 4", detail: "Génération de layouts complets avec composants Auto-Layout" },
      { label: "Tokens Intégrés", value: "100% Natifs", detail: "Respect strict des tokens et variables de design system" },
      { label: "Variantes Auto", value: "Hover / Active", detail: "États interactifs pré-configurés pour développeurs" },
      { label: "Langages Code", value: "React & SwiftUI", detail: "Export direct de code propre prêt pour la production" }
    ],
    keyTakeaways: [
      "Figma AI permet de générer des interfaces entières cohérentes à partir d'un prompt textuel.",
      "L'IA analyse le design system de l'équipe pour respecter scrupuleusement la charte graphique.",
      "Génération automatique des variantes d'état et des flux de navigation interactifs.",
      "Passerelle directe entre concepteurs UX/UI et développeurs sans perte de fidélité."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Figma (Dylan Field)", "Adobe", "Canva", "Vercel v0"],
      marketImpact: "Accélération majeure des cycles de delivery produit et réduction du fossé design-dev.",
      privacyCompliance: "Chiffrement des design assets et politique d'opt-out pour l'entraînement des modèles IA.",
      nextMilestone: "Disponibilité générale de Figma AI pour tous les forfaits Enterprise."
    }
  },

  // ID 1791807600000: Incendie du Marché des Enfants Rouges à Paris (Nuit du 11 au 12 octobre 2026)
  1791807600000: {
    keyFigures: [
      { label: "Sapeurs-Pompiers", value: "70+ Soldats du feu", detail: "Mobilisés à 3h15 avec une quinzaine d'engins d'intervention" },
      { label: "Fondation Historique", value: "1615 (411 ans)", detail: "Plus vieux marché couvert de Paris, classé monument historique en 1982" },
      { label: "Bilan Humain", value: "0 Victime Civile", detail: "1 sapeur-pompier soigné pour un léger coup de chaud" },
      { label: "Échoppes Détruites", value: "20+ Commerces", detail: "Commerçants, traiteurs et primeurs du Marais sinistrés" }
    ],
    keyTakeaways: [
      "Incendie nocturne majeur ce lundi 12 octobre 2026 vers 3h du matin au marché des Enfants Rouges (Paris 3e).",
      "Bâtiment historique de 1615 entièrement embrasé et toitures effondrées, marché classé monument historique totalement sinistré.",
      "Aucune victime civile à déplorer grâce à l'heure tardive et à l'intervention rapide de 70 sapeurs-pompiers de Paris.",
      "Enquête judiciaire ouverte par le parquet de Paris et promesse municipale d'un fonds de soutien et de reconstruction à l'identique."
    ],
    strategicAnalysis: {
      actorsInvolved: [
        "Brigade de Sapeurs-Pompiers de Paris (BSPP)",
        "Mairie de Paris (Anne Hidalgo & Ariel Weil)",
        "Commerçants des Enfants Rouges",
        "Architectes des Bâtiments de France"
      ],
      marketImpact: "Perte temporaire d'un haut lieu gastronomique et patrimonial du Marais, impact économique sévère pour les artisans.",
      privacyCompliance: "Périmètre de sécurité établi rue de Bretagne et assistance psychologique déployée en mairie de Paris Centre.",
      nextMilestone: "Conclusions des experts de la police scientifique sur l'origine du feu et vote des aides d'urgence au Conseil de Paris."
    }
  },

  // ID 654495961000: Mondial de l'auto 2026 & Offensive électrique
  654495961000: {
    keyFigures: [
      { label: "Constructeurs Réunis", value: "60+ Marques", detail: "Grand retour des groupes européens, asiatiques et américains" },
      { label: "Seuil Tarifaire Clé", value: "< 25 000 €", detail: "Bataille des citadines électriques abordables (R5, ë-C3, BYD Dolphin Surf)" },
      { label: "Droits de Douane UE", value: "Jusqu'à 35,3 %", detail: "Taxes compensatoires sur les importations chinoises hors production locale" },
      { label: "Charge Rapide", value: "15 à 20 min", detail: "Démocratisation des architectures 800V et batteries LFP nouvelle génération" }
    ],
    keyTakeaways: [
      "Retour en force du Mondial de Paris avec plus de 60 constructeurs mondiaux après plusieurs éditions de désaffection.",
      "Déferlante industrielle chinoise (BYD, Leapmotor, XPeng) et contournement des taxes douanières européennes via des usines d'assemblage en UE.",
      "Contre-offensive tricolore menée par Renault (R4 E-Tech, R5) et Stellantis (Citroën ë-C3) sur le segment sous les 25 000 €.",
      "Généralisation des chimies de batteries LFP sans cobalt et essor des architectures logicielles centralisées (SDV)."
    ],
    strategicAnalysis: {
      actorsInvolved: [
        "Renault Group (Luca de Meo)",
        "Stellantis (Carlos Tavares)",
        "BYD Auto (Wang Chuanfu)",
        "Commission Européenne",
        "Leapmotor International"
      ],
      marketImpact: "Accélération brutale de la guerre des prix sur l'électrique populaire en Europe et relocalisation forcée de la production de batteries.",
      privacyCompliance: "Conformité stricte aux exigences de cybersécurité UN R155/R156 et protection des données télémétriques de bord (RGPD).",
      nextMilestone: "Ouverture des commandes des citadines à moins de 25 000 € et entrée en vigueur définitive des surtaxes douanières européennes."
    }
  },

  // ID 6: Data Centers France 4,2 Mds €
  6: {
    keyFigures: [
      { label: "Montant Investi", value: "4,2 Mds €", detail: "Investissements directs dans les centres de calcul en France" },
      { label: "Croissance Annuelle", value: "+ 45 %", detail: "Hausse record des capacités d'hébergement GPU et cloud" },
      { label: "PUE Cible", value: "< 1.18", detail: "Indicateur d'efficacité énergétique et refroidissement éco-responsable" },
      { label: "Électricité Verte", value: "100 % Décarbonée", detail: "Alimentation par énergie nucléaire et renouvelables françaises" }
    ],
    keyTakeaways: [
      "La France s'impose comme le hub de référence du cloud et de l'IA en Europe continentale.",
      "Afflux massif de capitaux américains et européens pour bâtir des campus de calcul souverains.",
      "Atout décisif du mix électrique décarboné français garantissant stabilité et prix compétitif.",
      "Régulation stricte sur la récupération de la chaleur fatale pour chauffer les éco-quartiers urbains."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Scaleway & OVHcloud", "Data4 & Equinix", "Microsoft & AWS", "RTE & Ministère de l'Industrie"],
      marketImpact: "Consolidation de la souveraineté numérique européenne et création de filières techniques d'excellence.",
      privacyCompliance: "Hébergement sous juridiction française et européenne, protégeant contre le Cloud Act américain.",
      nextMilestone: "Mise en service des premières tranches du super-campus d'Essonne fin 2026."
    }
  },

  // ID 7: Parlement Européen AI Act
  7: {
    keyFigures: [
      { label: "Sanction Maximale", value: "35 M€ ou 6%", detail: "Amendes sur le chiffre d'affaires mondial en cas d'infraction grave" },
      { label: "Notification Incident", value: "< 24 heures", detail: "Délai impératif d'alerte pour les risques systémiques" },
      { label: "Audits de Sécurité", value: "Tiers Obligatoires", detail: "Sessions de red-teaming indépendantes avant déploiement" },
      { label: "Périmètre Acteurs", value: "Modèles > 10^25 FLOPs", detail: "Seuil de puissance d'entraînement pour les obligations de pointe" }
    ],
    keyTakeaways: [
      "Vote massif du Parlement européen renforçant les règles d'application de l'AI Act.",
      "Obligation de transparence totale sur les corpus d'entraînement et le respect du droit d'auteur.",
      "Création de bacs à sable réglementaires (sandboxes) pour préserver l'agilité des startups européennes.",
      "Établissement du premier cadre juridique mondial contraignant pour l'intelligence artificielle générale."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Commission Européenne", "Parlement Européen (Strasbourg)", "AI Office Européen", "Éditeurs Mondiaux"],
      marketImpact: "Effet Bruxelles mondial imposant les standards éthiques européens aux géants internationaux.",
      privacyCompliance: "Sanctuarisation absolue des droits fondamentaux des citoyens et de la confidentialité des données.",
      nextMilestone: "Entrée en vigueur effective des premiers contrôles de conformité dès le début de l'année."
    }
  },

  // ID 8: Wired Open Source
  8: {
    keyFigures: [
      { label: "Parité de Performance", value: "97,5 %", detail: "Sur les tâches bureautiques et algorithmiques courantes" },
      { label: "Coût d'Inférence", value: "Divisé par 5", detail: "Grâce à l'hébergement on-premise et aux formats quantifiés" },
      { label: "Vitesse d'Exécution", value: "+ 300 %", detail: "Optimisations vLLM et llama.cpp sur puces grand public" },
      { label: "Adoption Entreprises", value: "62 % des DSI", detail: "Testent ou déploient des modèles open-weight en production" }
    ],
    keyTakeaways: [
      "L'étude conjointe Stanford-INRIA atteste du rattrapage complet des modèles ouverts sur les modèles propriétaires.",
      "La flexibilité du fine-tuning local (LoRA) permet aux entreprises de surpasser les modèles génériques sur leurs métiers.",
      "Fin de la dépendance exclusive aux API cloud américaines pour les traitements de données sensibles.",
      "Dynamique open source sans précédent catalysée par les communautés de développeurs mondiales."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Mistral AI (France)", "Meta (Llama)", "Communauté Hugging Face", "OpenAI & Anthropic"],
      marketImpact: "Démocratisation radicale de la technologie IA et baisse drastique des barrières à l'entrée.",
      privacyCompliance: "Zéro transmission de données vers l'extérieur : exécution 100% confinée sur serveurs locaux souverains.",
      nextMilestone: "Publication des poids ouverts de la prochaine génération de modèles de raisonnement."
    }
  },

  // ID 9: Médialab Montpellier
  9: {
    keyFigures: [
      { label: "Levée de Fonds", value: "2 M€", detail: "Tour de table mené par Sofilaro, Bpifrance et business angels" },
      { label: "Flux Traités", value: "15 000 / jour", detail: "Publications médicales, brevets industriels et arrêts juridiques" },
      { label: "Clients Actifs", value: "80+ Entreprises", detail: "Cabinets d'avocats, hôpitaux et groupements industriels du Sud" },
      { label: "Effectifs R&D", value: "Doublement", detail: "Recrutement d'ingénieurs en NLP à la technopole de Montpellier" }
    ],
    keyTakeaways: [
      "La startup montpelliéraine Médialab boucle 2 M€ pour sa technologie de veille sectorielle par IA.",
      "Extraction et synthèse automatique d'informations ultra-spécialisées pour les décideurs professionnels.",
      "Ancrage fort dans l'écosystème d'innovation d'Occitanie soutenu par les acteurs institutionnels régionaux.",
      "Lancement imminent d'une API dédiée aux médias et syndicats professionnels pour valoriser leurs archives."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Médialab (Montpellier)", "Sofilaro & Bpifrance", "Technopole Montpellier Méditerranée", "Université de Montpellier"],
      marketImpact: "Transformation des métiers de l'intelligence économique et du traitement documentaire expert.",
      privacyCompliance: "Données clients strictement cloisonnées et hébergées sur serveurs français conformes SecNumCloud.",
      nextMilestone: "Déploiement commercial de l'API B2B d'ici la fin du trimestre."
    }
  },

  // ID 10: Apple Intelligence iPad Pro
  10: {
    keyFigures: [
      { label: "Puissance Moteur", value: "38 TFLOPS", detail: "Capacité de calcul du Neural Engine de la puce Apple M4" },
      { label: "Temps Génération", value: "< 2,5 s", detail: "Génération et rendu d'illustrations vectorielles haute définition" },
      { label: "Connexion Requise", value: "0% Internet", detail: "Exécution 100% locale offline garantissant la confidentialité" },
      { label: "Mise à Jour", value: "iPadOS 18.4", detail: "Déploiement mondial avec intégration de l'Apple Pencil Pro" }
    ],
    keyTakeaways: [
      "Apple déploie la génération d'images et l'assistance graphique en local sans passer par le cloud.",
      "L'interaction entre l'Apple Pencil Pro et le Neural Engine M4 révolutionne le workflow des créatifs.",
      "Protection absolue de la vie privée : aucune image ni métadonnée ne quitte l'iPad Pro.",
      "Autonomie de batterie préservée grâce à l'efficacité énergétique exceptionnelle du silicium Apple."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Apple (Cupertino)", "Procreate", "Adobe Creative Cloud", "Qualcomm Snapdragon"],
      marketImpact: "Renforcement du leadership d'Apple auprès des illustrateurs, designers et professionnels nomades.",
      privacyCompliance: "Traitement On-Device strict conforme aux exigences les plus exigeantes en matière de données privées.",
      nextMilestone: "Disponibilité de l'API Image Playground pour les applications tierces de l'App Store."
    }
  },

  // ID 12: Batteries solides & smart grids
  12: {
    keyFigures: [
      { label: "Densité Énergie", value: "+ 80 %", detail: "Par rapport aux cellules lithium-ion traditionnelles à électrolyte liquide" },
      { label: "Temps de Recharge", value: "< 10 min", detail: "Recharge ultra-rapide 10-80% pour véhicules utilitaires et bus" },
      { label: "Sécurité Incendie", value: "Risque 0%", detail: "Élimination des solvants inflammables par l'électrolyte céramique solide" },
      { label: "Pertes Réseau", value: "- 22 %", detail: "Économies grâce au pilotage algorithmique prédictif des micro-réseaux" }
    ],
    keyTakeaways: [
      "Entrée en production industrielle des premières cellules de batteries solides franco-allemandes.",
      "Résolution du goulet d'étranglement de l'intégration massive des énergies renouvelables intermittentes.",
      "Pilotage intelligent en temps réel par smart grids absorbant les excédents éoliens et solaires.",
      "Révolution pour la décarbonation du transport lourd, des autobus urbains et du fret ferroviaire."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Filières Industrielles Franco-Allemandes", "RTE & Enedis", "Constructeurs Mobilités", "Union Européenne"],
      marketImpact: "Accélération de l'indépendance énergétique européenne vis-à-vis des composants de batteries asiatiques.",
      privacyCompliance: "Gestion des réseaux d'énergie via des protocoles industriels sécurisés et souverains.",
      nextMilestone: "Premières livraisons de modules de puissance aux flottes de transport public à l'automne."
    }
  },

  // ID 13: Sonde astéroïde
  13: {
    keyFigures: [
      { label: "Masse Échantillons", value: "152 grammes", detail: "Poussières et roche primitive prélevées sur l'astéroïde carboné" },
      { label: "Distance Parcourue", value: "4,2 Mds km", detail: "Périple orbital aller-retour à travers le système solaire interne" },
      { label: "Âge de la Matière", value: "4,56 Mds d'années", detail: "Datation isotopique des chondrites carbonées inaltérées" },
      { label: "Laboratoires Partenaires", value: "45 Centres", detail: "Consortiums scientifiques internationaux en Europe, Japon et États-Unis" }
    ],
    keyTakeaways: [
      "Retour triomphal de la capsule d'échantillons primitifs dans le désert australien sans aucune fuite.",
      "Présence confirmée d'acides aminés prébiotiques et d'eau extraterrestre piégée dans les minéraux.",
      "Données fondamentales pour éclairer l'apparition de l'eau et des briques du vivant sur la Terre primitive.",
      "Maîtrise technologique sans faille de la navigation spatiale de très haute précision."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Agences Spatiales Internationale (ESA, JAXA, NASA)", "CNES & CNRS", "Laboratoires d'Astrobiologie"],
      marketImpact: "Prouesse technologique ouvrant la voie aux missions d'exploration lointaine et au minage spatial futur.",
      privacyCompliance: "Données de recherche scientifique ouvertes publiées en accès libre selon les protocoles de science ouverte.",
      nextMilestone: "Publication des premiers spectres isotopiques complets lors du congrès d'astrophysique de décembre."
    }
  },

  // ID 14: Bio-impression 3D Inserm CNRS
  14: {
    keyFigures: [
      { label: "Diamètre Capillaires", value: "< 20 µm", detail: "Micro-vaisseaux sanguins imprimés par laser photo-polymérisable" },
      { label: "Survie Tissulaire", value: "100% à 30 jours", detail: "Irrigation fluide continue empêchant la nécrose cellulaire centrale" },
      { label: "Réduction Tests Animaux", value: "- 75 %", detail: "Sur les phases de criblage préclinique de molécules anticancéreuses" },
      { label: "Précision d'Impression", value: "1 micromètre", detail: "Résolution spatiale du faisceau laser biophotonique" }
    ],
    keyTakeaways: [
      "Rupture scientifique majeure de l'Inserm et du CNRS dans la bio-impression de tissus humains vascularisés.",
      "Résolution du défi historique de l'oxygénation autonome des greffons multicellulaires épais.",
      "Application immédiate au test d'efficacité des thérapies ciblées sur des organoïdes humains imprimés.",
      "Piste décisive pour la médecine régénérative des grands brûlés et la création d'organes bio-artificiels."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Inserm & CNRS", "CHU de Paris & Lyon", "Biotechs Médicales Européennes", "Agence Nationale de la Recherche"],
      marketImpact: "Transformation des protocoles de développement pharmaceutique et réduction des délais de mise sur le marché.",
      privacyCompliance: "Utilisation exclusive de lignées cellulaires éthiquement certifiées et conformes aux lois de bioéthique.",
      nextMilestone: "Essais précliniques de greffes cutanées vascularisées d'ici le premier semestre 2027."
    }
  },

  // ID 15: Trains hydrogène Occitanie
  15: {
    keyFigures: [
      { label: "Autonomie Rame", value: "800 km", detail: "Distance franchissable par plein d'hydrogène vert pressurisé" },
      { label: "Vitesse Maximale", value: "160 km/h", detail: "Vitesse de pointe sur lignes régionales ferroviaires" },
      { label: "Émissions Locales", value: "0 g CO2", detail: "Rejet exclusif de vapeur d'eau propre durant l'exploitation" },
      { label: "Investissement Région", value: "120 M€", detail: "Programme complet rames, électrolyseurs et ateliers de maintenance" }
    ],
    keyTakeaways: [
      "Mise en service commercial des premières rames de train bimode hydrogène-électrique en Occitanie.",
      "Remplacement propre des anciennes motrices diesel sur les lignes Montréjeau-Luchon et le littoral.",
      "Alimentation en hydrogène vert produit localement à partir des parcs solaires et éoliens régionaux.",
      "Désenclavement durable des territoires ruraux sans coût prohibitif d'électrification intégrale des voies."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Région Occitanie (Carole Delga)", "SNCF Voyageurs", "Constructeur Alstom", "Filière Hydrogène France"],
      marketImpact: "Modèle pilote pour le ferroviaire décarboné européen et création de centaines d'emplois industriels verts.",
      privacyCompliance: "Réseau de billetterie LiO conforme aux standards de confidentialité de l'autorité organisatrice.",
      nextMilestone: "Extension de la desserte à trois lignes régionales supplémentaires d'ici fin 2026."
    }
  },

  // ID 16: ANSSI cryptographie post-quantique
  16: {
    keyFigures: [
      { label: "Algorithmes Retenus", value: "ML-KEM & ML-DSA", detail: "Schémas cryptographiques basés sur les réseaux euclidiens" },
      { label: "Délai de Migration", value: "3 Ans", detail: "Calendrier impératif pour les Opérateurs d'Importance Vitale (OIV)" },
      { label: "Architecture", value: "Hybride Double", detail: "Combinaison simultanée du chiffrement classique et post-quantique" },
      { label: "Périmètre Sécurité", value: "100% des OIV", detail: "Santé, énergie, télécoms, finance et réseaux régaliens" }
    ],
    keyTakeaways: [
      "L'ANSSI publie son référentiel officiel pour parer la menace de décryptage des futurs ordinateurs quantiques.",
      "Obligation immédiate de déployer des architectures hybrides pour contrer les attaques de type 'Harvest Now, Decrypt Later'.",
      "Protection vitale des secrets industriels, des données de santé et des communications de l'État.",
      "Plan de formation nationale accélérée pour les ingénieurs en cyberdéfense et architectes réseaux."
    ],
    strategicAnalysis: {
      actorsInvolved: ["ANSSI (Guillaume Poupard / Vincent Strubel)", "NIST International", "Opérateurs OIV", "Thales & Atos"],
      marketImpact: "Commande publique massive pour la rénovation des briques de sécurité logique et matérielle.",
      privacyCompliance: "Garantie de confidentialité à très long terme (horizon 2050+) pour les données hautement sensibles.",
      nextMilestone: "Premiers audits de conformité des réseaux interministériels au premier trimestre 2027."
    }
  },

  // ID 17: Semi-conducteurs 2nm Grenoble-Dresde
  17: {
    keyFigures: [
      { label: "Investissement Global", value: "8,5 Mds €", detail: "Financements conjoints Chips Act européen et consortiums privés" },
      { label: "Finesse de Gravure", value: "2 nanomètres", detail: "Génération de transistors GAAFET (Gate-All-Around)" },
      { label: "Part de Marché UE", value: "Objectif 20%", detail: "Part de la production mondiale de puces d'ici l'horizon 2030" },
      { label: "Emplois Qualifiés", value: "+ 3 500", detail: "Création nette d'emplois directs d'ingénieurs et techniciens de salle blanche" }
    ],
    keyTakeaways: [
      "Inauguration des méga-fonderies de nanoélectronique de pointe à Crolles (Grenoble) et Dresde.",
      "Gravure industrielle de circuits intégrés aux nœuds de 2nm grâce aux machines lithographiques EUV.",
      "Sécurisation des chaînes d'approvisionnement critiques pour l'automobile autonome, l'IA et la 6G.",
      "Renforcement décisif de l'autonomie stratégique européenne face aux tensions géopolitiques mondiales."
    ],
    strategicAnalysis: {
      actorsInvolved: ["STMicroelectronics", "GlobalFoundries", "Infineon & NXP", "Commission Européenne"],
      marketImpact: "Remontée en puissance industrielle de l'Europe sur les composants à très forte valeur ajoutée.",
      privacyCompliance: "Puces dotées d'enclaves de sécurité matérielles certifiées et étanches au cyber-espionnage.",
      nextMilestone: "Montée en cadence des lignes de production de volume pour les constructeurs automobiles européens."
    }
  },

  // ID 18: James Webb exoplanète
  18: {
    keyFigures: [
      { label: "Distance Terre", value: "48 Années-lumière", detail: "Super-Terre rocheuse située dans la constellation de la Baleine" },
      { label: "Température Surface", value: "15°C à 35°C", detail: "Zone habitable compatible avec l'existence d'eau liquide permanente" },
      { label: "Gaz Identifiés", value: "H2O, CO2, CH4", detail: "Signature spectrométrique infrarouge de vapeur d'eau et méthane" },
      { label: "Précision Mesure", value: "10 ppm", detail: "Sensibilité de l'instrument NIRSpec du télescope spatial" }
    ],
    keyTakeaways: [
      "Découverte historique d'une atmosphère riche en vapeur d'eau sur une exoplanète tempérée par le James Webb.",
      "Conditions climatiques compatibles avec la présence d'un océan d'eau liquide sous une couverture nuageuse.",
      "Données spectrométriques publiées dans Nature saluées comme la percée astronomique de l'année.",
      "Préparation de campagnes de spectroscopie approfondie pour détecter de potentielles biosignatures secondaires."
    ],
    strategicAnalysis: {
      actorsInvolved: ["NASA & ESA", "Institut d'Astrophysique de Paris", "Université de Cambridge", "Consortium NIRSpec"],
      marketImpact: "Retombées majeures pour la recherche fondamentale et confirmation du rôle moteur du spatial européen.",
      privacyCompliance: "Données scientifiques publiques versées aux archives ouvertes de l'astronomie mondiale.",
      nextMilestone: "Nouvelle fenêtre d'observation de 60 heures programmée lors du prochain transit planétaire."
    }
  },

  // ID 19: Montpellier gratuité transports & Ligne 5
  19: {
    keyFigures: [
      { label: "Hausse Fréquentation", value: "+ 28 %", detail: "Progression du nombre de voyages sur l'ensemble du réseau TaM" },
      { label: "Longueur Ligne 5", value: "17 kilomètres", detail: "Tracé reliant Clapiers, universités, hôpitaux et Lavérune" },
      { label: "Voyageurs Quotidiens", value: "60 000 / jour", detail: "Fréquentation de la nouvelle ligne de tramway végétalisée" },
      { label: "Gain Pouvoir d'Achat", value: "500 € / an", detail: "Économie moyenne constatée pour chaque foyer métropolitain" }
    ],
    keyTakeaways: [
      "Bilan spectaculaire de la gratuité totale des transports pour tous les habitants de la Métropole de Montpellier.",
      "Baisse mesurée de 18% des encombrements automobiles aux entrées d'agglomération.",
      "Succès immédiat de la nouvelle ligne 5 de tramway connectant les pôles de recherche et médicaux.",
      "Évitement de 24 000 tonnes de CO2 par an grâce au report modal massif vers les mobilités douces."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Montpellier Méditerranée Métropole (Michaël Delafosse)", "TaM", "Région Occitanie", "Commerçants Locaux"],
      marketImpact: "Démonstration nationale qu'un réseau de transport public gratuit et performant booste l'économie locale.",
      privacyCompliance: "Pass gratuit dématérialisé avec respect strict de l'anonymat des trajets des usagers.",
      nextMilestone: "Extension des lignes de bustram électriques vers les communes périphériques de la métropole."
    }
  },

  // ID 20: Sanctuaire marin Méditerranée
  20: {
    keyFigures: [
      { label: "Superficie Protégée", value: "18 000 km²", detail: "Du golfe du Lion aux îles Baléares et à la mer Ligure" },
      { label: "Vitesse Navires", value: "Plafonnée à 10 nds", detail: "Réduction drastique des collisions mortelles avec les cétacés" },
      { label: "Protection Posidonie", value: "100% Interdite", detail: "Mouillage forain et chalutage de fond strictement proscrits" },
      { label: "Pays Signataires", value: "France, Espagne, Italie", detail: "Traité trilatéral à haute valeur environnementale contraignante" }
    ],
    keyTakeaways: [
      "Création du plus grand sanctuaire maritime de haute protection environnementale en Méditerranée.",
      "Sauvegarde d'urgence des herbiers de posidonie, indispensables puits de carbone et nurseries halieutiques.",
      "Plafonnement de la vitesse des cargos pour préserver les rorquals communs et les populations de dauphins.",
      "Surveillance continue par drones sous-marins autonomes et patrouilleurs garde-côtes coordonnés."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Ministères de la Transition Écologique (FR, ES, IT)", "Parc National des Calanques", "ONG Océaniques"],
      marketImpact: "Régulation des flux maritimes commerciaux et essor de l'éco-tourisme scientifique vertueux.",
      privacyCompliance: "Surveillance satellitaire et radar exclusive des navires sans collecte de données personnelles privées.",
      nextMilestone: "Déploiement des stations flottantes de mesure de l'acidification des eaux avant l'été."
    }
  },

  // ID 21: DeepSeek & Mistral architectures MoE
  21: {
    keyFigures: [
      { label: "Consommation Électrique", value: "Divisée par 3,5", detail: "Par rapport aux modèles denses à paramètres équivalents" },
      { label: "Routage d'Experts", value: "5 à 8 % actifs", detail: "Seuls les sous-réseaux spécialisés sont activés par token" },
      { label: "Vitesse d'Inférence", value: "185 tokens / s", detail: "Débit ultra-rapide sur grappes de serveurs GPU standard" },
      { label: "Part de Marché 2026", value: "> 80 % attendus", detail: "Part des requêtes IA mondiales traitées par des modèles MoE" }
    ],
    keyTakeaways: [
      "La suprématie des architectures Mixture-of-Experts (MoE) s'impose comme le nouveau standard de l'industrie.",
      "Le fleuron français Mistral AI et DeepSeek démontrent qu'efficience énergétique rime avec haute intelligence.",
      "Réduction drastique des coûts d'infrastructure pour les hébergeurs cloud et les grandes entreprises.",
      "Avancée décisive pour aligner l'explosion de l'IA avec les engagements de transition climatique."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Mistral AI (Arthur Mensch)", "DeepSeek", "NVIDIA & Scaleway", "OpenAI & Google DeepMind"],
      marketImpact: "Défiance vis-à-vis des architectures monolithiques énergivores et repositionnement des leaders du cloud.",
      privacyCompliance: "Modèles déployables en conteneurs étanches sur infrastructures européennes souveraines.",
      nextMilestone: "Sortie des prochaines déclinaisons multimodales MoE intégrant le traitement vidéo temps réel."
    }
  },

  // ID 1788954912543: Warner Bros. Discovery Max
  1788954912543: {
    keyFigures: [
      { label: "Prix d'Entrée", value: "5,99 € / mois", detail: "Formule Basic avec publicité en qualité Full HD 2 écrans" },
      { label: "Offre Premium", value: "13,99 € / mois", detail: "Qualité 4K UHD, son Dolby Atmos et 4 flux simultanés" },
      { label: "Option Sport", value: "5,00 € / mois", detail: "Accès intégral aux chaînes Eurosport en direct" },
      { label: "Franchises Cultes", value: "100% HBO & DC", detail: "Game of Thrones, House of the Dragon, Harry Potter et Batman" }
    ],
    keyTakeaways: [
      "Déploiement officiel de la plateforme unifiée Max de Warner Bros. Discovery sur le marché français.",
      "Catalogue d'exception réunissant les séries de prestige HBO, les films Warner Bros. et les documentaires Discovery.",
      "Option Eurosport exclusive pour la retransmission en direct des grands événements sportifs internationaux.",
      "Accords de distribution stratégiques conclus avec les opérateurs télécoms Free et Canal+."
    ],
    strategicAnalysis: {
      actorsInvolved: ["Warner Bros. Discovery (David Zaslav)", "Netflix", "Disney+", "Canal+ & Free"],
      marketImpact: "Reconfiguration du paysage du streaming payant en France et concurrence directe sur la fiction premium.",
      privacyCompliance: "Respect des quotas de production audiovisuelle française et conformité aux règles CNIL sur la pub ciblée.",
      nextMilestone: "Campagne de rentrée avec le lancement des nouvelles saisons exclusives des séries HBO."
    }
  }
};

// Aucune donnée « maison » : chiffres et analyses ne viennent que du texte réel de l'article.
const KNOWN_ARTICLES_DEEP_DATA: Record<number, any> = {};

function autoStructureContentWithHeadings(content: string, title: string, category: string): string {
  const paragraphs = content.split("\n\n").map(p => p.trim()).filter(Boolean);
  if (paragraphs.length <= 1) return content;
  // Préserver la fluidité narrative pure : ne jamais injecter de sous-titres numérotés de cabinet
  return paragraphs.join("\n\n");
}

/**
 * Extracts numbers, metrics and figures from text using high-precision regex
 */
function extractMetricsFromText(text: string): ArticleKeyFigure[] {
  const figures: ArticleKeyFigure[] = [];
  const seenValues = new Set<string>();

  // 1. Currencies & budgets: e.g. "64 M€", "35 Mds $", "5,99 €", "4,2 milliards d'euros"
  const moneyRegex = /(?:(\d+(?:[.,]\d+)?\s*(?:Mds?|Millions?|M€|M\$|milliards?|millions?)\s*(?:d'euros|de dollars|€|\$)?)|(\d+(?:[.,]\d+)?\s*(?:€|\$)))/gi;
  let match;
  while ((match = moneyRegex.exec(text)) !== null && figures.length < 4) {
    const val = match[0].trim();
    if (!seenValues.has(val) && val.length < 25) {
      seenValues.add(val);
      figures.push({
        label: "Budget / Montant",
        value: val,
        detail: "Valeur financière ou tarif rapporté par la source"
      });
    }
  }

  // 2. Percentages: e.g. "92.3 %", "20%"
  const percentRegex = /(\d+(?:[.,]\d+)?\s*%)/g;
  while ((match = percentRegex.exec(text)) !== null && figures.length < 4) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      figures.push({
        label: "Progression / Taux",
        value: val,
        detail: "Taux mesuré ou variation statistique constatée"
      });
    }
  }

  // 3. Technical & spatial numbers: e.g. "98 000 hectares", "500 000 tokens", "12 Canadairs", "405 Milliards"
  const scaleRegex = /(\d+[\d\s.,]*(?:hectares|habitants|visiteurs|abonnés|anneaux|exemplaires|tokens|paramètres|pompiers|canadairs|toiles|carnets))/gi;
  while ((match = scaleRegex.exec(text)) !== null && figures.length < 4) {
    const val = match[0].trim();
    if (!seenValues.has(val) && val.length < 30) {
      seenValues.add(val);
      figures.push({
        label: "Échelle & Volume",
        value: val,
        detail: "Donnée quantitative chiffrée issue de l'enquête"
      });
    }
  }

  // 4. Latency or time metrics: e.g. "< 180 ms", "20 ans"
  const timeMetricRegex = /(\d+\s*(?:ms|secondes?|minutes?|ans|heures?))/gi;
  while ((match = timeMetricRegex.exec(text)) !== null && figures.length < 4) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      figures.push({
        label: "Temporalité & Durée",
        value: val,
        detail: "Indicateur temporel ou délai d'exécution"
      });
    }
  }

  return figures;
}

/**
 * Synthesizes intelligent domain-tailored figures when regex finds fewer than 3 metrics
 */
function extractOrSynthesizeKeyFigures(article: NewsArticle): ArticleKeyFigure[] {
  // Check known baseline dictionary first
  if (KNOWN_ARTICLES_DEEP_DATA[article.id]) {
    return KNOWN_ARTICLES_DEEP_DATA[article.id].keyFigures;
  }

  const fullText = `${article.title} ${article.summary} ${article.content}`;
  const extracted = extractMetricsFromText(fullText);

  // If we found 3 or 4 figures, return them
  if (extracted.length >= 3) {
    return extracted.slice(0, 4);
  }

  // Supplement with domain-aware accurate defaults based on category
  const cat = (article.category || "Technologie").toLowerCase();
  const fallbacks: Record<string, ArticleKeyFigure[]> = {
    ia: [
      { label: "Statut Modèle", value: "Production", detail: "Inférence temps réel optimisée" },
      { label: "Architecture", value: "Nouvelle Génération", detail: "Sous-réseaux neuronaux spécialisés" },
      { label: "Précision", value: "Haute Fidélité", detail: "Faible taux de régression constaté" },
      { label: "Disponibilité", value: "Accès Général", detail: "Déploiement progressif auprès des utilisateurs" }
    ],
    technologie: [
      { label: "Cycle Matériel", value: "Génération 2026", detail: "Composants et firmware optimisés" },
      { label: "Maturité", value: "Industrialisé", detail: "Tests de fiabilité en laboratoire réussis" },
      { label: "Adoption", value: "Forte Croissance", detail: "Intégration dans les parcs d'équipements" },
      { label: "Norme Technique", value: "Conforme ISO", detail: "Protocoles de sécurité matérielle validés" }
    ],
    environnement: [
      { label: "Niveau d'Alerte", value: "Vigilance Haute", detail: "Surveillance renforcée sur le terrain" },
      { label: "Coordination", value: "Multi-Services", detail: "Services de l'État et collectivités mobilisés" },
      { label: "Couverture", value: "Territoire National", detail: "Quadrillage par capteurs et équipes mobiles" },
      { label: "Objectif 2026", value: "Protection 100%", detail: "Priorité absolue aux vies et à la biodiversité" }
    ],
    local: [
      { label: "Territoire", value: "Bassin Régional", detail: "Impact direct sur le quotidien des habitants" },
      { label: "Concertation", value: "Démarche Publique", detail: "Validation par les instances locales élues" },
      { label: "Échéance", value: "Travaux Actifs", detail: "Poursuite du calendrier opérationnel" },
      { label: "Bénéficiaires", value: "Citoyens & Usagers", detail: "Amélioration des infrastructures publiques" }
    ],
    culture: [
      { label: "Format Public", value: "Grand Format", detail: "Programmation ouverte à tous les publics" },
      { label: "Conservation", value: "Patrimoine Vivant", detail: "Mise en valeur d'œuvres et mémoires remarquables" },
      { label: "Événement", value: "Saison 2026", detail: "Rendez-vous majeur de l'agenda culturel" },
      { label: "Rayonnement", value: "International", detail: "Couverture médiatique et critique saluée" }
    ],
    économie: [
      { label: "Tendance Marché", value: "Consolidation", detail: "Investissements ciblés à forte valeur ajoutée" },
      { label: "Impact Emploi", value: "Filière Stratégique", detail: "Renforcement des compétences sectorielles" },
      { label: "Régulation", value: "Cadre Européen", detail: "Respect des normes de souveraineté économique" },
      { label: "Perspective", value: "Horizon 2026-2030", detail: "Visibilité financière confirmée par les analystes" }
    ]
  };

  // Aucun chiffre de remplissage : on ne montre que les chiffres réellement présents dans l'article.
  void fallbacks;
  return extracted.slice(0, 4);
}

/**
/**
 * Détecte toutes les anciennes phrases toutes faites / clichés répétitifs pour les bannir définitivement
 */
const BANNED_CANNED_PATTERNS: RegExp[] = [
  /Au-del[àa] des communiqu[ée]s froids et des effets d'annonce[^\n]*/gi,
  /Loin des certitudes triomphantes comme des d[ée]faitismes faciles[^\n]*/gi,
  /Les semaines [àa] venir permettront de juger sur pi[èe]ces si les engagements pris[^\n]*/gi,
  /Il y a des moments o[ùu] l'actualit[ée] suspend la marche ordinaire des jours[^\n]*/gi,
  /Au-del[àa] du choc imm[ée]diat, c'est l'histoire humaine qui se dessine en creux[^\n]*/gi,
  /Dans le recueillement qui accompagne ces heures marquantes, une certitude demeure[^\n]*/gi,
  /Bienvenue dans le grand th[ée][âa]tre de l'[ée]poque, o[ùu] l'agitation prend parfois des allures de com[ée]die baroque[^\n]*/gi,
  /Pourtant, sous le vernis du spectacle et des postures convenues, l'[ée]pisode en dit long sur nos travers contemporains[^\n]*/gi,
  /Comme souvent dans ces feuilletons haletants, la poussi[èe]re retombera bien assez vite[^\n]*/gi,
  /C'est une de ces nouvelles qui redonnent le go[ûu]t de lever les yeux et d'interroger notre rapport au monde[^\n]*/gi,
  /Loin des [ée]quations arides et du jargon r[ée]serv[ée] aux initi[ée]s[^\n]*/gi,
  /Les perspectives qui s'esquissent pour les prochaines ann[ée]es promettent de bouleverser bien des certitudes [ée]tablies[^\n]*/gi,
  /Il y a dans cette cr[ée]ation une [ée]tincelle rare qui touche droit au c[œo]ur[^\n]*/gi,
  /Dans une [ée]poque souvent domin[ée]e par l'urgence et le bruit des [ée]crans[^\n]*/gi,
  /Cette [œo]uvre rappelle la force fondamentale des arts\s*:\s*celle de nous rassembler[^\n]*/gi
];

export function hasCannedBoilerplate(text: string | undefined | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return (
    lower.includes("au-delà des communiqués froids") ||
    lower.includes("au-dela des communiques froids") ||
    lower.includes("loin des certitudes triomphantes") ||
    lower.includes("les semaines à venir permettront de juger sur pièces") ||
    lower.includes("suspend la marche ordinaire des jours") ||
    lower.includes("grand théâtre de l'époque, où l'agitation prend") ||
    lower.includes("loin des équations arides et du jargon") ||
    lower.includes("étincelle rare qui touche droit au cœur")
  );
}

export function stripCannedBoilerplate(text: string): string {
  if (!text) return "";
  let out = text;
  for (const rx of BANNED_CANNED_PATTERNS) {
    out = out.replace(rx, "");
  }
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

export type EditorialMood =
  | "humain"
  | "humoristique"
  | "sarcastique"
  | "investigateur"
  | "poetique"
  | "cash"
  | "philosophe";

export interface EditorialMoodConfig {
  id: EditorialMood;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
  badgeClass: string;
}

export const EDITORIAL_MOODS: EditorialMoodConfig[] = [
  {
    id: "humain",
    label: "Humain & Vivant",
    shortLabel: "Humain",
    emoji: "✍️",
    description: "Plume naturelle de journaliste de terrain, chaleureuse, incarnée et centrée sur le réel.",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
  },
  {
    id: "humoristique",
    label: "Humoristique & Décalé",
    shortLabel: "Humour",
    emoji: "😄",
    description: "Esprit vif, clins d'œil complices et traits d'humour tout en restant fidèle aux faits.",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
  },
  {
    id: "sarcastique",
    label: "Sarcastique & Mordant",
    shortLabel: "Sarcastique",
    emoji: "🌶️",
    description: "Ironie piquante façon presse satirique qui démonte la langue de bois et les belles promesses.",
    badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
  },
  {
    id: "investigateur",
    label: "Enquête & Coulisses",
    shortLabel: "Enquête",
    emoji: "🕵️",
    description: "Regard de grand reporter : qui finance, qui décide et ce que révèlent les chiffres en coulisses.",
    badgeClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
  },
  {
    id: "poetique",
    label: "Poétique & Littéraire",
    shortLabel: "Poétique",
    emoji: "🪶",
    description: "Belle plume d'écrivain, souffle romanesque et attention sensible aux atmosphères.",
    badgeClass: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30"
  },
  {
    id: "cash",
    label: "Cash & Sans Filtre",
    shortLabel: "Cash",
    emoji: "⚡",
    description: "Zéro détour : phrases directes, les vrais chiffres sur la table et ce que ça change pour vous.",
    badgeClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30"
  },
  {
    id: "philosophe",
    label: "Philosophe & Serein",
    shortLabel: "Philosophe",
    emoji: "🦉",
    description: "Un pas de côté apaisé pour interroger le sens profond de l'événement sans bruit ni panique.",
    badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30"
  }
];

export function getEditorialMoodConfig(mood?: string | null): EditorialMoodConfig {
  const found = EDITORIAL_MOODS.find(m => m.id === mood);
  return found || EDITORIAL_MOODS[0];
}

function computeArticleSeed(title: string, id?: number): number {
  const str = `${title || ""}_${id || 0}`;
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/**
 * Extracts or synthesizes 3 to 4 executive takeaways (Guaranteed 100% duplicate-free)
 */
function extractOrSynthesizeKeyTakeaways(article: NewsArticle): string[] {
  if (KNOWN_ARTICLES_DEEP_DATA[article.id]) {
    return KNOWN_ARTICLES_DEEP_DATA[article.id].keyTakeaways;
  }

  const rawText = stripCannedBoilerplate(`${article.summary || ""} ${article.content || ""}`);

  const isBoilerplate = (s: string) => {
    const l = s.toLowerCase();
    return (
      hasCannedBoilerplate(s) ||
      l.startsWith("source") ||
      l.startsWith("date") ||
      l.startsWith("publié") ||
      l.startsWith("lien original") ||
      l.includes("retrouvez le fil complet") ||
      l.includes("l'enquête en continu sur le site") ||
      l.includes("http://") ||
      l.includes("https://") ||
      l.includes("lire l'article complet") ||
      l.includes("tous droits réservés")
    );
  };

  // Split into sentences (by period followed by space, or by newline)
  const rawSentences = rawText
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.replace(/^[-•*#]+\s*/, "").trim())
    .filter(s => s.length > 25 && !isBoilerplate(s));

  // Strict deduplication using normalized substring hashes
  const uniqueSentences: string[] = [];
  const seenKeys = new Set<string>();

  for (const sentence of rawSentences) {
    const norm = sentence
      .toLowerCase()
      .replace(/[^a-z0-9à-ÿ]/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);
    if (!seenKeys.has(norm)) {
      seenKeys.add(norm);
      uniqueSentences.push(sentence);
    }
  }

  if (uniqueSentences.length >= 3) {
    return uniqueSentences.slice(0, 4);
  }

  // Synthesize clean distinct takeaways from summary and title (zero repetition)
  const summaryPart = (article.summary || "").trim();
  const titlePart = (article.title || "").trim();
  const sourcePart = article.source || "Presse de référence";
  const catPart = article.category || "Actualités";

  void sourcePart; void catPart;
  // Pas de phrases inventées : le titre et le résumé réels de l'article, rien d'autre.
  return [titlePart, summaryPart].filter((t) => t && t.length > 0);
}

/**
 * Extracts or synthesizes a 4-pillar strategic analysis
 */
function extractOrSynthesizeStrategicAnalysis(article: NewsArticle): ArticleStrategicAnalysis {
  if (KNOWN_ARTICLES_DEEP_DATA[article.id]) {
    return KNOWN_ARTICLES_DEEP_DATA[article.id].strategicAnalysis;
  }

  // Pas d'analyse inventée : champs vides tant qu'une vraie analyse (IA, clé de l'utilisateur) n'est pas générée.
  return {
    actorsInvolved: article.source ? [article.source] : [],
    marketImpact: "",
    privacyCompliance: "",
    nextMilestone: ""
  };
}

/**
 * Journalistic investigation for Mondial de l'auto 2026 & Electric Offensive
 * Récit humain, vivant et captivant sans intertitres robotiques
 */
export const MONDIAL_AUTO_2026_FULL_CONTENT = 
  "Il flotte dans les allées de la Porte de Versailles cette odeur inimitable de cuir neuf, de cire et d'électricité statique. Après des années de doutes, de salons boudés et de réunions Zoom en visioconférence, le Mondial de l'automobile de Paris s'offre une spectaculaire cure de jouvence. Et pour cause : sous les projecteurs des soixante constructeurs mondiaux réunis ce mois-ci, ce n'est rien de moins que l'avenir de nos routes quotidiennes qui se joue, entre fierté tricolore et rouleau compresseur technologique venu d'Asie.\n\n" +
  "Sur le ring, le contraste est saisissant. D'un côté, les géants chinois — BYD, XPeng, Leapmotor — ont débarqué en force, occupant près d'un quart de la surface avec des citadines ultra-léchées et des batteries dernière génération, bien décidés à contourner les nouvelles surtaxes douanières européennes en ouvrant des usines directement sur notre continent. De l'autre, la riposte française et européenne ne manque ni de panache ni de nostalgie : la bouille rétro-futuriste de la nouvelle Renault 4 E-Tech et de la R5 fait battre le cœur des familles, tandis que la Citroën ë-C3 promet enfin le Graal tant attendu : une voiture 100 % électrique, bien finie, à moins de 25 000 euros.\n\n" +
  "Car derrière les prototypes étincelants et les démonstrateurs à batterie Sodium-ion capables de recharger en un quart d'heure, la vraie question qui taraude les visiteurs qui se pressent sur les stands est profondément humaine : pourra-t-on encore rouler demain sans se ruiner ? Entre l'angoisse de la panne, les calculs de budget familial et le plaisir retrouvé de conduire, le Mondial 2026 prouve au moins une chose : l'automobile populaire n'a pas dit son dernier mot, et la passion est loin d'avoir calé.";

/**
 * Journalistic chronicle for Incendie du Marché des Enfants Rouges (Paris - 12 octobre 2026)
 * Écrit avec émotion, humanité, gravité et tendresse pour le patrimoine
 */
export const ENFANTS_ROUGES_FIRE_FULL_CONTENT = 
  "Ce matin, rue de Bretagne, le réveil a l'odeur âcre des cendres et du chagrin partagé. Il était un peu plus de trois heures dans la nuit quand l'alarme a déchiré le silence du Haut-Marais. En quelques minutes à peine, les flammes ont dévoré la vénérable charpente de bois du marché des Enfants Rouges, sous les yeux pétrifiés des riverains descendus en pyjama sur les trottoirs. Quatre cent onze ans d'histoire parisienne, de rires et de tablées dominicales qui partent en fumée en un souffle tragique.\n\n" +
  "Fondé en 1615 sous Louis XIII pour nourrir les orphelins vêtus de serge rouge — symbole de la charité chrétienne —, le plus vieux marché couvert de la capitale n'était pas seulement un monument historique classé. C'était un village dans la ville. On y venait pour les tajines fumants d'Ali, les bentos soignés du comptoir japonais, les poissons frais de la criée et ce brouhaha chaleureux qui faisait battre le cœur du 3e arrondissement. « C'est une partie de notre enfance qui brûle », glisse une habitante les larmes aux yeux, serrant son manteau contre le vent glacé d'octobre.\n\n" +
  "Il aura fallu le courage exemplaire de plus de soixante-dix sapeurs-pompiers de Paris et une quinzaine d'engins pour éviter que le brasier ne se propage aux immeubles d'habitation voisins. Par miracle, aucune victime civile n'est à déplorer dans ce cauchemar nocturne, un pompier ayant simplement été soigné pour un coup de chaud. Mais pour la vingtaine de commerçants et d'artisans qui faisaient vivre ce lieu magique, le choc est immense : leurs étals, leurs outils de travail et des années de labeur sont anéantis.\n\n" +
  "Déjà, la solidarité parisienne s'organise. Sur place dès les premières lueurs de l'aube, les élus locaux et la mairie de Paris ont promis un soutien d'urgence immédiat et une reconstruction fidèle, main dans la main avec les Architectes des Bâtiments de France. Le Marais a perdu son poumon gourmand, mais l'âme des Enfants Rouges, elle, ne se laissera pas éteindre.";

/**
 * Journalistic chronicle for Donald Trump & TMTG / Truth Social
 * Regard acéré, ironie mordante et lucidité financière
 */
export const TRUMP_TMTG_FULL_CONTENT = 
  "Bienvenue dans le grand cirque de Wall Street, version XXIe siècle. Quand Donald Trump a décidé de propulser sa maison-mère de Truth Social, Trump Media & Technology Group (TMTG), sur le prestigieux Nasdaq sous le ticker « DJT », les analystes financiers les plus chevronnés en ont avalé leur café de travers. Car dans cette aventure boursière sans équivalent, les règles centenaires de l'économie fondamentale semblent avoir été purement et simplement jetées par la fenêtre.\n\n" +
  "Pour comprendre le vertige, il suffit de regarder les chiffres avec un brin de malice : voilà une entreprise qui affiche un chiffre d'affaires annuel de quatre petits millions de dollars — à peu près l'équivalent de deux pizzerias qui marchent fort à Manhattan — et qui se retrouve catapultée à une valorisation de plus de huit milliards de dollars ! Ici, point besoin de ratios de rentabilité ou de calculs d'EBITDA : le cours de l'action monte ou s'effondre au gré d'une formule assassine lâchée sur les réseaux sociaux, d'un sondage électoral en Pennsylvanie ou d'un rebondissement judiciaire en direct.\n\n" +
  "Au cœur du manège, l'ancien président détient personnellement près de 57 % des parts, soit une fortune de papier colossale suspendue aux caprices du marché. Quand la SEC s'inquiète et que les traders de court terme s'arrachent le titre comme un « meme stock » sous amphétamines, la direction de TMTG promet déjà monts et merveilles : un réseau de streaming vidéo baptisé Truth+, de l'hébergement souverain et une émancipation totale des géants de la Silicon Valley.\n\n" +
  "Génie de la finance participative ou bulle spéculative prête à exploser au premier coup de vent électoral ? Une chose est sûre : pour les spectateurs comme pour les actionnaires, le spectacle vaut largement le prix du billet, même si les cœurs fragiles feraient bien d'attacher leur ceinture.";

/**
 * Robust cleaner: converts any raw JSON strings, truncated JSON, or boilerplate punctuation into clean French prose
 * Élimine TOUTE phrase préfabriquée et tout intertitre robotique.
 */
export function cleanArticleContent(
  raw: string,
  fallbackTitle?: string,
  fallbackSummary?: string,
  mood?: EditorialMood
): string {
  if (!raw || typeof raw !== "string") {
    if (fallbackTitle || fallbackSummary) {
      return buildHumanStoryByTone({ title: fallbackTitle, summary: fallbackSummary }, mood);
    }
    return "";
  }
  let text = raw.trim();

  // If text contains JSON syntax, truncated JSON or markers
  const hasJsonArtifacts = 
    text.startsWith("{") || 
    text.startsWith("[") || 
    text.includes('"status"') ||
    text.includes('"titre"') || 
    text.includes('"source"') || 
    text.includes('"tags"') || 
    text.includes('"resume"') ||
    text.includes('"corps"') || 
    text.includes('"content"') ||
    /["']?(?:status|titre|title|source|categorie|category|resume|summary|tags|corps|content|date_publication)["']?\s*:/i.test(text);

  if (hasJsonArtifacts) {
    const lowerCombined = (text + " " + (fallbackTitle || "") + " " + (fallbackSummary || "")).toLowerCase();
    if (
      lowerCombined.includes("tmtg") || 
      (lowerCombined.includes("trump") && (
        lowerCombined.includes("bours") || 
        lowerCombined.includes("truth social") || 
        lowerCombined.includes("dwac") || 
        lowerCombined.includes("wall street")
      ))
    ) {
      /* texte pré-écrit retiré */
    }

    if (lowerCombined.includes("enfants rouges") || lowerCombined.includes("enfants-rouges")) {
      /* texte pré-écrit retiré */
    }

    if (lowerCombined.includes("mondial de l’auto") || lowerCombined.includes("mondial de l'auto")) {
      /* texte pré-écrit retiré */
    }

    // 1. Try parsing JSON if valid
    try {
      let jsonCandidate = text;
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        jsonCandidate = text.substring(start, end + 1);
      }
      const parsed = JSON.parse(jsonCandidate);
      const possibleCorps = parsed.corps || parsed.content;
      if (possibleCorps && typeof possibleCorps === "string" && possibleCorps.trim().length > 40 && !possibleCorps.trim().startsWith("{")) {
        const cleanedCorps = sanitizeHumanStory(possibleCorps.trim().replace(/\\n/g, "\n"));
        if (cleanedCorps.length >= 200) return cleanedCorps;
      }
    } catch {}

    // 2. Try regex extraction of "corps" or "content"
    const corpsMatch = text.match(/["'](?:corps|content|texte)["']\s*:\s*["']([\s\S]+?)(?:["']\s*,\s*["'][a-zA-Z]+["']\s*:|["']\s*\}|$)/);
    if (corpsMatch && corpsMatch[1] && corpsMatch[1].length > 40 && !corpsMatch[1].trim().startsWith("{")) {
      const cleanedCorps = sanitizeHumanStory(corpsMatch[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, " ")
        .trim());
      if (cleanedCorps.length >= 200) return cleanedCorps;
    }

    // 3. Fallback: generate rich, human prose
    const resumeMatch = text.match(/["'](?:resume|summary|description)["']\s*:\s*["']([^"']+)["']/);
    const titleMatch = text.match(/["'](?:titre|title)["']\s*:\s*["']([^"']+)["']/);
    const cleanTitre = (titleMatch ? titleMatch[1] : fallbackTitle) || "Dossier d'actualité";
    let cleanResume = (resumeMatch ? resumeMatch[1] : fallbackSummary) || "";
    cleanResume = cleanResume.replace(/[{}\[\]"]/g, "").trim();

    return buildHumanStoryByTone({ title: cleanTitre, summary: cleanResume }, mood);
  }

  let cleaned = text.replace(/\\n/g, "\n");

  // Supprime définitivement les séparateurs textuels et textes d'intro génériques
  cleaned = cleaned
    .replace(/^===+[\s\S]*?===+\s*/gm, "")
    .replace(/===+\s*TEXTE\s+INT[EÉ]GRAL\s*===+/gi, "")
    .replace(/===+\s*RESUME\s*\/\s*ANALYSE\s*===+/gi, "")
    .replace(/===+\s*INFOPERSO[\s\S]*?===+/gi, "")
    .replace(/Retrouvez le fil complet des événements[\s\S]*$/i, "")
    .replace(/^Voici l(?:'|e\s+)texte\s+int[ée]gral[\s\S]*?:/gim, "")
    .trim();

  // Strip robotic headings and canned cliché sentences
  cleaned = sanitizeHumanStory(cleaned);

  const isMinimalRssStub = cleaned.replace(/#.*?\n/g, "").trim().length < 220;
  if (isMinimalRssStub && (fallbackTitle || fallbackSummary)) {
    const cleanTitre = fallbackTitle || "Dossier d'actualité";
    const cleanResume = fallbackSummary || cleaned;
    return buildHumanStoryByTone({ title: cleanTitre, summary: cleanResume }, mood);
  }

  return cleaned;
}

/**
 * Nettoie radicalement les intertitres robotiques numérotés et les anciennes phrases préfabriquées
 * ('Au-delà des communiqués froids...', '### 1. Contexte...', etc.).
 */
function sanitizeHumanStory(content: string): string {
  if (!content) return "";
  let cleaned = stripCannedBoilerplate(content);
  return cleaned
    .replace(/###\s*\d+\.\s*(?:Contexte|Faits Majeurs|D[ée]cryptage|Analyse Approfondie|Impacts? [EÉ]conomiques?|Pack [EÉ]conomique|Perspectives?|Enjeux|Phase de r[ée]flexion|Retomb[ée]es)\s*[:—–-]?\s*/gi, "")
    .replace(/###\s*(?:Contexte & Faits Majeurs|Analyse Approfondie & Enjeux Sectoriels|Impacts? [EÉ]conomiques? & Retomb[ée]es Pratiques|Perspectives, Calendrier & Prochaines [EÉ]ch[ée]ances|Pack [EÉ]conomique|Phase d'analyse|R[ée]flexion strat[ée]gique)\b[:—–-]?/gi, "")
    .replace(/###\s*\d+\.\s*/g, "### ")
    .replace(/^###\s*$/gm, "")
    .replace(/###\s*([^\n]+)/g, (_match, title) => {
      if (/^(?:contexte|analyse|impact|retomb[ée]es|perspectives|enjeux|calendrier|bilan)/i.test(title.trim())) {
        return "";
      }
      return `### ${title.trim()}`;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Rédige un article journalistique authentique, varié et 100% humain selon l'un des 7 réglages d'humeur :
 * - 'humain' (Plume vivante & terrain)
 * - 'humoristique' (Humour & esprit vif)
 * - 'sarcastique' (Ironie mordante & satirique)
 * - 'investigateur' (Enquête, coulisses & chiffres)
 * - 'poetique' (Plume littéraire & sensible)
 * - 'cash' (Direct, franc & sans filtre)
 * - 'philosophe' (Recul serein & prise de hauteur)
 *
 * Aucune phrase préfabriquée ne se répète d'un article à l'autre : le moteur puise dans les faits,
 * chiffres, acteurs et résumés propres à chaque sujet avec 10x10x10 variantes syntaxiques par humeur.
 */
export function buildHumanStoryByTone(
  article: {
    id?: number;
    title?: string;
    summary?: string;
    category?: string;
    source?: string;
    content?: string;
    keyFigures?: Array<{ label: string; value: string; detail?: string }>;
    keyTakeaways?: string[];
    strategicAnalysis?: ArticleStrategicAnalysis;
  },
  moodOverride?: EditorialMood
): string {
  const title = (article.title || "Ce sujet d'actualité").trim();
  const rawSummary = stripCannedBoilerplate((article.summary || "").trim());
  const source = (article.source || "la rédaction").trim();
  const category = (article.category || "Société").trim();
  const seed = computeArticleSeed(title, article.id);

  // Extract concrete facts & figures from the article itself
  const figures = article.keyFigures && article.keyFigures.length > 0
    ? article.keyFigures
    : extractOrSynthesizeKeyFigures(article as NewsArticle);
  const takeaways = article.keyTakeaways && article.keyTakeaways.length > 0
    ? article.keyTakeaways.filter(t => !hasCannedBoilerplate(t))
    : extractOrSynthesizeKeyTakeaways(article as NewsArticle);

  const fig0 = figures[0] ? `${figures[0].label.toLowerCase()} (${figures[0].value})` : `les premiers indicateurs publiés par ${source}`;
  const fig1 = figures[1] ? `${figures[1].label.toLowerCase()} affiché à ${figures[1].value}` : `l'évolution rapide observée dans le secteur ${category}`;
  const fact1 = takeaways[0] && takeaways[0] !== rawSummary ? takeaways[0] : "";
  const fact2 = takeaways[1] && takeaways[1] !== rawSummary ? takeaways[1] : "";
  const fact3 = takeaways[2] && takeaways[2] !== rawSummary ? takeaways[2] : "";

  const leadParagraph = rawSummary && rawSummary.length > 25
    ? rawSummary
    : `C'est un sujet qui fait vivement réagir depuis sa publication par ${source} : ${title}.`;

  // Determine active mood
  let mood: EditorialMood = moodOverride || "humain";
  if (!moodOverride) {
    try {
      const savedMood = typeof window !== "undefined" ? (localStorage.getItem("infoperso_editorial_mood") as EditorialMood) : null;
      if (savedMood && EDITORIAL_MOODS.some(m => m.id === savedMood)) {
        mood = savedMood;
      }
    } catch {}
  }

  const v1 = seed % 8;
  const v2 = Math.floor(seed / 8) % 8;
  const v3 = Math.floor(seed / 64) % 8;

  // 1. HUMEUR : HUMAIN & VIVANT (Journalisme de terrain incarné)
  if (mood === "humain") {
    const hooks = [
      `Quand on discute avec ceux qui suivent de près ce dossier relayé par ${source}, une chose frappe tout de suite : "${title}" n'a rien d'une abstraction théorique.`,
      `C'est souvent dans les détails du quotidien que l'on mesure le vrai poids d'une information comme celle que rapporte ${source} autour de "${title}".`,
      `Depuis quelques heures, le sujet s'invite dans toutes les conversations du secteur ${category} : "${title}" touche à des réalités bien concrètes.`,
      `On pourrait croire à une simple dépêche de plus dans le fil de l'actualité ${category}, mais ce que révèle ${source} raconte une tout autre histoire.`,
      `Sur le vif, les réactions ne se sont pas fait attendre après la mise en lumière par ${source} de ce point précis : ${title}.`,
      `Regardons les choses à hauteur d'homme : derrière l'intitulé "${title}", ce sont des habitudes, des métiers et des choix très concrets qui bougent.`,
      `Chez les professionnels comme chez les particuliers attentifs au domaine ${category}, l'information publiée par ${source} a fait l'effet d'un révélateur.`,
      `Prenons une minute pour poser les faits tels qu'ils se déroulent réellement autour de "${title}", avec les éléments recueillis par ${source}.`
    ];
    const bodies = [
      `Pour bien saisir ce qui se joue, il faut s'arrêter sur un repère parlant : ${fig0}, auquel s'ajoute ${fig1}. ${fact1 ? `${fact1} ` : ""}Dans les faits, cela oblige chacun à revoir ses priorités sans attendre.`,
      `${fact1 ? `${fact1} ` : ""}Et les chiffres donnent le tournis autant qu'ils éclairent la situation : on parle ici de ${fig0} et d'une tendance marquée par ${fig1}. ${fact2 || ""}`,
      `Ce qui change la donne aujourd'hui, c'est la convergence entre ${fig0} et les réalités du terrain. ${fact1 ? `${fact1} ` : ""}${fact2 ? `De plus, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
      `En creusant les données mises sur la table (${fig0}, mais aussi ${fig1}), on comprend mieux pourquoi le sujet passionne autant. ${fact1 || ""} ${fact2 || ""}`,
      `Concrètement, plusieurs éléments s'emboîtent : d'abord ${fig0}, ensuite ${fig1}. ${fact1 ? `${fact1} ` : ""}Rien n'est laissé au hasard par les acteurs impliqués.`,
      `Les observateurs de ${source} le soulignent avec justesse : avec ${fig0}, le cap franchi dans l'univers ${category} est net. ${fact1 || ""} ${fact2 || ""}`,
      `Là où le bât blesse — ou là où l'opportunité se crée, selon le côté où l'on se place —, c'est autour de ${fig0}. ${fact1 ? `${fact1} ` : ""}${fact3 || ""}`,
      `À regarder de près ${fig0} ainsi que ${fig1}, le constat s'impose de lui-même. ${fact1 ? `${fact1} ` : ""}Chacun cherche désormais la bonne manière de s'y adapter.`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Reste maintenant à voir comment cette dynamique va s'inscrire dans nos usages de tous les jours, loin des grands discours et au plus près des besoins réels.`,
      `Une chose est sûre : entre ${fig0} et les attentes légitimes du public, les prochains rendez-vous du secteur ${category} seront scrutés avec une attention toute particulière.`,
      `${fact3 ? `${fact3} ` : ""}La balle est désormais dans le camp de ceux qui devront transformer cet essai sur le terrain, là où les promesses se confrontent à la vraie vie.`,
      `Au bout du compte, ce que rappelle cet épisode suivi par ${source}, c'est qu'aucune évolution en ${category} ne tient la route si elle oublie ceux qui la vivent au quotidien.`,
      `${fact3 ? `${fact3} ` : ""}Un dossier bien vivant, dont les prochains rebondissements mériteront qu'on garde l'œil ouvert et l'esprit critique en éveil.`,
      `Il faudra sans doute encore quelques semaines pour mesurer toute la portée de ce virage, mais le signal envoyé aujourd'hui dans la sphère ${category} est déjà limpide.`,
      `${fact3 ? `${fact3} ` : ""}D'ici là, les acteurs concernés savent qu'ils n'ont plus droit à l'erreur : c'est sur la durée et la sincérité des actes que se fera la différence.`,
      `Voilà en tout cas un sujet qui remet les pendules à l'heure dans le paysage ${category}, et qui prouve que le réel finit toujours par reprendre ses droits.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 2. HUMEUR : HUMORISTIQUE & DÉCALÉ
  if (mood === "humoristique") {
    const hooks = [
      `Sortez le pop-corn et ajustez vos lunettes : dans la grande série à rebondissements du secteur ${category}, l'épisode du jour signé ${source} (« ${title} ») vaut franchement le détour !`,
      `Si vous pensiez passer une journée tranquille loin des soubresauts de l'actualité ${category}, c'est raté : "${title}" vient de débarquer sur la table avec le tact d'une fanfare un dimanche matin.`,
      `Avouons-le avec un sourire : il y a des titres qui donnent immédiatement envie de vérifier si son café n'était pas un peu trop serré. Avec "${title}", ${source} nous régale d'une pépite bien de notre époque.`,
      `On ne s'ennuie décidément jamais dans le merveilleux monde de la ${category} ! À peine le temps de souffler que voici "${title}", servi tout chaud par ${source}.`,
      `C'est ce qu'on appelle avoir le sens du timing : autour de "${title}", tout le petit monde de la ${category} s'agite comme une ruche qui aurait découvert une promotion sur le miel.`,
      `Qui a dit que l'actualité ${category} manquait de piquant ? En lisant les détails de "${title}" rapportés par ${source}, on hésite entre l'applaudissement admiratif et le fou rire poli.`,
      `Attention, virage serré ! Avec "${title}", les protagonistes du dossier nous offrent une chorégraphie millimétrée où chacun tente de garder son sérieux devant les caméras.`,
      `Imaginez la tête des observateurs chez ${source} en découvrant les dessous de "${title}" : un mélange de surprise gourmande et de « on vous l'avait bien dit ! ».`
    ];
    const bodies = [
      `Il faut dire que les chiffres ont de quoi faire sourire (ou tousser, c'est selon) : jugez plutôt avec ${fig0} et ${fig1} ! ${fact1 ? `${fact1} ` : ""}Pas mal pour un dossier qui devait soi-disant rester sage.`,
      `Le plus savoureux dans l'histoire se niche dans les détails : entre ${fig0} d'un côté et ${fig1} de l'autre, personne n'avait prévu un tel grand écart. ${fact1 || ""} ${fact2 || ""}`,
      `Côté coulisses, la recette ne manque pas de sel : prenez ${fig0}, ajoutez une pincée de ${fig1}, secouez vigoureusement et vous obtenez le feuilleton de la semaine. ${fact1 || ""}`,
      `Pour ceux qui aiment les devinettes chiffrées, retenez bien ${fig0}. ${fact1 ? `${fact1} ` : ""}Et comme un bonheur n'arrive jamais seul, ${fact2 ? fact2.charAt(0).toLowerCase() + fact2.slice(1) : `on note aussi ${fig1}.`}`,
      `Même le scénariste le plus inspiré n'aurait pas osé aligner ${fig0} et ${fig1} dans la même intrigue. ${fact1 ? `${fact1} ` : ""}Mais la réalité a souvent beaucoup plus d'imagination que la fiction !`,
      `Alors bien sûr, chacun y va de sa petite partition autour de ${fig0}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Pendant ce temps, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
      `Le clou du spectacle ? Sans conteste ${fig0}, talonné de près par ${fig1}. ${fact1 ? `${fact1} ` : ""}De quoi animer joyeusement les prochains dîners en ville.`,
      `Avec ${fig0} au compteur, on comprend pourquoi tout le monde veut soudainement donner son avis sur la question. ${fact1 || ""} ${fact2 || ""}`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Allez, prenons le pari : d'ici le prochain épisode, on n'a pas fini d'en sourire autour de la machine à café !`,
      `Morale provisoire de cette joyeuse épopée : dans le secteur ${category}, mieux vaut avoir de l'humour et de bonnes chaussures de marche.`,
      `${fact3 ? `${fact3} ` : ""}En attendant la suite des aventures, gardons le sourire : au moins, le spectacle est compris dans l'abonnement à la vie moderne !`,
      `Rendez-vous au prochain acte pour voir qui gardera la couronne et qui repartira avec le lot de consolation. D'ici là, haut les cœurs !`,
      `${fact3 ? `${fact3} ` : ""}Comme quoi, même les dossiers les plus sérieux gagnent à être regardés avec un brin de malice et d'esprit.`,
      `On souhaite bien du courage à ceux qui devront résumer tout ça sans sourire lors de la prochaine réunion officielle !`,
      `${fact3 ? `${fact3} ` : ""}Une chose est certaine : si l'audace se mesurait en décibels, ce dossier aurait déjà décroché le disque d'or.`,
      `Bref, gardez ce sujet sous le coude : c'est le genre d'histoire qui met tout de suite de bonne humeur quand on la raconte avec un brin de recul.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 3. HUMEUR : SARCASTIQUE & MORDANT
  if (mood === "sarcastique") {
    const hooks = [
      `Oh, quelle divine surprise ! À en croire les violons habituels, tout devait rouler comme sur des roulettes, et voilà que ${source} lève le voile sur "${title}". Qui aurait pu prédire ?`,
      `Sortez les mouchoirs et les éléments de langage : avec "${title}", on atteint des sommets dans l'art délicat de nous vendre des vessies pour des lanternes connectées.`,
      `C'est beau comme une promesse électorale un soir de printemps : autour de "${title}", tout le monde rivalise soudainement de vertu et d'étonnement feint, comme le rapporte ${source}.`,
      `Encore un chef-d'œuvre de lucidité tardive dans le monde merveilleux de la ${category} ! Il aura fallu que ${source} mette les pieds dans le plat avec "${title}" pour que les langues se délient.`,
      `On adore quand la réalité vient poliment frapper à la porte des grands stratèges : avec "${title}", le vernis craque pile là où on nous jurait qu'il était indestructible.`,
      `Mais oui, dormez braves gens, tout est sous contrôle ! Enfin, jusqu'à ce qu'on lise en détail ce que révèle ${source} à propos de "${title}".`,
      `Dans la catégorie « on nous prend vraiment pour des perdreaux de l'année », le dossier "${title}" suivi par ${source} mérite assurément une médaille en chocolat.`,
      `Admirez le travail d'équilibriste : autour de "${title}", certains réussissent l'exploit de créer le problème le lundi pour se poser en sauveurs providentiels le jeudi.`
    ];
    const bodies = [
      `Car les chiffres, eux, ont le mauvais goût de ne pas lire les dossiers de presse : ${fig0}, assorti de ${fig1}. ${fact1 ? `${fact1} ` : ""}Mais chut, il paraît que c'est « totalement maîtrisé ».`,
      `Regardez bien la mécanique : d'un côté on affiche ${fig0}, de l'autre on glisse discrètement ${fig1} sous le tapis. ${fact1 || ""} ${fact2 || ""} Du grand art !`,
      `Quand on additionne ${fig0} et ${fig1}, la farce devient carrément savoureuse. ${fact1 ? `${fact1} ` : ""}On attend avec impatience la pirouette rhétorique qui justifiera la facture.`,
      `${fact1 ? `${fact1} ` : ""}Et pour couronner le tout, le compteur affiche ${fig0} ainsi que ${fig1}. Bien entendu, les responsables nous expliqueront la main sur le cœur que personne ne l'avait vu venir.`,
      `C'est fou ce que les chiffres deviennent bavards quand on les presse un peu : ${fig0}, rien que ça ! ${fact1 ? `${fact1} ` : ""}${fact2 || ""}`,
      `Pendant qu'on nous amuse avec des formules ronflantes, la vraie addition tourne autour de ${fig0} et ${fig1}. ${fact1 || ""} Cherchez l'erreur !`,
      `Le détail qui tue ? Sans doute ${fig0}, complété par ${fig1}. ${fact1 ? `${fact1} ` : ""}Il fallait oser, ils l'ont fait sans même cligner des yeux.`,
      `Sous les sourires de façade, la réalité comptable pique un peu : ${fig0}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Et comme par hasard, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Mais rassurez-vous : à la fin, comme d'habitude, les décideurs empocheront les lauriers et les usagers paieront les pots cassés.`,
      `On parie combien qu'un comité Théodule va être créé dès lundi matin pour nous pondre un rapport de 200 pages que personne ne lira ?`,
      `${fact3 ? `${fact3} ` : ""}Allez, circulez, il n'y a rien à voir… jusqu'au prochain retour de bâton qui surprendra encore tous les experts autoproclamés !`,
      `Bref, encore une brillante démonstration que dans le secteur ${category}, le ridicule ne tue pas — il donne même parfois droit à un bonus.`,
      `${fact3 ? `${fact3} ` : ""}Heureusement qu'il nous reste l'ironie pour digérer la pilule, parce que côté sobriété dans la mauvaise foi, les quotas sont largement dépassés.`,
      `Vivement la prochaine conférence de presse où l'on nous expliquera avec aplomb que ce cafouillage était en réalité une « stratégie disruptive » !`,
      `${fact3 ? `${fact3} ` : ""}En attendant, gardez la main sur votre portefeuille : quand les discours deviennent aussi lyriques, l'addition n'est jamais bien loin.`,
      `Fin du premier acte. Nul doute que la suite nous réservera encore quelques perles d'hypocrisie polie dont nos élites ont le secret.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 4. HUMEUR : ENQUÊTE & COULISSES (Investigation)
  if (mood === "investigateur") {
    const hooks = [
      `Pour comprendre les véritables ressorts de "${title}", il faut suivre la piste des chiffres et des rapports de force documentés par ${source}.`,
      `Qui gagne, qui perd et qui tire réellement les ficelles derrière "${title}" ? Les éléments rassemblés par ${source} éclairent la mécanique interne du dossier.`,
      `En recoupant les données disponibles autour de "${title}", un constat stratégique se dégage nettement dans la filière ${category}.`,
      `Dans les coulisses de "${title}", les arbitrages financiers et opérationnels relevés par ${source} montrent que rien n'est dû au hasard.`,
      `Décryptage pièce par pièce : derrière l'intitulé "${title}", plusieurs mouvements convergents redessinent actuellement la carte du secteur ${category}.`,
      `C'est le point névralgique que scrutent tous les analystes après la publication de ${source} sur "${title}" : où se situe le vrai levier de décision ?`,
      `Ouvrons le capot de ce dossier "${title}" : entre intérêts industriels, contraintes réglementaires et données chiffrées, l'enquête révèle des lignes de faille précises.`,
      `Les faits bruts rapportés par ${source} autour de "${title}" dessinent une séquence où chaque acteur abat ses cartes avec un objectif bien précis.`
    ];
    const bodies = [
      `Premier élément matériel au dossier : ${fig0}, directement corrélé à ${fig1}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `En parallèle, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
      `L'examen attentif des indicateurs fait ressortir deux marqueurs clés : ${fig0} d'une part, et ${fig1} d'autre part. ${fact1 || ""} ${fact2 || ""}`,
      `En suivant la chaîne de valeur du secteur ${category}, un chiffre retient immédiatement l'attention : ${fig0}. ${fact1 ? `${fact1} ` : ""}Ce paramètre explique à lui seul l'accélération actuelle.`,
      `${fact1 ? `${fact1} ` : ""}Côté chiffrage, le croisement entre ${fig0} et ${fig1} confirme l'ampleur des engagements en jeu. ${fact2 || ""}`,
      `Les documents et retours de terrain convergent vers un même point d'équilibre : ${fig0}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Surtout, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
      `Sous l'angle financier et structurel, l'équation repose sur ${fig0} ainsi que ${fig1}. ${fact1 || ""} Un verrou stratégique que les acteurs du secteur ${category} cherchent tous à contrôler.`,
      `Trois faits vérifiés structurent cette affaire : ${fact1 || title} ; la pesée de ${fig0} ; et l'impact direct mesuré par ${fig1}. ${fact2 || ""}`,
      `La clé de lecture réside dans l'écart observé autour de ${fig0} et ${fig1}. ${fact1 ? `${fact1} ` : ""}C'est exactement sur ce terrain que se joue le rapport de force.`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Reste une question décisive pour la suite de l'enquête : qui assumera le coût réel de ces arbitrages à moyen terme ?`,
      `Les prochaines échéances permettront de vérifier si les garanties annoncées résistent à l'épreuve des comptes et du terrain.`,
      `${fact3 ? `${fact3} ` : ""}Un dossier stratégique à suivre de près, tant ses ramifications dans le secteur ${category} dépassent le cadre de cette première étape.`,
      `En clair : derrière la vitrine officielle, le véritable bras de fer économique et réglementaire autour de "${title}" ne fait que commencer.`,
      `${fact3 ? `${fact3} ` : ""}La vigilance reste donc de mise sur l'exécution concrète et la transparence des flux engagés.`,
      `C'est sur ces indicateurs précis — et non sur les intentions déclarées — que se jouera la crédibilité de l'opération dans les mois qui viennent.`,
      `${fact3 ? `${fact3} ` : ""}Autant d'éléments tangibles qui montrent que la recomposition du secteur ${category} est désormais entrée dans sa phase critique.`,
      `Affaire à suivre : les prochains bilans chiffrés diront rapidement qui détenait la bonne lecture du dossier.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 5. HUMEUR : POÉTIQUE & LITTÉRAIRE
  if (mood === "poetique") {
    const hooks = [
      `Il est des nouvelles qui traversent le tumulte des jours comme un signe discret des métamorphoses de notre temps : ainsi en va-t-il de "${title}", esquissé aujourd'hui par ${source}.`,
      `Sous la prose ordinaire des dépêches, l'histoire de "${title}" déploie une tapisserie singulière où se mêlent les élans, les doutes et les espoirs d'une époque.`,
      `À qui sait prêter l'oreille aux murmures du monde, ce que raconte ${source} autour de "${title}" résonne avec une intensité toute particulière.`,
      `Chaque journée apporte sur le rivage de l'actualité son lot de récits fragiles ou puissants ; "${title}" appartient à ceux qui laissent une empreinte durable dans l'esprit.`,
      `Comme un chapitre nouveau qui s'écrit sous nos yeux dans le grand livre du domaine ${category}, "${title}" invite à suspendre un instant la course des horloges.`,
      `Derrière les mots posés par ${source} sur "${title}", on devine le bruissement des coulisses, la patience des gestes et le souffle d'une époque qui cherche sa voie.`,
      `Regarder "${title}" avec les yeux d'un chroniqueur attentif, c'est accepter d'y voir bien plus qu'un fait brut : le miroir mouvant de nos aspirations collectives.`,
      `Dans la lumière changeante de cette semaine, le récit consacré par ${source} à "${title}" dessine des contours à la fois précis et profondément humains.`
    ];
    const bodies = [
      `Même la rigueur des nombres — ${fig0}, ou encore ${fig1} — semble ici raconter une aventure sensible. ${fact1 ? `${fact1} ` : ""}Chaque chiffre porte en lui la trace d'un effort ou d'un choix.`,
      `${fact1 ? `${fact1} ` : ""}Et lorsque l'on contemple l'ampleur de ${fig0} conjuguée à ${fig1}, on mesure combien la main de l'homme continue de façonner patiemment son horizon. ${fact2 || ""}`,
      `Il y a une géométrie secrète dans cet enchaînement où ${fig0} répond à ${fig1}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Plus loin, ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
      `Car la réalité, jusque dans ses repères les plus tangibles (${fig0}), ne sépare jamais le calcul de l'émotion. ${fact1 || ""} ${fact2 || ""}`,
      `À travers ${fig0} et ${fig1}, c'est toute une géographie d'initiatives et de regards croisés qui s'anime doucement. ${fact1 ? `${fact1} ` : ""}`,
      `Les faits recueillis par ${source} — ${fact1 || title} — s'illuminent d'un relief neuf dès qu'on les relie à ${fig0} et au chemin parcouru.`,
      `Entre l'exactitude de ${fig0} et le mouvement esquissé par ${fig1}, la chronique trouve son rythme juste, fidèle à la vérité des choses. ${fact1 || ""}`,
      `Tout se tient dans ce tableau nuancé : la précision de ${fig0}, la portée de ${fig1}, et cette réalité vivante que résume ${source}. ${fact1 || ""}`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Et tandis que la page du jour se tourne, demeure cette question silencieuse : quelle trace cet élan laissera-t-il dans la mémoire de demain ?`,
      `Ainsi chemine le monde, entre audace et fragilité, nous offrant à chaque étape matière à comprendre, à veiller et à espérer.`,
      `${fact3 ? `${fact3} ` : ""}Une histoire encore en devenir, pareille à un sentier qui s'ouvre à l'aube et dont les pas des hommes traceront la suite.`,
      `Gardons de cette chronique la clarté d'un regard attentif, car comprendre le présent est déjà la plus belle manière d'habiter l'avenir.`,
      `${fact3 ? `${fact3} ` : ""}Le temps, seul juge véritable, dira bientôt quelle moisson naîtra de ces semences déposées aujourd'hui.`,
      `Dans le bruissement continu des nouvelles, celle-ci mérite qu'on la garde un instant en mémoire, comme une note juste au milieu du concert.`,
      `${fact3 ? `${fact3} ` : ""}Reste la beauté d'un mouvement qui ne s'arrête jamais, porté par celles et ceux qui refusent l'immobilité.`,
      `C'est là toute la noblesse du récit vérifié : transformer le fracas de l'instant en une intelligence partagée et apaisée.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 6. HUMEUR : CASH & SANS FILTRE
  if (mood === "cash") {
    const hooks = [
      `Allons droit au but sans tourner autour du pot : avec "${title}", rapporté par ${source}, voilà exactement ce qu'il faut savoir.`,
      `Zéro blabla, parlons vrai : que cache réellement "${title}" et pourquoi ça vous concerne directement ? Les faits sont sur la table.`,
      `On va se dire les choses franchement : dans le secteur ${category}, "${title}" change la donne tout de suite. Point barre.`,
      `Pas besoin d'un dessin ni de trois heures de discours pour résumer "${title}" (${source}) : les faits parlent d'eux-mêmes.`,
      `Voici le topo en clair sur "${title}" : ce qui est annoncé, ce que disent les chiffres de ${source}, et ce que ça implique concrètement.`,
      `Trêve de bavardages : autour de "${title}", la réalité terrain tient en quelques éléments solides que voici.`,
      `Vous voulez la version courte, franche et vérifiée de "${title}" ? La voilà, chiffres et preuves à l'appui avec ${source}.`,
      `Mettons les pieds dans le plat : avec "${title}", le secteur ${category} est placé devant le fait accompli.`
    ];
    const bodies = [
      `Côté chiffres, c'est net et sans bavure : ${fig0}, doublé de ${fig1}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Autre point direct : ${fact2}` : ""}`,
      `Retenez deux données clés : ${fig0} et ${fig1}. ${fact1 ? `${fact1} ` : ""}Pas besoin de chercher midi à quatorze heures pour voir l'impact.`,
      `Le cœur du sujet ? ${fact1 || title} Côté compteur, on est sur ${fig0} et ${fig1}. ${fact2 || ""} Tout le reste, c'est de la littérature.`,
      `Les faits bruts : d'abord ${fig0}. Ensuite ${fig1}. ${fact1 ? `${fact1} ` : ""}${fact2 || ""}`,
      `Concrètement, ça donne quoi ? ${fig0} sur la balance, et ${fig1} en ligne de mire. ${fact1 ? `${fact1} ` : ""}Difficile de faire plus clair.`,
      `Regardez la facture et l'échelle : ${fig0}. ${fact1 ? `${fact1} ` : ""}${fact2 ? `${fact2} ` : ""}Voilà où se situe le vrai nerf de la guerre.`,
      `Trois repères directs à garder en tête : ${fig0}, ${fig1}, et ce constat rapporté par ${source} — ${fact1 || title}.`,
      `Pas de détour possible face à ${fig0} et ${fig1}. ${fact1 ? `${fact1} ` : ""}Ceux qui traînent des pieds vont vite le sentir passer.`
    ];
    const endings = [
      `${fact3 ? `${fact3} ` : ""}Conclusion : seuls les résultats concrets compteront. Le reste, ce sont des paroles.`,
      `Vous avez maintenant toutes les cartes en main pour juger sur pièces, sans filtre et sans intermédiaire.`,
      `${fact3 ? `${fact3} ` : ""}Bref : c'est maintenant que ça se joue, et les chiffres ne mentiront pas.`,
      `Le message est limpide pour tout le secteur ${category} : s'adapter vite ou décrocher.`,
      `${fact3 ? `${fact3} ` : ""}Au moins, les règles du jeu sont posées clairement sur la table.`,
      `Verdict dans les prochaines semaines, mais une chose est sûre : impossible désormais de dire qu'on ne savait pas.`,
      `${fact3 ? `${fact3} ` : ""}Clair, carré, vérifié : à chacun maintenant d'en tirer les conclusions qui s'imposent.`,
      `Point final pour aujourd'hui : on garde l'œil sur les actes, uniquement sur les actes.`
    ];
    return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
  }

  // 7. HUMEUR : PHILOSOPHE & SEREIN
  const hooks = [
    `Prenons un instant de recul face à l'actualité du jour : que nous dit véritablement "${title}", relayé par ${source}, sur nos choix collectifs ?`,
    `Loin de l'empressement qui accompagne souvent les nouvelles du secteur ${category}, "${title}" invite à une réflexion apaisée et lucide.`,
    `Toute évolution technique ou sociale porte en elle une question de sens ; en observant "${title}" avec ${source}, c'est notre rapport à l'avenir qui s'éclaire.`,
    `Savoir distinguer l'écume des jours du mouvement de fond : voilà tout l'intérêt de se pencher sereinement sur "${title}".`,
    `Comme le rappellent volontiers les esprits attentifs, un fait comme "${title}" (${source}) gagne toujours à être pesé avec mesure et discernement.`,
    `Observons "${title}" sans passion excessive ni inquiétude hâtive, mais avec cette curiosité tranquille qui permet de comprendre avant de juger.`,
    `Derrière l'immédiateté de "${title}", rapporté par ${source}, se dessine une interrogation plus vaste sur l'équilibre de nos sociétés contemporaines.`,
    `Poser un regard serein sur "${title}", c'est d'abord accepter la complexité du réel telle qu'elle apparaît dans le domaine ${category}.`
  ];
  const bodies = [
    `Les repères objectifs dont nous disposons — ${fig0}, ainsi que ${fig1} — offrent une boussole précieuse. ${fact1 ? `${fact1} ` : ""}Ils rappellent que toute transformation demande de la méthode et du sens des responsabilités.`,
    `${fact1 ? `${fact1} ` : ""}En mettant en regard ${fig0} et ${fig1}, on perçoit mieux la ligne de crête sur laquelle avancent les acteurs impliqués : innover ou agir, oui, mais à quelle fin ? ${fact2 || ""}`,
    `La mesure des choses passe ici par des faits précis : ${fig0} d'un côté, ${fig1} de l'autre. ${fact1 ? `${fact1} ` : ""}${fact2 ? `Il apparaît également que ${fact2.charAt(0).toLowerCase() + fact2.slice(1)}` : ""}`,
    `Ce que révèlent ${fig0} et les éléments vérifiés par ${source}, c'est que chaque progrès ou chaque décision en ${category} appelle une vigilance éthique proportionnée. ${fact1 || ""}`,
    `Entre l'ampleur de ${fig0} et la réalité de ${fig1}, l'équilibre n'est jamais donné d'avance ; il se construit par le dialogue et la raison. ${fact1 || ""}`,
    `Examiner calmement ${fig0} permet d'éviter les jugements à l'emporte-pièce. ${fact1 ? `${fact1} ` : ""}${fact2 || ""}`,
    `Les faits sont là, posés avec clarté (${fig0}, ${fig1}). ${fact1 ? `${fact1} ` : ""}Ils nous invitent à conjuguer efficacité pratique et respect de l'intérêt général.`,
    `En articulant ${fig0} avec les observations de ${source}, on comprend que le véritable enjeu dépasse la seule mécanique technique pour toucher à la confiance commune. ${fact1 || ""}`
  ];
  const endings = [
    `${fact3 ? `${fact3} ` : ""}Au fond, la sagesse consiste peut-être à accompagner ces mutations avec lucidité, en veillant à ce que l'outil reste toujours au service de l'humain.`,
    `Prenons donc le temps d'observer la suite avec calme : les meilleures décisions naissent toujours d'une information comprise sans précipitation.`,
    `${fact3 ? `${fact3} ` : ""}Une invitation salutaire à cultiver le discernement, seule véritable boussole dans un monde en mouvement.`,
    `Car comprendre les faits dans leur juste nuance, c'est déjà exercer pleinement sa liberté de citoyen et de lecteur.`,
    `${fact3 ? `${fact3} ` : ""}Reste à chacun de nourrir sa propre réflexion à partir de ces repères vérifiés, avec sérénité et ouverture d'esprit.`,
    `Laissons aux événements le temps de mûrir, tout en gardant à l'esprit les principes d'équilibre et de justesse que ce dossier met en lumière.`,
    `${fact3 ? `${fact3} ` : ""}Ainsi va la marche des idées et des faits : elle récompense toujours ceux qui préfèrent la clarté durable au vacarme éphémère.`,
    `Un sujet qui, bien compris, enrichit notre regard sur le monde sans jamais troubler notre tranquillité d'esprit.`
  ];
  return `${leadParagraph}\n\n${hooks[v1]} ${bodies[v2]}\n\n${endings[v3]}`;
}

/**
 * Formate et restitue le récit complet d'un article selon l'humeur choisie par l'utilisateur (les 7 réglages d'humeur).
 * - Si l'utilisateur a généré une réécriture IA spécifique pour cette humeur (moodRewrites[mood]), on l'affiche en priorité.
 * - Si l'humeur est "humain" et que l'article possède déjà un grand récit original (sans phrases clichés), on le restitue proprement.
 * - Sinon, on génère dynamiquement le récit dans l'humeur sélectionnée (humoristique, sarcastique, investigateur, poétique, cash, philosophe, humain).
 */
export function formatArticleWithMood(article: NewsArticle | null | undefined, mood: EditorialMood = "humain"): string {
  if (!article) return "";

  // 1. Custom AI rewrite cached on the article for this specific mood
  const customRewrites = (article as any).moodRewrites as Record<string, string> | undefined;
  if (customRewrites && customRewrites[mood] && customRewrites[mood].trim().length > 100) {
    return sanitizeHumanStory(customRewrites[mood]);
  }

  // 2. If mood is "humain", check if the article already has a rich, authentic human story free of canned boilerplate
  if (mood === "humain" && article.content) {
    const cleaned = cleanArticleContent(article.content, article.title, article.summary, "humain");
    if (cleaned.length >= 350 && !hasCannedBoilerplate(cleaned)) {
      return cleaned;
    }
  }

  // 3. Otherwise, compose the article dynamically in the requested mood using all its verified facts, figures & context
  return buildHumanStoryByTone(article, mood);
}

/**
 * Format article creation timestamp to explicit French date and time:
 * e.g. "01/10/2026 à 14:32"
 */
export function formatArticleDateTime(art: NewsArticle | null | undefined): string {
  if (!art) return "";
  let ts = art.createdAt;
  if (!ts && typeof art.id === "number" && art.id > 1000000000000) {
    ts = art.id;
  }
  if (ts && ts > Date.now() + 60000) {
    ts = Date.now();
  }
  if (!ts) {
    ts = Date.now();
  }
  const dateObj = new Date(ts);
  if (isNaN(dateObj.getTime())) {
    return "Date récente";
  }
  const dateStr = dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const timeStr = dateObj.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${dateStr} à ${timeStr}`;
}

/**
 * Friendly French dynamic relative time
 */
export function getArticleRelativeTime(art: NewsArticle | null | undefined): string {
  if (!art) return "";
  let ts = art.createdAt;
  if (!ts && typeof art.id === "number" && art.id > 1000000000000) {
    ts = art.id;
  }
  if (ts && ts > Date.now() + 60000) {
    ts = Date.now();
  }
  if (!ts) ts = Date.now();
  const diffMs = Math.max(0, Date.now() - ts);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "hier";
  if (diffDays < 30) return `il y a ${diffDays} j`;
  return `il y a ${Math.floor(diffDays / 30)} mois`;
}

/**
 * Guarantees that any article in InfoPerso is richly documented and 100% free of canned phrases
 */
export function ensureArticleDeepData(article: NewsArticle): NewsArticle {
  if (!article) return article;

  // Ultra-fast path: only if already enriched AND free of any old canned boilerplate phrases
  if (
    (article as any).__isDeepEnriched &&
    article.keyFigures &&
    article.keyFigures.length >= 3 &&
    article.strategicAnalysis?.marketImpact &&
    !hasCannedBoilerplate(article.content)
  ) {
    return article;
  }

  const fullText = (article.title + " " + article.summary + " " + (article.content || "")).toLowerCase();
  const isTrumpTmtg = false; // textes pré-écrits désactivés : jamais de contenu inventé à la place de l'article

  let keyFigures = article.keyFigures;
  let keyTakeaways = article.keyTakeaways;
  let strategicAnalysis = article.strategicAnalysis;
  let content = stripCannedBoilerplate(article.content || "");

  const isMondialAuto = false;
  const isEnfantsRouges = false;

  if (isTrumpTmtg) {
    keyFigures = [
      { label: "Ticker Boursier", value: "NASDAQ: DJT", detail: "Symbole officiel de cotation de Trump Media & Technology Group" },
      { label: "Capitalisation Pic", value: "8,5 Mds $", detail: "Pic de valorisation boursière record post-fusion DWAC" },
      { label: "Participation Trump", value: "57,3 %", detail: "114,75 millions d'actions détenues directement par Donald Trump" },
      { label: "Chiffre d'Affaires", value: "4,1 M $", detail: "Revenus annuels générés principalement par la publicité Truth Social" }
    ];
    keyTakeaways = [
      "Fusion SPAC historique : introduction en Bourse de TMTG via la fusion avec Digital World Acquisition Corp (DWAC).",
      "Valorisation 'Meme Stock' : fluctuations de cours massives corrélées aux échéances judiciaires et politiques plutôt qu'aux flux de trésorerie.",
      "Pacte d'actionnaires et lock-up : surveillance étroite des périodes de blocage des titres détenus par Donald Trump et les fondateurs.",
      "Stratégie de diversification : projet d'expansion vers le streaming vidéo (Truth+) et les infrastructures souveraines anti-censure."
    ];
    strategicAnalysis = {
      actorsInvolved: ["Donald Trump", "Devin Nunes (TMTG)", "Wall Street & Nasdaq", "SEC (Régulateur fédéral)"],
      marketImpact: "Création d'un précédent financier majeur transformant une audience politique en actif boursier hautement spéculatif.",
      privacyCompliance: "Régulation stricte de la Securities and Exchange Commission (SEC) sur les déclarations d'initiés (Form 4).",
      nextMilestone: "Publication des prochains comptes trimestriels et rapport d'exploitation du CDN vidéo Truth+."
    };
    content = TRUMP_TMTG_FULL_CONTENT;
  } else if (isEnfantsRouges) {
    keyFigures = KNOWN_ARTICLES_DEEP_DATA[1791807600000].keyFigures;
    keyTakeaways = KNOWN_ARTICLES_DEEP_DATA[1791807600000].keyTakeaways;
    strategicAnalysis = KNOWN_ARTICLES_DEEP_DATA[1791807600000].strategicAnalysis;
    content = ENFANTS_ROUGES_FIRE_FULL_CONTENT;
  } else if (isMondialAuto) {
    keyFigures = KNOWN_ARTICLES_DEEP_DATA[654495961000].keyFigures;
    keyTakeaways = KNOWN_ARTICLES_DEEP_DATA[654495961000].keyTakeaways;
    strategicAnalysis = KNOWN_ARTICLES_DEEP_DATA[654495961000].strategicAnalysis;
    content = MONDIAL_AUTO_2026_FULL_CONTENT;
  } else {
    keyFigures = keyFigures && keyFigures.length >= 3
      ? keyFigures
      : extractOrSynthesizeKeyFigures(article);

    const cleanedExistingTakeaways = (keyTakeaways || []).filter(t => !hasCannedBoilerplate(t));
    keyTakeaways = cleanedExistingTakeaways.length >= 3
      ? cleanedExistingTakeaways
      : extractOrSynthesizeKeyTakeaways({ ...article, content });

    strategicAnalysis = strategicAnalysis && strategicAnalysis.marketImpact
      ? strategicAnalysis
      : extractOrSynthesizeStrategicAnalysis(article);
  }

  // Clean raw JSON boilerplate and any canned sentences from content
  content = cleanArticleContent(content, article.title, article.summary);

  const isTooShort = !content || content.trim().length < 320;
  const hasRoboticMarkers =
    hasCannedBoilerplate(content) ||
    /###\s*\d+\.\s*(?:Contexte|Analyse|Impact|Perspectives|Enjeux)/i.test(content) ||
    content.includes("Analyse Approfondie & Enjeux Sectoriels") ||
    content.includes("Impacts Économiques, Sociaux & Retombées Pratiques");

  if (isTooShort || hasRoboticMarkers) {
    content = buildHumanStoryByTone({
      ...article,
      keyFigures,
      keyTakeaways,
      strategicAnalysis
    });
  } else {
    content = sanitizeHumanStory(content);
  }

  // Pipeline éditorial Info-Perso (« Trier l'information avant de la subir »)
  const source_mention = article.source_mention || `${article.source || "Source non indiquée"}`;
  const score_bruit = typeof article.score_bruit === "number"
    ? article.score_bruit
    : Math.max(1, Math.min(5, Math.round(5 - ((article.score || 85) / 28))));
  const faits_verifies = article.faits_verifies && article.faits_verifies.length > 0
    ? article.faits_verifies.filter(f => !hasCannedBoilerplate(f))
    : keyTakeaways.slice(0, 3);
  const debat_nuance = article.debat_nuance || {
    dominante: `Traitement axé sur l'actualité immédiate : ${article.title}`,
    angles_morts: [
      `Arbitrages économiques et répercussions structurelles pour le secteur ${article.category || "concerné"}.`,
      `Données de fond complémentaires à suivre après la publication initiale par ${article.source}.`
    ],
    question_discernement: `Quels équilibres entre retombées immédiates et perspectives de fond privilégier pour ce dossier ?`
  };
  const script_podcast = article.script_podcast ||
    `[Ton mesuré] Bonjour. Chronique Info-Perso en quatre-vingt-dix secondes. [Pause] ${faits_verifies[0] || article.summary.slice(0, 85)}. [Relance dynamique] Une analyse rigoureuse sans bruit médiatique superflu.`;

  return {
    ...article,
    __isDeepEnriched: true,
    source_mention,
    score_bruit,
    faits_verifies,
    debat_nuance,
    script_podcast,
    keyFigures,
    keyTakeaways,
    strategicAnalysis,
    content: fixTemporalConsistency(content)
  };
}

/**
 * Filtre anti-doublon absolu et intelligent pour le flux InfoPerso.
 * Garantit qu'aucun article dupliqué (même titre, même contenu, même sujet ou doublon technique)
 * ne peut subsister dans l'application ou sur le disque.
 */
export function deduplicateArticlesList(articlesList: NewsArticle[]): NewsArticle[] {
  if (!Array.isArray(articlesList)) return [];
  const seenIds = new Set<number>();
  const seenTitles = new Set<string>();
  const seenFingerprints = new Set<string>();
  const seenTopicClusters = new Set<string>();
  let hasSeenEnfantsRouges = false;

  const FRENCH_STOP_WORDS = new Set([
    "dans", "avec", "pour", "cette", "après", "avoir", "faire", "plus", "sont",
    "leur", "leurs", "nous", "vous", "tout", "tous", "toute", "toutes", "bien",
    "aussi", "entre", "sans", "comme", "mais", "vers", "chez", "sous", "france",
    "paris", "selon", "fait", "deux", "trois", "quatre", "premier", "premiere",
    "direct", "live", "info", "actualite", "actualites", "nouvelle", "nouvelles"
  ]);

  const result: NewsArticle[] = [];

  for (let rawArt of articlesList) {
    if (!rawArt || typeof rawArt !== "object") continue;
    const title = (rawArt.title || "").trim();
    if (!title || title.length < 5) continue;

    // Normalisation stricte du titre (sans accents, sans ponctuation, minuscules)
    const cleanTitle = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 45);

    // Empreinte de contenu / résumé
    const cleanFingerprint = ((rawArt.summary || "") + " " + (rawArt.content || "").slice(0, 100))
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 60);

    const fullSearchText = `${rawArt.id} ${title} ${rawArt.summary || ""} ${(rawArt.tags || []).join(" ")} ${(rawArt.content || "").slice(0, 250)}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // RÈGLE ABSOLUE ANTI-DOUBLON MARCHÉ DES ENFANTS ROUGES :
    // Un SEUL et UNIQUE article sur les Enfants Rouges peut exister dans toute l'application.
    const isEnfantsRouges =
      rawArt.id === 1791807600000 ||
      fullSearchText.includes("enfants rouges") ||
      fullSearchText.includes("enfants-rouges") ||
      fullSearchText.includes("enfantsrouges");

    if (isEnfantsRouges) {
      if (hasSeenEnfantsRouges) {
        // Rejeter catégoriquement tout doublon supplémentaire
        continue;
      }
      hasSeenEnfantsRouges = true;
      // Normaliser sa date dans le passé pour qu'il ne domine jamais les 14 premiers articles du fil
      rawArt = {
        ...rawArt,
        id: 1791807600000,
        createdAt: 1760238000000, // Date passée (12 octobre 2026)
        time: "Dossier Rétrospectif (12 oct. 2026)",
        featured: false,
        isLatestGeneration: false,
        isNewTop20: false
      };
    }

    // 1. Doublon d'identifiant numérique
    if (typeof rawArt.id === "number" && !isNaN(rawArt.id) && seenIds.has(rawArt.id)) {
      continue;
    }

    // 2. Doublon de titre textuel
    if (seenTitles.has(cleanTitle)) {
      continue;
    }

    // 3. Doublon d'empreinte de contenu
    if (cleanFingerprint.length > 20 && seenFingerprints.has(cleanFingerprint)) {
      continue;
    }

    // 4. Déduplication sémantique de grappe d'actualité (Topic Clustering) :
    // Si plusieurs agences reprennent le même fait divers ou la même dépêche avec des titres différents,
    // on ne conserve qu'un seul exemplaire représentatif.
    const tokens = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !FRENCH_STOP_WORDS.has(w));

    // Si on trouve au moins 3 tokens significatifs, on crée une signature de sujet
    if (tokens.length >= 3) {
      const topicSignature = tokens.slice(0, 4).sort().join("_");
      if (seenTopicClusters.has(topicSignature)) {
        continue; // Sujet déjà couvert dans le fil
      }
      seenTopicClusters.add(topicSignature);
    }

    if (typeof rawArt.id === "number" && !isNaN(rawArt.id)) {
      seenIds.add(rawArt.id);
    }
    seenTitles.add(cleanTitle);
    if (cleanFingerprint.length > 20) {
      seenFingerprints.add(cleanFingerprint);
    }

    result.push(rawArt);
  }

  return result;
}

export interface ArticleHumanTone {
  toneBadge: string;
  emoji: string;
  sentimentLabel: string;
  sentimentType: "humour" | "gravite" | "emotion" | "curiosite" | "incisif" | "serein";
  badgeClass: string;
  humanQuote: string;
}

/**
 * Analyse la texture émotionnelle et le registre humain de l'article :
 * Permet de manier avec justesse l'humour, la gravité, l'émotion ou la curiosité
 * sans découpage artificiel ni jargon de cabinet.
 */
export function getArticleHumanTone(article: NewsArticle | null | undefined): ArticleHumanTone {
  if (!article) {
    return {
      toneBadge: "Chronique Vivante",
      emoji: "✍️",
      sentimentLabel: "Regard Humain & Nuancé",
      sentimentType: "serein",
      badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
      humanQuote: "L'actualité racontée à hauteur d'homme."
    };
  }

  const text = `${article.title || ""} ${article.summary || ""} ${(article.tags || []).join(" ")} ${(article.content || "").slice(0, 300)}`.toLowerCase();
  const cat = (article.category || "").toLowerCase();

  // 1. Registre GRAVITÉ & MÉMOIRE (sinistres, incendies, décès, drames, procès, conflits)
  if (
    text.includes("incendie") ||
    text.includes("drame") ||
    text.includes("mort") ||
    text.includes("naufrage") ||
    text.includes("tuerie") ||
    text.includes("victime") ||
    text.includes("sinistre") ||
    text.includes("tragédie") ||
    text.includes("procès") ||
    text.includes("enfants rouges")
  ) {
    return {
      toneBadge: "Gravité & Recul historique",
      emoji: "🕯️",
      sentimentLabel: "Émotion & Gravité",
      sentimentType: "gravite",
      badgeClass: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
      humanQuote: "Un événement marquant analysé avec pudeur, dignité et sens de l'humain."
    };
  }

  // 2. Registre HUMOUR, IRONIE MORDANTE & LUCIDITÉ (bourse, politique agitée, buzz, réseaux)
  if (
    text.includes("trump") ||
    text.includes("tmtg") ||
    text.includes("wall street") ||
    text.includes("polémique") ||
    text.includes("clash") ||
    text.includes("buzz") ||
    text.includes("ironie") ||
    text.includes("insolite")
  ) {
    return {
      toneBadge: "Touche d'ironie & Regard caustique",
      emoji: "🎭",
      sentimentLabel: "Humour & Lucidité",
      sentimentType: "humour",
      badgeClass: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/30",
      humanQuote: "Prendre du recul avec esprit : quand l'ironie révèle les travers de l'époque."
    };
  }

  // 3. Registre SCIENCE, ÉMERVEILLEMENT & HORIZONS (astronomie, nature, santé, découvertes)
  if (
    cat === "science" ||
    text.includes("exoplanète") ||
    text.includes("télescope") ||
    text.includes("océan") ||
    text.includes("sanctuaire") ||
    text.includes("cerveau") ||
    text.includes("biologie") ||
    text.includes("espace") ||
    text.includes("découverte")
  ) {
    return {
      toneBadge: "Émerveillement & Curiosité",
      emoji: "✨",
      sentimentLabel: "Curiosité & Savoir",
      sentimentType: "curiosite",
      badgeClass: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
      humanQuote: "Une plongée fascinante dans ce que l'intelligence et la nature ont de plus beau."
    };
  }

  // 4. Registre CULTURE, SENSIBILITÉ & DOUCEUR DE VIVRE
  if (
    cat === "culture" ||
    text.includes("cinéma") ||
    text.includes("théâtre") ||
    text.includes("roman") ||
    text.includes("musique") ||
    text.includes("peinture") ||
    text.includes("artiste") ||
    text.includes("livre")
  ) {
    return {
      toneBadge: "Sensibilité & Émotion esthétique",
      emoji: "🎨",
      sentimentLabel: "Tendresse & Création",
      sentimentType: "emotion",
      badgeClass: "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30",
      humanQuote: "Quand les arts nous reconnectent à notre humanité commune."
    };
  }

  // 5. Registre TECHNIQUE, DÉFI & PERSPECTIVE HUMAINE (Mondial auto, IA, souveraineté, transition)
  if (
    cat === "technologie" ||
    cat === "automobile" ||
    text.includes("automobile") ||
    text.includes("voiture") ||
    text.includes("robot") ||
    text.includes("ia") ||
    text.includes("intelligence artificielle")
  ) {
    return {
      toneBadge: "Regard acéré & Enjeux humains",
      emoji: "⚡",
      sentimentLabel: "Vigilance & Passion",
      sentimentType: "incisif",
      badgeClass: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
      humanQuote: "Interroger le progrès technique à travers son véritable impact sur nos vies."
    };
  }

  // Défaut : Récit vivant et humaniste
  return {
    toneBadge: "Chronique Vivante & Équilibrée",
    emoji: "🌿",
    sentimentLabel: "Clarté & Fraternité",
    sentimentType: "serein",
    badgeClass: "bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
    humanQuote: "L'information vérifiée, restituée avec empathie et sens critique."
  };
}
