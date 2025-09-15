export interface AtencionI {
    id: number;
    patient_id: number;           // relación al paciente
    fecha: Date;

    motivo?: string;
    signos_vitales?: { ta?: string; fc?: number; fr?: number; temp?: number; spo2?: number };

    diagnosticos: Array<{
        codigo: string;             // CIE-10 u otro
        descripcion: string;
        tipo: 'presuntivo' | 'definitivo';
    }>;

    procedimientos: Array<{
        codigo: string;             // CUPS u otro
        descripcion: string;
        observacion?: string;
    }>;

    receta: Array<{
        medicamento: string;
        presentacion?: string;      // ej. 500 mg tabletas
        via?: string;               // VO, IM...
        dosis: string;              // ej. 1 tableta
        frecuencia: string;         // ej. cada 8 horas
        duracion: string;           // ej. 7 días
        indicaciones?: string;
    }>;

    notas?: string;
    creado_por?: string;
}
