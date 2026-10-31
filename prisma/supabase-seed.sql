-- ============================================================
-- SEED INITIAL — Elevage Pro
-- À exécuter dans Supabase SQL Editor APRÈS supabase-init.sql
-- ============================================================

-- Compte administrateur
-- Email: admin@elevage-espoir.com
-- Mot de passe: AdminElevage2026!
INSERT INTO "AdminUser" (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  'admin_default_001',
  'admin@elevage-espoir.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrateur',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Paramètres du site
INSERT INTO "SiteSettings" (
  id, "farmName", tagline, "aboutText", "experienceYears",
  phone, "whatsappNumber", email, address, hours, currency,
  "heroTitle", "heroSubtitle", "facebookUrl", "updatedAt"
) VALUES (
  'default',
  'Ferme Pastorale de l''Espoir',
  'Élevage sain, naturel et sélectionné de lapins, volailles et cabris',
  'Passionné par l''agropastoralisme et le bien-être animal, notre élevage met à votre disposition des sujets vigoureux, nourris sainement et suivis rigoureusement sur le plan sanitaire.',
  6,
  '+229 97 00 12 34',
  '22997001234',
  'contact@elevage-espoir.com',
  'Route Principale, Zone Rurale Agro-Écologique',
  'Lundi au Samedi : 07h30 - 18h00 | Dimanche sur commande',
  'FCFA',
  'Animaux d''élevage de qualité supérieure, prêts pour votre cheptel ou votre table',
  'Vente directe de lapins de race, poulets fermiers vigoureux et cabris sahéliens élevés avec soin et respect de la nature.',
  'https://facebook.com',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Catégories d'animaux
INSERT INTO "AnimalCategory" (id, name, slug, description, "displayOrder", "createdAt", "updatedAt")
VALUES
  ('cat_lapins', 'Lapins', 'lapins', 'Lapins de race élevés en liberté, vigoureux et sélectionnés', 1, NOW(), NOW()),
  ('cat_poulets', 'Poulets et Volailles', 'poulets-et-volailles', 'Poulets fermiers et volailles élevés au grain', 2, NOW(), NOW()),
  ('cat_cabris', 'Cabris et Chèvres', 'cabris-et-chevres', 'Cabris et chèvres sahéliens de qualité', 3, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Animaux de démonstration
INSERT INTO "Animal" (id, title, slug, "categoryId", description, price, stock, status, "isPublished", age, race, sex, weight, "isFeatured", "createdAt", "updatedAt")
VALUES
  ('animal_lapin_01', '[DÉMO] Lapins de Race Néozélandais', 'lapins-neozelandais-demo', 'cat_lapins',
   'Lapins Néozélandais de qualité supérieure, élevés en plein air avec alimentation naturelle. Idéaux pour la reproduction ou la consommation.',
   15000, 10, 'DISPONIBLE', true, '3 mois', 'Néozélandais', 'Mixte', '2-3 kg', true, NOW(), NOW()),

  ('animal_lapin_02', '[DÉMO] Lapins Géants Papillon', 'lapins-geants-papillon-demo', 'cat_lapins',
   'Magnifiques lapins Géants Papillon, race robuste et productive. Excellent rendement en viande.',
   20000, 5, 'DISPONIBLE', true, '4 mois', 'Géant Papillon', 'Mixte', '4-5 kg', false, NOW(), NOW()),

  ('animal_poulet_01', '[DÉMO] Poulets Fermiers Label Rouge', 'poulets-fermiers-label-rouge-demo', 'cat_poulets',
   'Poulets élevés en plein air, nourris au grain. Chair ferme et savoureuse, idéale pour les fêtes et repas familiaux.',
   5000, 25, 'DISPONIBLE', true, '90 jours', 'Poulet Fermier', 'Mixte', '2-2.5 kg', true, NOW(), NOW()),

  ('animal_poulet_02', '[DÉMO] Pintades Fermières', 'pintades-fermieres-demo', 'cat_poulets',
   'Pintades élevées en liberté, viande fine et délicate. Disponibles à l''unité ou en lot.',
   7500, 12, 'DISPONIBLE', true, '4 mois', 'Pintade commune', 'Femelle', '1.5-2 kg', false, NOW(), NOW()),

  ('animal_cabri_01', '[DÉMO] Cabris Sahéliens Sevrés', 'cabris-saheliens-sevres-demo', 'cat_cabris',
   'Cabris sahéliens robustes, bien adaptés au climat local. Sevrés et prêts pour l''élevage ou la vente.',
   35000, 8, 'DISPONIBLE', true, '3 mois', 'Sahélien', 'Mixte', '8-12 kg', true, NOW(), NOW()),

  ('animal_cabri_02', '[DÉMO] Chèvres Laitières', 'chevres-laitieres-demo', 'cat_cabris',
   'Chèvres laitières productrices, idéales pour la production de lait. Bonnes reproductrices.',
   75000, 3, 'DISPONIBLE', true, '18 mois', 'Sahélienne améliorée', 'Femelle', '25-30 kg', false, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Images de démonstration (URLs Unsplash)
INSERT INTO "AnimalImage" (id, "animalId", url, "isPrimary", "order", "createdAt")
VALUES
  ('img_01', 'animal_lapin_01', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800', true, 0, NOW()),
  ('img_02', 'animal_lapin_02', 'https://images.unsplash.com/photo-1606574977847-cd14be61fef9?w=800', true, 0, NOW()),
  ('img_03', 'animal_poulet_01', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800', true, 0, NOW()),
  ('img_04', 'animal_poulet_02', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800', true, 0, NOW()),
  ('img_05', 'animal_cabri_01', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', true, 0, NOW()),
  ('img_06', 'animal_cabri_02', 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800', true, 0, NOW())
ON CONFLICT DO NOTHING;

-- Réalisations portfolio
INSERT INTO "PortfolioProject" (id, title, category, description, "imageUrl", "isPublished", "createdAt", "updatedAt")
VALUES
  ('portfolio_01', '[DÉMO] Inauguration du nouveau poulailler', 'Installations',
   'Construction et mise en service d''un nouveau poulailler moderne de 200 places, avec système de ventilation automatique.',
   'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800', true, NOW(), NOW()),
  ('portfolio_02', '[DÉMO] Salon régional de l''élevage 2024', 'Événements',
   'Participation et présentation de nos meilleures races au salon régional. Médaille d''argent pour nos lapins Néozélandais.',
   'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800', true, NOW(), NOW()),
  ('portfolio_03', '[DÉMO] Troupeau de cabris sahéliens', 'Troupeaux',
   'Notre troupeau de cabris sahéliens : 45 têtes sélectionnées pour leur robustesse et leur adaptation au climat local.',
   'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Articles
INSERT INTO "Article" (id, title, slug, category, excerpt, content, "isPublished", "createdAt", "updatedAt")
VALUES
  ('article_01',
   '[DÉMO] Les secrets d''une alimentation équilibrée pour vos lapins',
   'alimentation-equilibree-lapins-demo',
   'Conseils',
   'Découvrez comment optimiser l''alimentation de vos lapins pour une croissance rapide et une viande de qualité.',
   '# Alimentation équilibrée pour les lapins

Une bonne alimentation est la base d''un élevage réussi. Voici nos conseils pratiques :

## Les aliments essentiels

- **Foin** : la base de la ration, à volonté
- **Granulés** : 100-150g par jour pour un lapin adulte
- **Légumes frais** : carottes, choux, herbe fraîche
- **Eau propre** : toujours disponible

## À éviter absolument

- Les aliments fermentés ou moisis
- Les légumineuses en excès
- Les changements brusques de ration

Contactez-nous pour plus de conseils personnalisés.',
   true, NOW(), NOW()),

  ('article_02',
   '[DÉMO] Préparer votre cabri pour la saison sèche',
   'cabri-saison-seche-demo',
   'Soins',
   'La saison sèche est une période délicate pour les cabris. Voici comment les préparer et les protéger.',
   '# Préparer vos cabris pour la saison sèche

La saison sèche représente un défi pour tout éleveur. Nos conseils :

## Alimentation supplémentaire

Compensez le manque de pâturage avec :
- Du fourrage sec stocké à l''avance
- Des compléments minéraux
- Des résidus de récolte traités

## Soins vétérinaires préventifs

- Déparasitage interne avant la saison
- Vaccination contre les maladies courantes
- Vérification des onglons

## Gestion de l''eau

L''eau est cruciale : prévoyez des réserves suffisantes.',
   true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Message de confirmation
SELECT 'Base de données initialisée avec succès !' as message;
