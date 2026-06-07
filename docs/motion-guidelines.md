# Lernen.de — Motion Guidelines

> Signature motion de la marque (Néo-Bauhaus brutaliste). Doc d'ingénierie motion réutilisable.
> Auteur : Hugo (motion). Source de vérité géométrie/couleurs = `docs/visual-brand.md` + `src/theme/tokens.ts`.
> Référence d'implémentation web : `docs/motion/splash-lernen.html` (DOM/SVG, horloge rAF, boucle 4,0 s).

---

## 0. Principe directeur

**Le motion brutaliste = le SNAP.** Pas de glissement mou, pas de fondu vaporeux : les éléments
**claquent** en place avec un léger overshoot, comme des pièces géométriques qu'on assemble.
L'easing signature est **`easeOutBack`** (overshoot visible). Tout le reste sert le rythme.

Règle d'or : **motion = sens, jamais décoration.** Chaque phase communique un état
(assemblage de la marque, lecture du wordmark, chargement) ou crée un rythme (cascade).

---

## 1. Easings — rôle de chacun

| Easing | Formule | Rôle dans la signature |
|---|---|---|
| `easeOutBack` | `1 + c3·(t-1)³ + c1·(t-1)²` (c1=1.70158, c3=c1+1) | **SIGNATURE « snap » brutaliste.** Overshoot = la pièce dépasse puis se cale. Mark scale, pied jaune, cascade lettres, pop `.de`. |
| `easeOutCubic` | `(t-1)³ + 1` | Entrées « propres » sans overshoot : fût bleu (descente), quart rouge (croissance). Décélère net. |
| `easeInOutCubic` | symétrique cubique | **Chargement** : accélère puis décélère → sensation de progression « réelle » qui se cale. |
| `linear` | `t` | Fondus d'opacité simples (tagline, piste loader, fondu de bouclage). Pas de courbe = neutre. |

> Règle de répartition : **entrées d'objets de marque → easeOutBack** (le snap).
> **Fondus d'opacité purs → linear.** **Progression mesurée (loader) → easeInOutCubic.**

---

## 2. Outil de séquencement : `seg(t, a, b, ease)`

Tout est piloté sur un **`t` ABSOLU en secondes** (0 → 4). Chaque phase = un segment `[a,b]` :
`seg` renvoie 0 avant `a`, 1 après `b`, et l'easing entre les deux. Pas de timeline impérative,
pas d'état caché → **déterministe** (rejouable, seekable). À transposer tel quel en Reanimated
(`interpolate` + `Easing` custom, ou un helper `seg` maison sur un `SharedValue` d'horloge).

---

## 3. Timeline du splash (durées absolues, s) — boucle 4,0 s

| Phase | Élément | Segment | Easing | Effet |
|---|---|---|---|---|
| Pose tuile | conteneur icône (opacity) | 0.15 → 0.32 | linear | apparition |
| Pose tuile | conteneur icône (scale 0.4→1) | 0.15 → 0.58 | **easeOutBack** | snap d'entrée |
| Settle | tuile (×1 + sin·0.03) | 1.45 → 1.70 | sin(seg·π) | micro-rebond « poids » |
| **Assemblage 1** | **fût bleu** (translateY −180→0) | 0.50 → 0.92 | easeOutCubic | descend du haut |
| **Assemblage 2** | **quart rouge** (scale 0→1 depuis coin H-D) | 0.80 → 1.20 | easeOutCubic | grandit du coin |
| **Assemblage 3** | **pied jaune** (translateX −150→0, +rotate −8°) | 1.05 → 1.55 | **easeOutBack** | glisse de la gauche, snap |
| Wordmark | lettres L-E-R-N-E-N (translateY 22→0, opacity) | 1.50 +i·0.05 → 1.80 +i·0.05 | **easeOutBack** | **cascade 50 ms/lettre** |
| Wordmark | suffixe `.de` (scale 0.4→1, opacity) | 1.88 → 2.18 | **easeOutBack** | pop final rouge |
| Tagline | `APPRENDS L'ALLEMAND` (opacity) | 2.20 → 2.65 | linear | fondu |
| Loader | piste (opacity) | 1.55 → 1.80 | linear | apparition |
| Loader | remplissage (width 0→280) | 1.60 → 2.95 | easeInOutCubic | progression |
| **Bouclage** | GROUPE splash (opacity 1→0) | 3.30 → 3.62 | linear | fondu → crème → reboucle |

**Ordre d'assemblage du mark à respecter (sens narratif : on bâtit le L) :**
`fût bleu (0.50)` → `quart rouge (0.80)` → `pied jaune (1.05)`. Les segments se chevauchent
volontairement → l'assemblage est fluide, pas saccadé.

**Cascade des lettres :** décalage de **50 ms par lettre** (`a = 1.50 + i·0.05`). Lit la marque
de gauche à droite comme une frappe. Chaque lettre monte de 22 px avec easeOutBack.

---

## 4. Décor permanent (hors fondu de bouclage)

Flottement parallaxe sur `t` absolu (sinusoïdal lent, **pas de seg**) — donne de la profondeur,
ne disparaît jamais, opacité figée :
- Disque rouge (op 0.14) : `translateY = sin(t·0.7)·12`
- Carré jaune 12° (op 0.20) : `translateY = cos(t·0.6)·14`
- Anneau bleu (op 0.12) : `translateY = −sin(t·0.7)·12` (contre-phase → parallaxe)

Barre de statut (`9:41` + glyphes) : toujours pleine opacité, hors groupe splash.

---

## 5. Accessibilité — `prefers-reduced-motion: reduce` (NON NÉGOCIABLE)

Si l'utilisateur demande la réduction du mouvement :
- **AUCUNE animation, AUCUNE boucle.**
- On rend directement **l'état final assemblé** : mark complet + `LERNEN.de` + tagline + loader plein.
- Implémentation web : on appelle `render(3.30)` (dernier instant avant le fondu de bouclage →
  tout est à pleine opacité). On ne lance pas le rAF.
- Transposition RN : détecter via `AccessibilityInfo.isReduceMotionEnabled()` et monter
  directement les composants dans leur état final (pas de `withTiming`/`withRepeat`).

---

## 6. Notes de transposition React Native / Reanimated

- **Horloge** : un `SharedValue` `clock` alimenté par `useFrameCallback` (ou `withRepeat(withTiming(4, {duration:4000, easing: Easing.linear}), -1)` sur une valeur 0→4), puis dériver chaque phase via `interpolate` ou un `seg` worklet.
- **Séparer `render(t)` de la boucle** : en RN, les `useAnimatedStyle` jouent le rôle de `render` — chacun lit l'horloge partagée. Garder la logique « état ← t » pure (worklets) pour rester déterministe et testable.
- **easeOutBack** : `Easing.bezier` ne reproduit pas l'overshoot fidèlement ; définir un worklet custom avec la formule exacte (`c1=1.70158`) pour conserver le snap signature.
- **Mark** : animer les transforms PAR forme (fût/quart/pied), pas le SVG entier — comme en web. Le quart rouge se scale depuis son ancre coin haut-droite (origine de transform = coin, pas centre).
- **Loader** : `width` animée → préférer `scaleX` sur RN (perf) avec `transformOrigin` gauche.
- **Boucle propre** : le fondu 3.30→3.62 ramène l'écran au crème pur AVANT le redémarrage → aucun saut visible. Conserver cette fenêtre de fondu en RN.
- **Performance** : 60 fps cible. Toutes les animations sont des transforms/opacity (composables GPU) — pas de layout. Tenir cette discipline en RN (jamais animer width/height en prod ; remplacer par scale).

---

## 7. Palette motion (rappel — aucune couleur hors liste)

Crème `#F4F0E6` · Ink `#0A0A0A` · Rouge/die `#E63946` · Jaune `#FFD60A` · Bleu/der `#1E40AF` · Gris texte `#6C6452`.
