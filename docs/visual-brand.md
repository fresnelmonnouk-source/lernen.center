# Lernen.de — Visual Brand (Néo-Bauhaus brutaliste)

> Doc de contexte canonique « visual-brand » (bootstrap V4.2).
> Source de vérité **couleurs/typo/ombres** = `src/theme/tokens.ts`. **Source de vérité du mark** = `assets/brand/mark-master.svg`. Ce document formalise le monogramme et toute la chaîne logo → icône → splash → favicon.
> Auteur : Vincent (DA). **Statut mark : VALIDÉ par Fresnel** (mark master figé). Production Léo livrée — voir §7.
>
> ⚠️ **Mise à jour Léo (production)** : Fresnel a validé un mark **différent** de la géométrie « L massif monochrome + ombre » initialement esquissée par Vincent (ci-dessous §3, conservée pour mémoire de la démarche). Le **mark réel validé** est le **L Bauhaus déconstruit** décrit en **§3.0** (qui prime). Toutes les déclinaisons §5 et le manifeste §7 ont été réalignés sur ce mark réel.

---

## 1. Plateforme de marque (visuelle)

- **Promesse visuelle** : un coach d'allemand *sérieux, structuré, premium* — l'allemand comme une discipline qu'on maîtrise, pas un jeu mignon.
- **Personnalité** : Néo-Bauhaus brutaliste — géométrie pure, angles vifs, ombres dures, couleurs primaires franches, rigueur typographique. Crédible, mémorable, un peu sévère mais chaleureux par le cream.
- **Pédagogie signature dans l'ADN** : **der = bleu, die = rouge, das = vert**. Le système couleur n'est pas décoratif, il *enseigne*. Le mark peut porter cette signature.
- **Ce qu'on évite** : emojis, dégradés criards, mascotte, coins arrondis « soft », esthétique gamifiée type Duolingo, 3D glossy, néon. Si ça ressemble à une app de jeu mobile, c'est raté.

---

## 2. Système (rappel synthétique — réf. `tokens.ts`)

| Token | Valeur | Rôle |
|---|---|---|
| cream | `#F4F0E6` | fond de page / fond icône |
| ink | `#0A0A0A` | texte, **bordures**, **ombres** |
| red (die) | `#E63946` | accent / article *die* |
| yellow | `#FFD60A` | accent / brand-dot |
| blue (der) | `#1E40AF` | accent / article *der* |
| green (das) | `#16A34A` | accent / article *das* |

- **Ombre brutaliste** : offset dur **sans blur**. Valeurs px app : sm 2 / md 4 / lg 6 / xl 8. Ombre = `ink` derrière, surface décalée bas-droite. (`HardShadowBox.tsx`)
- **Bordures** : thin 1.5px / base **2.5px**. Toujours `ink`.
- **Angles** : **vifs, zéro border-radius** sur tout élément de marque. (Exception unique du système : le cercle décoratif `hero-bg-circle` — forme *géométrique pleine*, pas un arrondi de coin.)
- **Typo** : `Bricolage Grotesque 800 ExtraBold` (display/brand), `DM Serif Display Italic` (accents élégants : le `.de`), `JetBrains Mono 700` (labels techniques/eyebrows).
- **Grille** : trame 40px à ~2.5% ink (`GridBackground.tsx`).
- **Langage formel signature** (issu du `hero`) : surface **ink**, texte/forme **cream**, formes primaires pures qui **débordent du cadre** (cercle rouge top-right hors-champ, carré jaune rotated 15°), ombre dure. **L'icône hérite directement de ce langage.**

---

## 3.0 Le mark validé — « L Bauhaus déconstruit » ⭐ SOURCE DE VÉRITÉ

> Mark **figé et validé par Fresnel**. Fichier maître : `assets/brand/mark-master.svg` (viewBox `0 0 200 200`). **Cette géométrie prime sur §3.1–3.3** (qui documente la piste « L massif » antérieure, non retenue). On ne redessine pas le mark : on le **dérive**.

### Concept
Le L n'est pas un glyphe plein : c'est une **lettre Bauhaus déconstruite** en 3 formes primaires (les 3 couleurs primaires de l'école), assemblées en équilibre dynamique. Le L se *lit* sans être tracé littéralement — montant + base suffisent, l'œil complète. Métaphore : apprendre une langue, c'est **assembler des éléments simples en structure**.

### Géométrie précise (canvas de référence 200×200, origine top-left)

| Élément | Description | Coordonnées (échelle 200) | Couleur |
|---|---|---|---|
| **Fond** | cream plein | `0,0 → 200,200` | `#F4F0E6` |
| **Quart-de-cercle rouge** | ancré au coin **haut-droite**, rayon 96 | `M200 0 V96 A96 96 0 0 1 104 0 Z` | `#E63946` |
| **Montant vertical bleu** | la jambe du L | `x44 y44 w40 h112` (x44–84 / y44–156) | `#1E40AF` |
| **Pied jaune** | la base du L, **incliné −8°** | rect `x84 y112 w72 h44`, `rotate(-8 120 132)` | `#FFD60A` |

- **Ordre des calques** : fond → quart-cercle rouge → montant bleu → pied jaune.
- **Le seul arrondi toléré** = le quart-de-cercle / disque rouge (intrinsèque au mark) + la **tuile squircle UNIQUEMENT dans le splash sombre**. Partout ailleurs : angles vifs, zéro `rx`/`ry`.
- **Pas d'ombre dure** dans le mark validé (contrairement à la piste §3.2) : l'équilibre des 3 formes porte seul l'identité.
- **Couleurs** = trio primaire Bauhaus strict (bleu/rouge/jaune) sur cream. Aucune couleur hors `tokens.ts`.

### Comportement du quart-cercle selon le support
- **iOS** : le quart-cercle rouge est **ancré au coin haut-droite**. Le masque squircle iOS (~22%) le transforme en joli coin arrondi rouge → effet voulu, on garde.
- **Android adaptive / splash / monochrome** : le coin serait **amputé** par le masque ou perdrait son ancrage hors zone de sécurité. → le rouge devient un **disque/pétale flottant détaché**, posé en haut-droite du L (look « splash clair »). Même signifiant (la touche rouge *die*), placement sûr.

---

## 3. Le monogramme « L brutaliste » *(piste antérieure — non retenue, conservée pour mémoire)*

> ⚠️ La géométrie ci-dessous (L massif monochrome + ombre dure offset) était la **proposition initiale de Vincent**. Elle **n'a pas été retenue** : Fresnel a validé le « L Bauhaus déconstruit » de §3.0. Conservée ici pour la traçabilité de la démarche DA.

### 3.1 Concept & rationale
- **Pourquoi un L** : initiale de **L**ernen, déjà la lettre-héros du wordmark (`LERNEN.de`). Un L est la lettre la plus *architecturale* de l'alphabet : deux traits orthogonaux = un angle droit pur = Bauhaus à l'état brut. Aucune courbe, aucune ambiguïté à 48px.
- **Pourquoi brutaliste** : le L massif + ombre dure offset *est* la signature du design system appliquée à une seule lettre. Le mark ne fait que concentrer l'identité, il ne crée pas de langage nouveau.
- **Le sens caché (l'idée)** : le L est aussi une **équerre / un fondement** — la base horizontale qui ancre le montant vertical. Métaphore de l'apprentissage structuré : on construit sur des bases solides. C'est exactement la promesse (coach structuré, pas gadget).
- **Cohabitation avec le wordmark** : le monogramme = version compacte (icône, favicon, avatar). Le wordmark `LERNEN.de` (`BrandMark.tsx`) reste la signature longue. En lockup, les deux s'assemblent (cf. §5.6). On ne touche PAS au wordmark existant.

### 3.2 Construction géométrique PRÉCISE (canvas de référence 1000×1000)

> Tout est exprimé en unités sur un **canvas 1000×1000** (origine top-left, y vers le bas). Léo dérive le SVG sans interprétation. Pour un viewBox différent, tout se met à l'échelle linéairement.

**Marge de sécurité interne** : le L vit dans une boîte centrée. Les corps colorés et l'ombre restent **dans** le canvas (zéro débord pour la version icône) — voir §6 pour les seuils Android.

**Le L = deux rectangles (corps), angles vifs :**

| Élément | x début | x fin | y début | y fin | largeur | hauteur |
|---|---|---|---|---|---|---|
| **Montant vertical** | 300 | 460 | 160 | 840 | **160** | 680 |
| **Base horizontale** | 300 | 740 | 680 | 840 | 440 | **160** |

- Les deux rectangles se **chevauchent** dans la zone `x 300..460 / y 680..840` → le L est une seule forme pleine continue (union), pas deux pièces disjointes. **Épaisseur de trait du L = 160 unités** (montant et base de même épaisseur = rigueur Bauhaus).
- **Empattement total du L** : largeur 440 (300→740), hauteur 680 (160→840). Centré horizontalement : marge gauche 300, marge droite 260 → le L est volontairement **calé à gauche** (ce qui est naturel pour un L et laisse l'ombre respirer à droite).

**L'ombre dure (offset, sans blur) :**
- Copie du L décalée de **+90 / +90** unités (offset proportionnel : 9% du canvas — *volontairement plus épais que les 4px de l'app*, car à 48px une ombre de 4px disparaît, cf. §6).
- Ombre dessinée **en premier** (dessous), couleur `ink #0A0A0A` (ou couleur dédiée selon variante §4), corps du L par-dessus.
- Ombre offsetée → elle déborde à droite jusqu'à `x 540..830` et en bas jusqu'à `y 770..930`. **Reste dans le canvas** (max 930 < 1000). OK iOS full-bleed.

**Le cadre (conteneur du mark) :**
- Fond **plein cream `#F4F0E6`** sur tout le canvas 1000×1000 (pas de transparence pour iOS/splash ; transparence autorisée uniquement pour le foreground Android et le lockup in-app).
- **Optionnel — liseré brutaliste** : pour les usages « tuile » (favicon, avatar), un cadre `ink` 2.5px-équivalent (= **25 unités** à l'échelle 1000) collé au bord intérieur, marge 0. À 1024px réel ça donne ~26px : net. **Décision : cadre présent sur favicon/avatar, ABSENT sur app icon iOS** (Apple masque déjà les bords, un cadre serait rogné).

**La brand-dot signature (rappel jaune) :**
- Petit **carré jaune `#FFD60A`** bordé ink, posé en **point du « i » manquant** — ici positionné en haut-droite du montant comme un sceau. Carré `x 600..720 / y 200..320` (120×120), bordure ink 20 unités. C'est le clin d'œil au `brand-dot` du header et au carré jaune du hero. **Optionnel selon variante** (présent sur la reco, absent sur la version mono).

### 3.3 Schéma de construction (grille)

```
   0    160   300  460  600  720  840   1000
0  ┌──────────────────────────────────────┐
   │                                        │   fond cream plein
160│        ███████                         │   ← montant: x300-460
   │        ███████   ▓▓▓▓                  │
200│        ███████   ▓▓▓▓ ← dot jaune 600-720
   │        ███████   ▓▓▓▓                  │
320│        ███████                         │
   │        ███████░░░░░░░                  │   ░ = ombre offset +90/+90
   │        ███████  ░░░░░░░                 │
680│        ███████████████████             │   ← base: x300-740 / y680-840
   │        ███████████████████             │
840│        ██████████████████░░░░░░        │
   │              ░░░░░░░░░░░░░░░░░░░        │   ombre base jusqu'à y930
930│              ░░░░░░░░░░░░░░░░░░░        │
   └────────────────────────────────────────┘
1000
```
*(Schéma indicatif — les nombres du tableau §3.2 font foi.)*

---

## 4. Variantes de couleur du mark (3 options)

> Fond **cream `#F4F0E6`** dans les 3 cas (cohérence app). La variable = la couleur du **corps du L** et de son **ombre**.

### Option A — « DER bleu / ombre ink » (le L savant) ⭐ **RECOMMANDÉE**
- Corps du L : **bleu `#1E40AF`** (couleur de *der*, l'article masculin — porte la pédagogie signature).
- Ombre : **ink `#0A0A0A`**.
- Dot : **jaune `#FFD60A`** bordée ink. Liseré : ink.

```
┌───────────────────────┐
│   ▐▌                   │   ▐▌ = L bleu #1E40AF
│   ▐▌   ▣  ← dot jaune  │   ░  = ombre ink
│   ▐▌▗▖                 │   fond cream
│   ▐▌▗▖                 │
│   ▐▙▟▙▟▖               │
│    ░░░░░░              │
└───────────────────────┘
```
- **Usage couleur exact** : fond `#F4F0E6` / L `#1E40AF` / ombre `#0A0A0A` / dot fill `#FFD60A` + stroke `#0A0A0A`.
- **Pourquoi je la recommande** : le bleu = couleur *der*, donc le mark **enseigne dès le premier regard** (cohérence pédagogie signature). Le bleu sur cream est premium, calme, crédible (≠ rouge agressif, ≠ noir banal). L'ombre ink ancre le brutalisme. Contraste L/fond ≈ **8.6:1** (AA large + AAA texte). C'est la seule variante qui raconte *à la fois* la marque ET la méthode.

### Option B — « ink / ombre rouge » (le L brut)
- Corps du L : **ink `#0A0A0A`**. Ombre : **rouge `#E63946`** (= *die*, l'accent vif de l'app).
- Dot : **jaune** bordée ink.

```
┌───────────────────────┐
│   ██                   │   ██ = L ink
│   ██   ▣               │   ▒  = ombre rouge #E63946
│   ██▒▒                 │
│   ██▒▒                 │
│   ███████▒             │
│    ▒▒▒▒▒▒              │
└───────────────────────┘
```
- **Usage** : fond `#F4F0E6` / L `#0A0A0A` / ombre `#E63946` / dot `#FFD60A` + stroke ink.
- **Pourquoi pas en reco** : très fort, très « brut », mais le rouge en ombre peut lire « erreur/alerte » et l'ink massif est moins distinctif au store (beaucoup de logos noirs). Excellente alternative si Fresnel veut maximum d'impact/agressivité.

### Option C — « tricolore der-die-das » (le L pédagogique)
- Le L découpé en **3 bandes horizontales** portant les 3 articles : montant haut bleu, milieu rouge, base verte. Ombre ink.
- Découpe : tiers verticaux du montant — bleu `y160..387`, rouge `y387..613`, vert `y613..840` (la base hérite du vert).

```
┌───────────────────────┐
│   ▐▌  der (bleu)       │
│   ▐▌   ▣               │
│   ▐▌  die (rouge)      │
│   ▐▌                   │
│   ▐▟▟▟▟▟  das (vert)   │
│    ░░░░░░              │
└───────────────────────┘
```
- **Usage** : fond cream / bandes `#1E40AF` `#E63946` `#16A34A` / ombre ink / dot jaune.
- **Pourquoi pas en reco** : raconte parfaitement la pédagogie, MAIS **3 couleurs + ombre + dot jaune + cream = 5 couleurs** → bruit visuel, perd en lisibilité à 48px (les bandes se confondent), et viole « less but better ». À garder comme **motif d'illustration / splash animé** plutôt que comme icône permanente.

### Verdict
**Option A (DER bleu / ombre ink / dot jaune).** Elle est la seule à être *simultanément* : distinctive au store, porteuse de la pédagogie signature, lisible à 48px (2 couleurs fortes + 1 ponctuation jaune), et 100% raccord avec le langage du hero. **C'est la question à poser à Fresnel : A (reco), B ou C ?**

---

## 5. Déclinaisons

> Toutes dérivées du canvas 1000×1000 de §3. Couleurs = variante validée (par défaut A).

> ⚠️ Déclinaisons **réalignées sur le mark validé §3.0** (le « L Bauhaus déconstruit »). Les mentions « ombre +90 », « dot jaune », « union du L » de la piste antérieure ne s'appliquent pas.

### 5.1 App icon iOS — `icon-ios.svg` (1024×1024, plein cadre, sans transparence)
- Fond cream plein bord-à-bord. **Pas de liseré** (Apple masque ~22% des coins en squircle).
- Mark = master §3.0 mis à l'échelle ×5.12 (200→1024). **Quart-cercle rouge ancré coin haut-droite** : le masque iOS le transforme en coin arrondi rouge (voulu).
- Aucune transparence, aucun `rx`. Aucune ombre.

### 5.2 Android adaptive — 3 calques séparés (canvas 108dp = 1024² SVG)
> **Zone de sécurité Android** : seuls les **~66% centraux** sont garantis (cercle/squircle ~72dp sur 108dp). Le système masque/croppe le reste. **Tout le mark doit tenir dans ce disque central** (≈ carré `174..850`).

- **`adaptive-foreground.svg`** (transparent) : mark **scalé ~0.62 et centré** dans la zone de sécurité. Le quart-cercle rouge devient un **disque flottant détaché** posé en haut-droite du L (jamais coupé). Transform : `translate(192 196) scale(3.18)` sur la géométrie master. Background = calque séparé.
- **`adaptive-background.svg`** (plein) : **cream `#F4F0E6` uni** bord-à-bord. *(Pas de grille : le masquage circulaire couperait la trame.)* Filet de sécurité — `app.json` gère déjà `backgroundColor`.
- **`adaptive-monochrome.svg`** (Android 13+ icônes thémées) : **silhouette mono fill `#000`** (le système la teinte), même cadrage que le foreground (`scale 3.18`, centré). Silhouette = L (montant + pied incliné) **+ disque** rendu en silhouette → le glyphe reste lisible « L + point ». Fond transparent.

### 5.3 Splash OS — `splash-mark.svg` (expo-splash-screen)
- **Mark seul, centré, sur fond TRANSPARENT** (carré 1024²). Posé sur cream (clair) / ink (sombre) par le système via `backgroundColor`.
- Composition « splash clair » : disque rouge en **pétale flottant détaché**, formes directes. `translate(146 158) scale(3.6)`.

### 5.3-bis Splash-screens composés — `splash-screen-light.svg` / `splash-screen-dark.svg` (1080×2340)
- Compositions portrait complètes validées par Fresnel (mark + wordmark + tagline + carré jaune + barre de progression). Voir détail des deux ambiances en fin de §5.
- Polices : `font-family` avec fallback générique (Bricolage→Arial Black ; DM Serif→Georgia ; JetBrains→Courier). **Kody gère la fidélité finale des polices au rendu** (composant RN ou embed).

### 5.4 Favicon — `favicon.svg` (cibles 16/32/48px)
- **Mark complet conservé** (il tient) : fond cream plein, **quart-cercle rouge ancré coin haut-droite** (marqueur le plus fort en petit), montant bleu + pied jaune. Canvas carré 64. Pas de grille, pas d'ombre.

### 5.5 Détail des deux splash-screens composés

**SPLASH CLAIR** (`splash-screen-light.svg`) : fond cream + grille discrète (pas 40px, ink ~7%). Cercle rose pâle `#F3D4D4` débordant coin haut-gauche. Mark **sans tuile** (formes directes, disque rouge en pétale flottant). Wordmark `LERNEN.de` (LERNEN ink / `.de` rouge serif italic). Tagline `APPRENDS L'ALLEMAND` mono gris letter-spaced. Carré **jaune pâle** `#FBE8A6` incliné +14° débordant le bord droit. Barre de progression ~55% en ink sur gris clair `#DDD3B8`.

**SPLASH SOMBRE** (`splash-screen-dark.svg`) : fond ink `#0A0A0A`. Cercle maroon `#7A2630` débordant coin haut-gauche. Mark dans une **tuile cream squircle** (rx 86 — *seul arrondi toléré, spécifique splash sombre*) contenant le mark complet (quart-cercle rouge au coin haut-droite de la tuile, montant bleu, pied jaune). Wordmark `LERNEN` cream / `.de` rouge italic. Tagline mono gris. Carré **jaune vif** `#FFD60A` incliné débordant le bord droit. Barre de progression ~55% jaune sur gris foncé `#242424`.

### 5.6 Lockup logo in-app — `lockup-horizontal`
- **Monogramme (variante A, taille réduite) + wordmark `LERNEN.de`** côte à côte, alignés sur la baseline du wordmark.
- Gabarit : hauteur du monogramme = hauteur des capitales de `LERNEN` × ~1.15. Gap entre mark et wordmark = largeur d'1 lettre « E ».
- Le wordmark reste **rendu par `BrandMark.tsx`** (Bricolage 800 + `.de` DM Serif italic rouge) — Léo livre le monogramme en SVG, Kody l'assemble avec le composant existant. **Léo ne reproduit pas le wordmark en SVG** (on garde la source de vérité texte).
- Variante empilée `lockup-stacked` (mark au-dessus, wordmark dessous, centrés) pour formats verticaux.

---

## 6. Stratégie petite taille (≤ 48px)

À 48px, **1 unité du canvas 1000 = 0.048px** → l'ombre de 90 unités ≈ 4.3px (visible, voulu), mais la dot de 120 unités ≈ 5.8px (limite) et un liseré de 25 unités ≈ 1.2px (disparaît).

Règles de simplification, par palier :
- **≥ 96px** : mark complet (L + ombre +90 + dot + cadre si tuile).
- **48–96px** : **drop le cadre/liseré** ; garder L + ombre + dot.
- **32–48px** : **drop la dot** ; garder L + ombre (ombre = la signature qui survit). C'est la version launcher/store.
- **≤ 32px (favicon 16/32)** : **drop l'ombre ET la dot** → L plein encadré, max contraste (L bleu ou ink sur cream + cadre ink). Cf. §5.4.

Principe directeur : **l'ombre dure est la dernière chose qu'on sacrifie au-dessus de 32px** (c'est elle qui dit « brutaliste »), mais on la rend **proportionnellement plus épaisse (90 unités = 9%)** que l'app (4px) précisément pour qu'elle survive au launcher.

---

## 7. Manifeste de livraison pour Léo (fichiers SVG exacts)

> Tous en SVG, fond explicite (pas de transparence sauf mention). `viewBox` indiqué. Couleurs = **variante validée par Fresnel** (par défaut **A** : L `#1E40AF`, ombre `#0A0A0A`, dot fill `#FFD60A` stroke `#0A0A0A`, fond `#F4F0E6`). Angles vifs partout, zéro `rx`/`ry`. Géométrie = tableau §3.2.

> ✅ **LIVRÉ par Léo** (production sur mark validé §3.0). 8 fichiers dans `assets/brand/`. Couleurs = hex littéraux de `tokens.ts`. Zéro blur/gradient. Seul arrondi : quart-cercle/disque rouge (intrinsèque) + tuile squircle du splash sombre.

| # | Fichier | viewBox | Contenu | Fond | Usage |
|---|---|---|---|---|---|
| 0 | `mark-master.svg` | 0 0 200 200 | Mark validé : fond + quart-cercle rouge + montant bleu + pied jaune. **Source de vérité.** | cream plein | Référence — ne pas modifier. |
| 1 | `icon-ios.svg` | 0 0 1024 1024 | Master ×5.12, plein cadre. Quart-cercle rouge ancré coin haut-droite. | cream plein | App icon iOS. Aucune transparence, aucun arrondi de coin. |
| 2 | `adaptive-foreground.svg` | 0 0 1024 1024 | Mark scalé 0.62 centré zone de sécurité, disque rouge flottant détaché. | **transparent** | Calque avant Android adaptive. |
| 3 | `adaptive-background.svg` | 0 0 1024 1024 | Cream `#F4F0E6` uni bord-à-bord. | cream plein | Calque arrière Android (filet sécurité). |
| 4 | `adaptive-monochrome.svg` | 0 0 1024 1024 | Silhouette mono fill `#000` (L + disque), cadrage foreground. | **transparent** | Icône thémée Android 13+ (système la teinte). |
| 5 | `favicon.svg` | 0 0 64 64 | Mark complet, quart-cercle rouge ancré coin haut-droite. | cream plein | Favicon web, lisible 16–48px. |
| 6 | `splash-mark.svg` | 0 0 1024 1024 | Mark seul centré, disque rouge en pétale flottant. | **transparent** | Splash OS (posé sur cream/ink par le système). |
| 7 | `splash-screen-light.svg` | 0 0 1080 2340 | Composition splash clair complète (cf. §5.5). | cream + grille | Splash composé thème clair. |
| 8 | `splash-screen-dark.svg` | 0 0 1080 2340 | Composition splash sombre complète, tuile squircle (cf. §5.5). | ink | Splash composé thème sombre. |

**Wordmark** : tracé en `<text>` (font-family + fallback) dans les deux splash-screens composés pour fidélité de composition. La source de vérité texte reste `BrandMark.tsx` — **Kody gère la fidélité finale des polices** au rendu (embed ou composant RN).

**Format de remise** : SVG propre, couleurs en hex littéraux, pas de filtre/blur, ordre des calques = fond → quart-cercle rouge → montant bleu → pied jaune.

---

## 8. Do / Don't & critères d'acceptation

### Do
- ✅ Angles strictement vifs (zéro arrondi) sur le L, le cadre, la dot.
- ✅ Ombre **offset net sans blur**, +90/+90 sur canvas 1000.
- ✅ Couleurs **exactement** celles de `tokens.ts` (hex littéraux).
- ✅ Mark lisible et reconnaissable à 48px ET en N&B.
- ✅ Mark tient dans la zone de sécurité 66% pour le foreground Android.
- ✅ Cohérence totale avec le langage du `hero` (surface, formes pleines, ombre dure).

### Don't
- ❌ Aucun dégradé, blur, glow, ombre douce.
- ❌ Aucun border-radius / coin adouci.
- ❌ Pas d'emoji, pas de 3D, pas de mascotte.
- ❌ Pas plus de **3 couleurs + cream** sur l'icône finale (la dot jaune compte).
- ❌ Ne pas redessiner le wordmark en SVG (réservé à `BrandMark.tsx`).
- ❌ Pas de transparence sur icon-ios / splash / favicon.

### Critères d'acceptation (checklist Kody, post-Léo)
- [ ] `mark-master.svg` respecte au pixel les coordonnées §3.2 (montant 300-460/160-840, base 300-740/680-840, ombre +90/+90, dot 600-720/200-320).
- [ ] Toutes les couleurs = hex de `tokens.ts`, aucune valeur hors palette.
- [ ] `icon-ios.svg` : 1024², fond cream plein, aucune transparence, rien de vital <160u des bords.
- [ ] Les 3 calques Android livrés ; foreground tient dans `250..750` ; background cream uni ; monochrome = L seul, fill plein.
- [ ] `favicon.svg` lisible à 16px (test rasterisé) : on lit « L encadré ».
- [ ] Rendu N&B (`mark-mono.svg`) : le L + ombre restent lisibles.
- [ ] Aucun blur/gradient/radius nulle part (grep SVG : pas de `feGaussianBlur`, `rx`, `ry`, `gradient`).
- [ ] Test 48px launcher (Kody, émulateur Pixel_Fold) : le mark est reconnaissable.
- [ ] Validation finale Fresnel sur la variante couleur retenue.
```
