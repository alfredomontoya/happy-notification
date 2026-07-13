export interface Persona {
  id: number;
  ci: string;
  nombre: string;
  cargo: string;
  dependencia: string;
  fecha_nacimiento: string;
}

export interface Funcionario {
  id: number;
  ci: string;
  nombre: string;
  cargo: string;
  dependencia: string;
  telefono: string;
  email: string;
}
