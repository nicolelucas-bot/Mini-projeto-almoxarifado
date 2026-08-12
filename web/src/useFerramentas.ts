import { useCallback, useEffect, useState } from "react";
import type { Ferramenta, StatusFerramenta } from "./tipos";
import { listarFerramentas } from "./api";

export function useFerramentas(filtro: StatusFerramenta | "") {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarFerramentas(filtro);
      setFerramentas(dados);
    } catch {
      setErro("Nao foi possivel carregar as ferramentas. A API esta rodando?");
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { ferramentas, carregando, erro, recarregar };
}
