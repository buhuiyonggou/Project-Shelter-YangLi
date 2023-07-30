import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const puppies = [
  {
    name: 'Fido',
    breed: 'African',
    age: 2,
    image: 'https://images.dog.ceo/breeds/african/n02116738_10614.jpg',
    description: 'Advancing conservation of wild dogs in Zimbabwe. Promoting human-wildlife co-existence. Wild dogs need your support to thrive and increase their numbers to avoid extinction.'
  },
  {
    name: 'Corky',
    breed: 'Akita',
    age: 3,
    image: 'https://images.dog.ceo/breeds/akita/512px-Akita_inu.jpg',
    description: 'The Akita is a Japanese dog breed of large size. Originating from the mountains of northern Japan',

  },
  {
    name: 'Dallas',
    breed: 'Dingo',
    age: 1,
    image: 'https://images.dog.ceo/breeds/dingo/n02115641_4674.jpg',
    description: 'The dingo (Canis familiaris, Canis familiaris dingo, Canis dingo, or Canis lupus dingo) is an ancient (basal) lineage of dog found in Australia'
  },
  {
    name: 'Finn',
    breed: 'Samoyed',
    age: 1,
    image: 'https://images.dog.ceo/breeds/samoyed/n02111889_14064.jpg',
    description: 'The Samoyed is a substantial but graceful dog standing anywhere from 19 to a bit over 23 inches at the shoulder'
  },


]

async function main() {

  for (let puppy of puppies) {
    await prisma.puppy.create({
      data: puppy
    })
  }

  const client = await prisma.client.create({
    data: {
      auth0Id: "test-auth0-id",
      name: "Test Client",
      email: "test@example.com",
      address: "456 Client St",
      phone: "+0987654321",
      occupation: "Tester",
      reasonForAdopt: "I love puppies",
    },
  });

  await prisma.application.create({
    data: {
      status: "Pending",
      clientId: client.id,
      puppyId: 1,
    },
  });

  // Create a favorite for client on puppy 2
  await prisma.favorite.create({
    data: {
      clientId: client.id,
      puppyId: 2,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });