# 🌾 Élevage & Vente Directe d'Animaux — Application Web Professionnelle

Application web moderne, fluide, responsive et dynamique conçue spécifiquement pour un éleveur professionnel indépendant spécialisé dans l'élevage et la vente d'animaux :
- **Lapins** (reproducteurs de race, chair, lapereaux)
- **Poulets & Volailles** (poulets bicyclettes fermiers, coqs Goliath, canards)
- **Cabris & Chèvres** (cabris sahéliens, boucs géniteurs, chèvres Djallonké)

> **Important** : Boutique en ligne à **vendeur unique**. Le propriétaire de l'exploitation est le seul vendeur autorisé. Les visiteurs parcourent le catalogue, passent commande ou contactent directement l'éleveur via WhatsApp et téléphone.

---

## 🎨 Identité Visuelle & Expérience Utilisateur

L'interface a été soignée pour offrir un rendu sobre, naturel, chaleureux et non surchargé :
- **Vert forêt** (`#1f4c32`, `#166534`, `#0c2216`) : nature, sérieux et vigueur animale
- **Blanc cassé & Beige naturel** (`#fdfbf7`, `#f7f4ee`, `#e8e2d5`) : pureté et lisibilité
- **Brun terre** (`#78350f`, `#5c3a21`) : ancrage agropastoral
- **Prix affichés en FCFA**
- **Interface allégée et optimisée** pour les connexions à débit limité et les smartphones.

---

## 🚀 Fonctionnalités Clés

### 🌐 Espace Public
1. **Page d'accueil dynamique** (`/`) :
   - Bannière principale avec titre, slogan et photo d'élevage
   - Aperçu des spécialités cunicoles, avicoles et caprines
   - Dernières disponibilités avec statuts et prix
   - Réalisations récentes et vie de la ferme
   - Engagements qualité et contact rapide
2. **Catalogue & Boutique en ligne** (`/boutique`) :
   - Filtre interactif instantané par catégorie (Lapins, Volailles, Cabris...)
   - Recherche en temps réel par mot-clé (nom, race...)
   - Tri par prix (croissant / décroissant) et date de publication
   - Filtre « Disponibles uniquement » (exclut les animaux épuisés ou vendus)
   - Badge de disponibilité avec stock en direct
3. **Fiche détaillée de l'animal** (`/animaux/[slug]`) :
   - Galerie photos
   - Caractéristiques : race, âge, sexe, poids, stock, localisation
   - Bouton de commande directe
   - Bouton WhatsApp prérempli avec nom de l'animal, référence et prix
4. **Parcours de commande dédié** (`/commander` et modal instantané) :
   - Sélection de l'animal et de la quantité (plafonnée au stock réel)
   - Formulaire client : nom, téléphone, ville, adresse / point de retrait, notes
   - Vérification et confirmation sans carte bancaire requise
   - Page de confirmation (`/commande-succes`) générant un **numéro de commande unique** (`CMD-YYYYMM-XXXX`) et bouton de transmission WhatsApp en un clic
5. **Portfolio des Réalisations** (`/realisations`) :
   - Installations, suivi vétérinaire, sélection génétique
   - Filtre par catégorie et agrandissement lightbox
6. **Conseils & Actualités** (`/actualites`) :
   - Guides pratiques sur l'alimentation, l'hygiène et les soins
7. **Contact Direct** (`/contact`) :
   - Téléphone, WhatsApp, email, localisation, horaires
   - Formulaire de message directement enregistré en base de données

---

### 🛡️ Espace d'Administration Sécurisé (`/admin`)

Espace privé réservé au propriétaire de l'élevage, protégé par session HTTP-Only sécurisée (JWT + Bcrypt) :
- **Tableau de bord statistique** : total annonces, cheptel disponible, commandes en attente, commandes livrées.
- **Gestion des animaux** : ajout, modification, suppression, upload de photos (fichiers ou URLs), ajustement des stocks et prix, bascule en ligne / masqué.
- **Gestion des catégories** : création et organisation des catégories d'espèces.
- **Gestion des commandes** :
  - Liste complète avec recherche par n° de commande ou client
  - Changement de statut (*Nouvelle*, *Confirmée*, *En préparation*, *Livrée*, *Annulée*)
  - **Restauration automatique du stock** si une commande est annulée
  - Bouton WhatsApp vers le client avec message pré-rempli
- **Gestion du portfolio** : ajout et suivi des réalisations avec dates et photos.
- **Gestion des articles & conseils** : publication, mise en brouillon et suppression.
- **Messages reçus** : consultation et marquage des messages envoyés par les visiteurs.
- **Paramètres du site** : modification du nom de l'exploitation, du numéro WhatsApp officiel, des téléphones, adresses, horaires, textes d'accueil et liens sociaux sans toucher au code.

---

## 🛠️ Architecture Technique

- **Frontend & Backend** : [Next.js](https://nextjs.org/) (App Router, React Server Components & Client Components)
- **Langage** : TypeScript
- **Style** : Tailwind CSS avec palette personnalisée
- **Base de données & ORM** : Prisma ORM
  - *Développement & Démonstration immédiate* : SQLite (`prisma/dev.db` zéro configuration)
  - *Production* : Entièrement compatible PostgreSQL (`DATABASE_URL="postgresql://..."`)
- **Sécurité** : `bcryptjs` pour le hachage des mots de passe, `jose` pour les jetons de session JWT signés
- **Validation** : Validation côté client et contrôles stricts côté serveur dans les routes d'API

---

## 💻 Installation et Démarrage Local

### Prérequis
- [Node.js](https://nodejs.org/) (v18.17 ou supérieure, testé avec succès sur v24)
- npm ou yarn

### 1. Cloner ou ouvrir le projet
```bash
cd c:\Users\ADN\Desktop\elevage
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Un fichier `.env` est déjà fourni avec une configuration par défaut. Vous pouvez copier `.env.example` si nécessaire :
```env
DATABASE_URL="postgresql://postgres.squydzkamlzvkaqpvcun:[MOT_DE_PASSE]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.squydzkamlzvkaqpvcun:[MOT_DE_PASSE]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://squydzkamlzvkaqpvcun.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[VOTRE_CLE_PUBLIQUE]"
JWT_SECRET="elevage_secret_jwt_key_development_32chars_random_unique"
NODE_ENV="development"
```

### 4. Initialiser la base de données et charger les données de démonstration
```bash
# Générer le client Prisma et créer la base de données
npx prisma generate
npx prisma db push

# Amorcer le compte propriétaire et les données de test
npm run db:seed
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez votre navigateur sur : [http://localhost:3000](http://localhost:3000)

---

## 🔑 Compte Administrateur Initial

Lors de l'exécution de `npm run db:seed`, un premier compte propriétaire est automatiquement initialisé :

- **URL de connexion** : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email** : `admin@elevage-espoir.com`
- **Mot de passe initial** : `AdminElevage2026!`

> Vous pouvez changer votre mot de passe ou vos informations directement en production ou via les variables d'environnement `ADMIN_EMAIL` et `ADMIN_PASSWORD` avant le premier amorçage.

---

## 🧪 Lancement des Tests

Une suite de tests automatisée valide les fonctionnalités critiques :
- Hachage de mot de passe & refus des mots de passe invalides
- Décrémentation atomique du stock lors d'une commande
- Génération du numéro de commande unique
- Préservation du prix historique (snapshot) sur les commandes passées
- Bascule automatique du statut en `EPUISE` quand le stock atteint 0
- Restauration automatique du stock lors de l'annulation d'une commande
- Paramètres WhatsApp dynamiques

Pour lancer la suite de tests :
```bash
npm test
```

---

## 📦 Déploiement en Production

### Option 1 : Déploiement sur Vercel
1. Poussez le dépôt sur GitHub ou GitLab.
2. Importez le projet sur [Vercel](https://vercel.com).
3. Connectez une base de données PostgreSQL managée (ex : Neon, Supabase ou Vercel Postgres).
4. Définissez la variable d'environnement `DATABASE_URL` avec l'URL PostgreSQL :
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/elevage_db?sslmode=require"
   JWT_SECRET="votre_cle_secrete_ultra_securisee_min_32_caracteres"
   NODE_ENV="production"
   ```
5. Dans `prisma/schema.prisma`, changez `provider = "sqlite"` par `provider = "postgresql"`.
6. Lancez `npx prisma db push` puis `node prisma/seed.js`.

### Option 2 : Serveur Dédié / VPS (Node.js + PM2 ou Docker)
1. Installez Node.js et PostgreSQL.
2. Compilez le projet :
   ```bash
   npm run build
   ```
3. Démarrez le service :
   ```bash
   npm run start
   ```

---

## 📱 Numéro WhatsApp & Personnalisation

Le numéro WhatsApp de l'éleveur n'est **jamais codé en dur** dans le code. Pour le modifier :
1. Connectez-vous à l'espace administration (`/admin`).
2. Allez dans **Paramètres du site**.
3. Renseignez votre numéro WhatsApp officiel au format international sans espace (ex : `22997001234` pour le Bénin).
4. Cliquez sur **Enregistrer les modifications** : tous les boutons du site et de suivi de commande utiliseront immédiatement votre nouveau numéro.
