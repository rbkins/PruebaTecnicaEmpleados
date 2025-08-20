"use client";

import { useState, useEffect } from "react";
import { DynamicForm } from "@/components/dynamic-form";
import { RecordsTable } from "@/components/records-table";
import { ConfigPanel } from "@/components/config-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText } from "lucide-react";

import { Field, FormConfig, SelectOption } from "@/types/form";
const initialFormConfig: FormConfig = {
  fields: [
    {
      id: "nombres",
      label: "Nombres",
      type: "text",
      required: true,
      minLength: 2,
      validations: {
        required: true,
        minLength: 2,
      },
      options: [],
    },
    {
      id: "apellidos",
      label: "Apellidos",
      type: "text",
      required: true,
      minLength: 2,
      validations: {
        required: true,
        minLength: 2,
      },
      options: [],
    },
    {
      id: "direccion",
      label: "Direccion",
      type: "textarea",
      required: false,
      validations: {
        required: false,
      },
      options: [],
    },
    {
      id: "genero",
      label: "Genero",
      type: "select",
      required: true,
      isSelect: true,
      options: [
        { value: "masculino", label: "Masculino" },
        { value: "femenino", label: "Femenino" },
      ],
      validations: {
        required: true,
      },
    },
    {
      id: "departamento",
      label: "Departamento",
      type: "select",
      required: false,
      isSelect: true,
      options: [],
      validations: {
        required: false,
      },
    },
  ],
};

export default function HomePage() {
  const [formConfig, setFormConfig] = useState<FormConfig>(initialFormConfig);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          "https://my-json-server.typicode.com/joseolivares/elsalvador_states/deptos"
        );
        const data = await response.json();
        const departments = data.map((dept: any) => ({
          value: dept.id.toString(),
          label: dept.name,
        }));

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.id === "departamento"
              ? { ...field, options: departments }
              : field
          ),
        }));

        // Actualizar las opciones del campo departamento
        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.id === "departamento"
              ? { ...field, options: departments }
              : field
          ),
        }));
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleFormSubmit = (data: any) => {
    const newRecord = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toLocaleString(),
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const handleConfigUpdate = (newConfig: any) => {
    setFormConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Restaurante Lorem Ipsum
          </h1>
        </div>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Formulario
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Registros ({records.length})
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Empleado</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicForm config={formConfig} onSubmit={handleFormSubmit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registros de Empleados</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordsTable records={records} config={formConfig} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Panel de Configuración</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigPanel
                  config={formConfig}
                  onConfigUpdate={handleConfigUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
