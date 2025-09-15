export interface patientsI {
    id: number;
    name: string;
    last_name: string;
    fechaNacimiento: Date;
    genero: 'Masculino' | 'Femenino' | 'Otro';
    phone: string;
    email: string;
    direccion: string;
    historialMedico: string;
    status: 'Activo' | 'Inactivo';
}