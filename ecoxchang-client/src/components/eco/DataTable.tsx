"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  searchKeys,
  emptyMessage = "No rows to display",
}: {
  columns: { key: keyof T | string; label: string; className?: string }[];
  rows: T[];
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim() || !searchKeys?.length) return rows;
    const lower = q.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(lower)),
    );
  }, [rows, q, searchKeys]);

  return (
    <div className="space-y-3">
      {searchKeys && (
        <Input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)} className={c.className}>
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={String(c.key)} className={c.className}>
                      {row[c.key as keyof T] as React.ReactNode ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
