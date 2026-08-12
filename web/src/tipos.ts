export type StatusFerramenta = "disponivel" | "em_uso" | "manutencao";

export interface Ferramenta {
  id: number;
  nome: string;
  quantidade: number;
  status: StatusFerramenta;
}
