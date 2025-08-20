"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecordCardProps {
  record: any;
  index: number;
  getFieldLabel: (fieldId: string) => string;
  getDisplayValue: (fieldId: string, value: any) => any;
  fields: string[];
}

export function RecordCard({
  record,
  index,
  getFieldLabel,
  getDisplayValue,
  fields,
}: RecordCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            #{index + 1}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {record.timestamp}
          </span>
        </div>
        <dl className="grid gap-3">
          {fields.map((fieldId) => (
            <div key={fieldId}>
              <dt className="text-sm font-medium text-muted-foreground mb-1">
                {getFieldLabel(fieldId)}
              </dt>
              <dd className="text-base">
                {getDisplayValue(fieldId, record[fieldId]) || "-"}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
