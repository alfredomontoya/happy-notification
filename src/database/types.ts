export interface Persona {
  id: number;
  ci: string;
  nombre: string;
  cargo: string;
  dependencia: string;
  fecha_nacimiento: string;
}

export interface Gestion {
  id: string;
  user_id: string;
  year: number;
  titulo: string;
  descripcion: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface Funcionario {
  id: string;
  user_id: string;
  gestion_id: string;
  nro: string;
  ci: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  edificio: string;
  tipo: string;
  responsable: string;
  telresponsable: string;
  estado: string;
  entregado: number;
  created_at: string;
  updated_at: string;
}
