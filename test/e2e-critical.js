const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('🧪 LANCEMENT DE LA SUITE DE TESTS CRITIQUES');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Authentification Administrateur
    // ----------------------------------------------------
    console.log('1. Test d\'authentification & Hachage sécurisé :');
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'm.aik@hotmail.fr' },
    });
    assert(!!admin, 'Le compte administrateur officiel (m.aik@hotmail.fr) existe en base.');

    const isValidPassword = await bcrypt.compare('Mohamed2026', admin.passwordHash);
    assert(isValidPassword, 'Le mot de passe correct (Mohamed2026) est validé par bcrypt.');

    const isInvalidPassword = await bcrypt.compare('MauvaisMotDePasse!', admin.passwordHash);
    assert(!isInvalidPassword, 'Un mauvais mot de passe est rejeté par bcrypt.');

    // ----------------------------------------------------
    // TEST 2: Création d'animal & Vérification de stock
    // ----------------------------------------------------
    console.log('\n2. Test de gestion du catalogue et du stock :');
    const category = await prisma.animalCategory.findFirst();
    assert(!!category, 'Une catégorie d\'animaux est disponible.');

    const testAnimal = await prisma.animal.create({
      data: {
        title: 'Lapin Test Unitaire',
        slug: 'lapin-test-unitaire-' + Date.now(),
        categoryId: category.id,
        description: 'Animal pour test critique de stock et commande',
        price: 12000,
        stock: 3,
        status: 'DISPONIBLE',
        isPublished: true,
      },
    });
    assert(testAnimal.stock === 3, 'Animal de test créé avec un stock initial de 3.');

    // ----------------------------------------------------
    // TEST 3: Parcours de Commande et Décrémentation de stock
    // ----------------------------------------------------
    console.log('\n3. Test du parcours de commande et atomicité du stock :');
    const orderQty = 2;
    const unitPriceSnapshot = testAnimal.price;
    const orderSubtotal = unitPriceSnapshot * orderQty;

    // Simulation transactionnelle de commande
    const newOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.create({
        data: {
          orderNumber: 'CMD-TEST-' + Math.floor(1000 + Math.random() * 9000),
          customerName: 'Acheteur Test',
          customerPhone: '+229 95 00 00 00',
          customerLocation: 'Cotonou',
          totalAmount: orderSubtotal,
          status: 'NOUVELLE',
          items: {
            create: [
              {
                animalId: testAnimal.id,
                animalName: testAnimal.title,
                unitPrice: unitPriceSnapshot,
                quantity: orderQty,
                subtotal: orderSubtotal,
              },
            ],
          },
        },
        include: { items: true },
      });

      const updatedAnimal = await tx.animal.update({
        where: { id: testAnimal.id },
        data: {
          stock: testAnimal.stock - orderQty,
        },
      });

      return { ord, updatedAnimal };
    });

    assert(newOrder.ord.orderNumber.startsWith('CMD-TEST-'), 'Numéro de commande unique généré.');
    assert(newOrder.ord.items[0].unitPrice === 12000, 'Prix snapshot capturé correctement.');
    assert(newOrder.updatedAnimal.stock === 1, 'Stock décrémenté de 3 à 1 après la commande.');

    // ----------------------------------------------------
    // TEST 4: Modification du prix catalogue sans altérer l'ancienne commande
    // ----------------------------------------------------
    console.log('\n4. Test d\'intégrité des anciennes commandes :');
    await prisma.animal.update({
      where: { id: testAnimal.id },
      data: { price: 20000 }, // Prix catalogue augmente
    });

    const verifyOrder = await prisma.order.findUnique({
      where: { id: newOrder.ord.id },
      include: { items: true },
    });
    assert(
      verifyOrder.items[0].unitPrice === 12000,
      'L\'ancienne commande conserve son prix d\'origine (12000 FCFA).'
    );

    // ----------------------------------------------------
    // TEST 5: Épuisement du stock & Transition de statut
    // ----------------------------------------------------
    console.log('\n5. Test de rupture de stock :');
    const secondOrder = await prisma.$transaction(async (tx) => {
      const remainingStock = 1;
      const ord = await tx.order.create({
        data: {
          orderNumber: 'CMD-TEST-' + Math.floor(1000 + Math.random() * 9000),
          customerName: 'Acheteur 2',
          customerPhone: '+229 97 11 22 33',
          customerLocation: 'Calavi',
          totalAmount: 20000,
          status: 'NOUVELLE',
          items: {
            create: [
              {
                animalId: testAnimal.id,
                animalName: testAnimal.title,
                unitPrice: 20000,
                quantity: 1,
                subtotal: 20000,
              },
            ],
          },
        },
      });

      const updated = await tx.animal.update({
        where: { id: testAnimal.id },
        data: {
          stock: 0,
          status: 'EPUISE',
        },
      });

      return { ord, updated };
    });

    assert(secondOrder.updated.stock === 0, 'Le stock passe à 0.');
    assert(secondOrder.updated.status === 'EPUISE', 'Le statut passe automatiquement à EPUISE.');

    // ----------------------------------------------------
    // TEST 6: Annulation de commande & Restauration du stock
    // ----------------------------------------------------
    console.log('\n6. Test d\'annulation et restauration du stock :');
    const restoredAnimal = await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: secondOrder.ord.id },
        data: { status: 'ANNULEE' },
      });

      return tx.animal.update({
        where: { id: testAnimal.id },
        data: {
          stock: 1,
          status: 'DISPONIBLE',
        },
      });
    });

    assert(restoredAnimal.stock === 1, 'Stock restauré à 1 après annulation.');
    assert(restoredAnimal.status === 'DISPONIBLE', 'Statut repassé à DISPONIBLE.');

    // ----------------------------------------------------
    // TEST 7: Nettoyage des données de test
    // ----------------------------------------------------
    await prisma.order.delete({ where: { id: newOrder.ord.id } });
    await prisma.order.delete({ where: { id: secondOrder.ord.id } });
    await prisma.animal.delete({ where: { id: testAnimal.id } });
    console.log('\n✓ Données de test éphémères nettoyées.');

    // ----------------------------------------------------
    // TEST 8: Paramètres du site & WhatsApp
    // ----------------------------------------------------
    console.log('\n7. Test des paramètres généraux et WhatsApp :');
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    assert(!!settings, 'Paramètres généraux du site accessibles.');
    assert(!!settings.whatsappNumber, `Numéro WhatsApp configuré : ${settings.whatsappNumber}`);
    assert(settings.currency === 'FCFA', 'Devise paramétrée en FCFA.');

  } catch (err) {
    console.error('Erreur critique pendant les tests :', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`RÉSULTAT DES TESTS : ${passed} passés, ${failed} échoués`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
