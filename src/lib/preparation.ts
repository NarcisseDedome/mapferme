export interface PreparationOption {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  fee: number;
  badge?: string;
}

export function getPreparationOptions(categorySlug?: string | null): PreparationOption[] {
  const isLargeAnimal = categorySlug === 'cabris' || categorySlug === 'cabris-et-chevres';

  if (isLargeAnimal) {
    return [
      {
        id: 'VIVANT',
        label: 'Vivant sur pied (Aucune préparation)',
        shortLabel: 'Vivant',
        description: 'Animal sain et vigoureux remis vivant pour élevage ou abattage par vos soins',
        fee: 0,
      },
      {
        id: 'DEPLUME_NETTOYE',
        label: 'Abattu, dépecé & éviscéré (Prêt-à-cuire)',
        shortLabel: 'Abattu & dépecé',
        description: 'Abattage hygiénique, dépouillage soigné, éviscération complète et lavage',
        fee: 3000,
        badge: 'Prêt-à-cuire',
      },
      {
        id: 'DECOUPE_ASSAISONNE',
        label: 'Abattu, découpé en morceaux & mariné',
        shortLabel: 'Découpé & mariné',
        description: 'Découpé en morceaux réguliers et assaisonné avec notre marinade d’épices naturelles',
        fee: 5000,
        badge: 'Gagnez du temps',
      },
      {
        id: 'GRILLE',
        label: 'Méchoui / Braisé au feu de bois (Prêt à déguster)',
        shortLabel: 'Méchoui grillé',
        description: 'Cuit à cœur et doré sur braise au feu de bois avec jus d’assaisonnement',
        fee: 8000,
        badge: 'Spécial fête & festin',
      },
    ];
  }

  // Default for Volailles (poulets, coqs), Lapins, etc.
  return [
    {
      id: 'VIVANT',
      label: 'Vivant (Sur pied, sans préparation)',
      shortLabel: 'Vivant',
      description: 'Volaille ou animal remis vivant en pleine santé',
      fee: 0,
    },
    {
      id: 'DEPLUME_NETTOYE',
      label: 'Abattu, déplumé & vidé (Prêt-à-cuire)',
      shortLabel: 'Déplumé & vidé',
      description: 'Abattage propre, plumage complet et éviscération soignée',
      fee: 500,
      badge: 'Populaire',
    },
    {
      id: 'DECOUPE_ASSAISONNE',
      label: 'Abattu, découpé & mariné aux épices',
      shortLabel: 'Découpé & mariné',
      description: 'Découpé en morceaux prêts pour la marmite ou la grille, assaisonnés aux épices maison',
      fee: 1000,
      badge: 'Gain de temps',
    },
    {
      id: 'GRILLE',
      label: 'Grillé & braisé au barbecue (Prêt à déguster)',
      shortLabel: 'Grillé sur braise',
      description: 'Doré et croustillant sur braise, prêt pour la table sans aucune corvée de cuisine',
      fee: 1500,
      badge: 'Festif & Gourmand',
    },
  ];
}

export function getPreparationFee(optionId: string, categorySlug?: string | null): number {
  const options = getPreparationOptions(categorySlug);
  const found = options.find((o) => o.id === optionId);
  return found ? found.fee : 0;
}

export function getPreparationLabel(optionId?: string | null, categorySlug?: string | null): string {
  if (!optionId || optionId === 'VIVANT') return 'Vivant (Sur pied)';
  const options = getPreparationOptions(categorySlug);
  const found = options.find((o) => o.id === optionId);
  return found ? found.label : optionId;
}
