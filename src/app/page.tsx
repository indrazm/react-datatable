import { TableComponent } from '@/components/table';

async function getData() {
  const res = await fetch('http://localhost:3000/api/data', {
    cache: 'no-store',
  });
  const data = await res.json();
  return data;
}
export default async function Page() {
  const data = await getData();
  console.log(data);

  return <TableComponent initialData={data} />;
}
