'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  age: number;
  subRows: User[];
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('id', {
    header: ({ table }) => {
      return (
        <input
          {...{
            type: 'checkbox',
            checked: table.getIsAllRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <input
          {...{
            type: 'checkbox',
            checked: row.getIsSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      );
    },
  }),
  columnHelper.accessor('subRows', {
    cell: ({ row }) => {
      return (
        <div
          style={{
            paddingLeft: `${row.depth * 20}px`,
          }}
        >
          {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? '👇' : '👉'}
            </button>
          ) : (
            '🔵'
          )}
        </div>
      );
    },
  }),
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
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 1000);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
      expanded,
    },
    initialState: {
      columnVisibility: {
        firstName: false,
        lastName: true,
        email: true,
        jobTitle: true,
        age: true,
      },
      pagination: {
        pageSize: 10,
      },
    },
    data,
    columns,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  console.log(table.getSelectedRowModel().rows); // array.forEach(()=> // adding to chart )

  return (
    <div>
      {/* <pre>{JSON.stringify(sorting, null, 2)}</pre> */}
      <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
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
      <Button onClick={() => table.toggleAllPageRowsSelected()}>Select all on the page</Button>
      <Table>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableHeader key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableHead
                    className="cursor-pointer hover:bg-zinc-100"
                    key={column.id}
                    onClick={() => {
                      if (column.id === 'id') {
                        // do nothing
                      } else {
                        column.column.toggleSorting();
                      }
                    }}
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
                    <TableCell key={cell.id} onDoubleClick={() => row.toggleSelected()}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button onClick={() => tab} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
      </div>
      <div>
        <select onChange={(e) => table.setPageSize(Number(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};
