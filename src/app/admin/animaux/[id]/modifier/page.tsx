import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import AnimalForm from '@/components/AnimalForm';

export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditAnimalPage({ params }: PageProps) {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const { id } = params;

  const animal = await prisma.animal.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!animal) {
    notFound();
  }

  const categories = await prisma.animalCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <AnimalForm
      categories={categories}
      initialData={{
        id: animal.id,
        title: animal.title,
        categoryId: animal.categoryId,
        description: animal.description,
        price: animal.price,
        stock: animal.stock,
        status: animal.status,
        isPublished: animal.isPublished,
        isFeatured: animal.isFeatured,
        age: animal.age,
        race: animal.race,
        sex: animal.sex,
        weight: animal.weight,
        location: animal.location,
        images: animal.images,
      }}
      isEdit={true}
    />
  );
}
