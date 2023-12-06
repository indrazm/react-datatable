'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  age: number;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('jobTitle', {
    header: 'Job Title',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
];

interface TableComponentProps {
  initialData: User[];
}

export const TableComponent: React.FC<TableComponentProps> = ({ initialData }) => {
  const [isClient, setIsClient] = useState(false);
  const [data] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        firstName: false,
        lastName: true,
        email: true,
        jobTitle: true,
        age: true,
      },
    },
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {/* <pre>{JSON.stringify(sorting, null, 2)}</pre> */}
      <div className="flex gap-4">
        {table.getAllColumns().map((column) => {
          return (
            <div key={column.id} className="flex gap-2">
              <input
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />
              <p>{column.columnDef.header as string}</p>
            </div>
          );
        })}
      </div>
      <Table>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableHeader key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                console.log({ sorted: column.column.getIsSorted(), columnId: column.id });
                return (
                  <TableHead
                    className="cursor-pointer hover:bg-zinc-100"
                    key={column.id}
                    onClick={() => column.column.toggleSorting()}
                  >
                    <div className="flex items-center justify-between">
                      <div>{flexRender(column.column.columnDef.header, column.getContext())}</div>
                      {column.column.getIsSorted() === 'asc' ? <ArrowDown /> : null}
                      {column.column.getIsSorted() === 'desc' ? <ArrowUp /> : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableHeader>
          );
        })}
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
