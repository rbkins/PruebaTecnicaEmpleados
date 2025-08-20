"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { RecordCard } from "./record-card";

interface RecordsTableProps {
  records: any[];
  config: {
    fields: any[];
  };
}

export function RecordsTable({ records, config }: RecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getAllFields = () => {
    const fieldsSet = new Set<string>();
    records.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (key !== "id" && key !== "timestamp") {
          fieldsSet.add(key);
        }
      });
    });
    return Array.from(fieldsSet);
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getFieldLabel = (fieldId: string) => {
    const field = config.fields.find((f) => f.id === fieldId);
    if (field?.label) return field.label;
    return (
      fieldId.charAt(0).toUpperCase() +
      fieldId.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  const getDisplayValue = (fieldId: string, value: any) => {
    const field = config.fields.find((f) => f.id === fieldId);

    if (field?.type === "select" && field.options) {
      const option = field.options.find(
        (opt: { value: string; label: string }) => opt.value === value
      );
      if (option?.label) return option.label;
    }

    return value || "";
  };

  const exportToCSV = () => {
    if (records.length === 0) return;

    const fields = getAllFields();
    const headers = fields.map((fieldId) => getFieldLabel(fieldId)).join(",");
    const rows = records
      .map((record) =>
        fields
          .map((fieldId) => {
            const value = getDisplayValue(fieldId, record[fieldId]);
            return `"${value || ""}"`;
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "empleados.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay registros aún</p>
        <p className="text-muted-foreground text-sm mt-2">
          Los empleados registrados aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {filteredRecords.map((record, index) => (
          <RecordCard
            key={record.id}
            record={record}
            index={index}
            getFieldLabel={getFieldLabel}
            getDisplayValue={getDisplayValue}
            fields={getAllFields()}
          />
        ))}
      </div>

      {/* Vista desktop */}
      <div className="hidden md:block rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  #
                </th>
                {getAllFields().map((fieldId) => (
                  <th
                    key={fieldId}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {getFieldLabel(fieldId)}
                  </th>
                ))}
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Fecha de Registro
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </td>
                  {getAllFields().map((fieldId) => (
                    <td key={fieldId} className="p-4 align-middle">
                      {getDisplayValue(fieldId, record[fieldId]) || "-"}
                    </td>
                  ))}
                  <td className="p-4 align-middle text-sm text-muted-foreground">
                    {record.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredRecords.length} de {records.length} registros
      </div>
    </div>
  );
}
