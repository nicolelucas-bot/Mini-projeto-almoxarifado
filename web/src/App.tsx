import { useEffect, useState } from "react";
import type { Ferramenta } from "./tipos";
import "./App.css";

const URL_API = "http://localhost:3000";

export default function App() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch(`${URL_API}/ferramentas`);
        if (!resposta.ok) {
          throw new Error("Falha ao carregar");
        }
        const dados: Ferramenta[] = await resposta.json();
        setFerramentas(dados);
      } catch {
        setErro("Nao foi possivel carregar as ferramentas. A API esta rodando?");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function cadastrar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setMensagem(null);

    try {
      const resposta = await fetch(`${URL_API}/ferramentas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade: Number(quantidade) }),
      });

      const corpo = await resposta.json();

      if (!resposta.ok) {
        setMensagem(corpo.erro ?? "Erro ao cadastrar");
        return;
      }

      setFerramentas((atual) => [...atual, corpo as Ferramenta]);
      setMensagem("Ferramenta cadastrada.");
      setNome("");
      setQuantidade("");
    } catch {
      setMensagem("Nao foi possivel salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: number) {
    const confirmou = window.confirm("Remover esta ferramenta?");
    if (!confirmou) return;

    const resposta = await fetch(`${URL_API}/ferramentas/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      setFerramentas((atual) => atual.filter((f) => f.id !== id));
    }
  }

  if (carregando) return <p>Carregando ferramentas...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <main>
      <h1>Almoxarifado — Ferramentas</h1>

      <form onSubmit={cadastrar}>
        <input
          placeholder="Nome da ferramenta"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <ul>
        {ferramentas.map((f) => (
          <li key={f.id}>
            {f.nome} — {f.quantidade} un. — {f.status}
            <button onClick={() => remover(f.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
