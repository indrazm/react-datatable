import { TableComponent } from '@/components/table';

async function getData() {
  const res = await fetch('http://localhost:3000/api/datasubrows?take=10&pageIndex=2', {
    cache: 'no-store',
  });
  const data = await res.json();
  return data;
}
export default async function Page() {
  const data = await getData();

  return <TableComponent initialData={data} />;
}
