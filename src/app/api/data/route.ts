import { faker } from '@faker-js/faker';
import { NextResponse } from 'next/server';

function generateArray(length: number) {
  return Array.from({ length }, (_, i) => i + 1);
}

export async function GET() {
  const data = generateArray(20).map(() => {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      jobTitle: faker.person.jobTitle(),
      age: faker.number.int({ min: 18, max: 65 }),
    };
  });

  return NextResponse.json(data);
}
