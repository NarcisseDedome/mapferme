import jsPDF from 'jspdf';
import { formatPrice, formatDate } from './utils';
import { getPreparationLabel } from './preparation';

export interface OrderReceiptData {
  orderNumber: string;
  createdAt: string | Date;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  deliveryAddress?: string | null;
  preparationOption?: string | null;
  preparationFee?: number | null;
  totalAmount: number;
  items: Array<{
    animalName: string;
    quantity: number;
    unitPrice: number;
  }>;
  farmName?: string;
  phone?: string;
  email?: string;
  currency?: string;
}

export function generateOrderReceiptPDF(data: OrderReceiptData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const currency = data.currency || 'FCFA';
  const farmName = data.farmName || 'AYEKOBINOU SERVICE';
  const phone = data.phone || '+229 01 66 01 77 83 / +229 01 95 20 43 97';
  const email = data.email || 'm.aik@hotmail.fr';

  // 1. Couleurs de la charte AYEKOBINOU SERVICE
  const cForest = [35, 75, 53] as const; // #234B35
  const cGold = [138, 98, 70] as const; // #8A6246
  const cDark = [41, 45, 41] as const; // #292D29
  const cLightBg = [246, 242, 233] as const; // #F6F2E9
  const cGreenBg = [233, 243, 235] as const; // #E9F3EB

  // 2. Bandeau supérieur Vert Forêt
  doc.setFillColor(...cForest);
  doc.rect(0, 0, 210, 36, 'F');

  // Logo / Texte AYEKOBINOU SERVICE
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AYEKOBINOU SERVICE', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(163, 201, 168); // #A3C9A8
  doc.text("Domaine d'Élevage & Vente Directe de Produits", 14, 25);
  doc.text("Bénin · Tél : " + phone, 14, 30);

  // Titre du document à droite
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('BON DE COMMANDE', 196, 16, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(220, 240, 225);
  doc.text('& REÇU DE RETRAIT CLIENT', 196, 21, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 215, 0); // Or
  doc.text(`N° ${data.orderNumber}`, 196, 28, { align: 'right' });

  // 3. Cadre Récapitulatif : Référence & Dates
  let y = 44;

  doc.setFillColor(...cLightBg);
  doc.roundedRect(14, y, 182, 38, 3, 3, 'F');
  doc.setDrawColor(230, 220, 205);
  doc.roundedRect(14, y, 182, 38, 3, 3, 'S');

  // Colonne Gauche : Client
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cGold);
  doc.text('INFORMATIONS CLIENT', 20, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...cDark);
  doc.text(data.customerName || 'Client AYEKOBINOU SERVICE', 20, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 75, 70);
  doc.text(`Téléphone : ${data.customerPhone || 'Non renseigné'}`, 20, y + 22);
  doc.text(`Localité / Ville : ${data.customerLocation || 'Bénin'}`, 20, y + 28);
  if (data.deliveryAddress) {
    doc.text(`Option : ${data.deliveryAddress}`, 20, y + 33);
  }

  // Colonne Droite : Commande & Statut
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cGold);
  doc.text('DÉTAILS COMMANDE', 120, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 75, 70);
  doc.text(`Date d'émission : ${formatDate(data.createdAt)}`, 120, y + 15);
  doc.text(`Statut : Réservation confirmée`, 120, y + 21);

  // Badge Vert
  doc.setFillColor(...cGreenBg);
  doc.roundedRect(120, y + 24, 68, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cForest);
  doc.text('À PRÉSENTER AU RETRAIT', 154, y + 29.5, { align: 'center' });

  // 4. Tableau des Articles et Tarifs
  y = 90;

  // En-tête du tableau
  doc.setFillColor(...cForest);
  doc.rect(14, y, 182, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DÉSIGNATION DU PRODUIT / ANIMAL', 18, y + 6);
  doc.text('QTÉ', 120, y + 6, { align: 'center' });
  doc.text('P. UNITAIRE', 150, y + 6, { align: 'right' });
  doc.text('TOTAL', 190, y + 6, { align: 'right' });

  y += 9;

  // Lignes des articles
  const items = data.items && data.items.length > 0
    ? data.items
    : [{ animalName: 'Commande Fermière MAP', quantity: 1, unitPrice: data.totalAmount - (Number(data.preparationFee) || 0) }];

  let subtotalAnimals = 0;

  items.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    subtotalAnimals += itemTotal;

    const rowBg = index % 2 === 0 ? [255, 255, 255] : [250, 248, 244];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(14, y, 182, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...cDark);
    doc.text(item.animalName, 18, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.text(String(item.quantity), 120, y + 6.5, { align: 'center' });
    doc.text(formatPrice(item.unitPrice, currency), 150, y + 6.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cForest);
    doc.text(formatPrice(itemTotal, currency), 190, y + 6.5, { align: 'right' });

    y += 10;
  });

  // Ligne de l'option de préparation / arrangement choisie
  const prepLabel = getPreparationLabel(data.preparationOption);
  const prepFee = Number(data.preparationFee) || 0;

  doc.setFillColor(243, 240, 233);
  doc.rect(14, y, 182, 11, 'F');
  doc.setDrawColor(220, 215, 205);
  doc.line(14, y, 196, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...cGold);
  doc.text('OPTION DE PRÉPARATION & ARRANGEMENT :', 18, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cDark);
  doc.text(prepLabel, 90, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cForest);
  doc.text(
    prepFee > 0 ? `+${formatPrice(prepFee, currency)}` : 'Inclus (0 FCFA)',
    190,
    y + 7,
    { align: 'right' }
  );

  y += 15;

  // 5. Total Final
  doc.setFillColor(...cForest);
  doc.roundedRect(100, y, 96, 20, 3, 3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(210, 235, 215);
  doc.text('MONTANT TOTAL À RÉGLER :', 106, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatPrice(data.totalAmount, currency), 190, y + 14, { align: 'right' });

  y += 28;

  // 6. Consignes de retrait obligatoires
  doc.setFillColor(...cGreenBg);
  doc.roundedRect(14, y, 182, 38, 3, 3, 'F');
  doc.setDrawColor(180, 220, 190);
  doc.roundedRect(14, y, 182, 38, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...cForest);
  doc.text('CONSIGNES OFFICIELLES DE RETRAIT / LIVRAISON :', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 60, 50);
  doc.text(
    '1. Veuillez présenter ce reçu officiel (sur votre téléphone ou imprimé) lors du retrait ou de la livraison.',
    20,
    y + 14
  );
  doc.text(
    '2. Le règlement du montant total s\'effectue au moment de la livraison ou du retrait des animaux.',
    20,
    y + 20
  );
  doc.text(
    `3. Pour convenir de votre créneau exact ou pour toute urgence : contactez l'éleveur au ${phone}.`,
    20,
    y + 26
  );
  doc.text(
    '4. Qualité et vigueur garanties · Élevage sain · Suivi sanitaire strict · AYEKOBINOU SERVICE.',
    20,
    y + 32
  );

  // 7. Bas de page / Signature
  y = 265;
  doc.setDrawColor(220, 215, 205);
  doc.line(14, y, 196, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `${farmName} — Domaine d'élevage & vente directe de produits (lapins, volailles, cabris et grillards).`,
    105,
    y + 6,
    { align: 'center' }
  );
  doc.text(
    `Contact : ${phone} · Email : ${email} · Bon émis automatiquement le ${formatDate(new Date())}`,
    105,
    y + 10,
    { align: 'center' }
  );

  // Déclencher le téléchargement du fichier PDF
  const cleanOrderNumber = (data.orderNumber || 'COMMANDE').replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`Recu-AYEKOBINOU-SERVICE-${cleanOrderNumber}.pdf`);
}
