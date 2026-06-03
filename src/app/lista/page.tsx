"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./lista.module.css";
import Image from "next/image";

type Status   = "Ativo" | "Reivindicado" | "Resolvido";
type Tipo     = "Perdido" | "Encontrado";
type Categoria= "Eletrônico" | "Livro/Material" | "Documento" | "Vestuário" | "Outro";
type Local    = "Biblioteca" | "Sala de Aula" | "Estacionamento" | "Cantina" | "Outro";

interface Item {
  id: number;
  nome: string;
  local: Local;
  data: string;
  tipo: Tipo;
  status: Status;
  categoria: Categoria;
  emoji: string;
}

const ITEMS: Item[] = [
  { id:1,  nome:"Fone de ouvido preto",      local:"Biblioteca",     data:"22/05/2026", tipo:"Encontrado", status:"Ativo",        categoria:"Eletrônico",     emoji:"🎧" },
  { id:2,  nome:"Caderno de Cálculo II",      local:"Sala de Aula",   data:"21/05/2026", tipo:"Perdido",    status:"Ativo",        categoria:"Livro/Material", emoji:"📓" },
  { id:3,  nome:"Carteira com documentos",   local:"Estacionamento", data:"20/05/2026", tipo:"Encontrado", status:"Reivindicado", categoria:"Documento",      emoji:"👜" },
  { id:4,  nome:"Tênis branco nº 40",        local:"Cantina",        data:"19/05/2026", tipo:"Encontrado", status:"Ativo",        categoria:"Vestuário",      emoji:"👟" },
  { id:5,  nome:"Carregador USB-C",           local:"Biblioteca",     data:"18/05/2026", tipo:"Perdido",    status:"Ativo",        categoria:"Eletrônico",     emoji:"🔌" },
  { id:6,  nome:"Óculos de grau",             local:"Sala de Aula",   data:"17/05/2026", tipo:"Perdido",    status:"Ativo",        categoria:"Outro",          emoji:"🕶️" },
  { id:7,  nome:"Mochila azul marinho",       local:"Cantina",        data:"16/05/2026", tipo:"Encontrado", status:"Resolvido",    categoria:"Outro",          emoji:"🎒" },
  { id:8,  nome:"Livro de Algoritmos",        local:"Biblioteca",     data:"15/05/2026", tipo:"Perdido",    status:"Ativo",        categoria:"Livro/Material", emoji:"📘" },
  { id:9,  nome:"RG e CPF plastificados",    local:"Estacionamento", data:"14/05/2026", tipo:"Encontrado", status:"Ativo",        categoria:"Documento",      emoji:"🪪" },
  { id:10, nome:"Garrafa térmica cinza",     local:"Sala de Aula",   data:"13/05/2026", tipo:"Perdido",    status:"Ativo",        categoria:"Outro",          emoji:"🫙" },
  { id:11, nome:"Guarda-chuva preto",        local:"Biblioteca",     data:"12/05/2026", tipo:"Encontrado", status:"Ativo",        categoria:"Outro",          emoji:"☂️" },
  { id:12, nome:"Pen drive 32GB",            local:"Sala de Aula",   data:"11/05/2026", tipo:"Perdido",    status:"Resolvido",    categoria:"Eletrônico",     emoji:"💾" },
];

export default function CampusAchadosPage() {
  const [busca,       setBusca]       = useState("");
  const [filtroTipo,  setFiltroTipo]  = useState<"Todos" | Tipo>("Todos");
  const [filtroCat,   setFiltroCat]   = useState<"Todas" | Categoria>("Todas");
  const [filtroLocal, setFiltroLocal] = useState<"Todos" | Local>("Todos");
  const [aba,         setAba]         = useState<"Todos" | Tipo>("Todos");

  const filtered = useMemo(() => ITEMS.filter((it) => {
    if (busca       && !it.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroTipo  !== "Todos" && it.tipo      !== filtroTipo)  return false;
    if (filtroCat   !== "Todas" && it.categoria !== filtroCat)   return false;
    if (filtroLocal !== "Todos" && it.local     !== filtroLocal) return false;
    if (aba         !== "Todos" && it.tipo      !== aba)         return false;
    return true;
  }), [busca, filtroTipo, filtroCat, filtroLocal, aba]);

  const perdidos    = ITEMS.filter(i => i.tipo === "Perdido").length;
  const encontrados = ITEMS.filter(i => i.tipo === "Encontrado").length;

  return (
    <main className={styles.root}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <Image className={styles.logoImg}
                                 src="/logo.png"
                                alt="Logo CampusAchados"
                                width={192}
                                height={192}
                                quality={1080}
                        />
            <span className={styles.brandName}>CampusAchados</span>
          </div>
          <button className={styles.btnCadastrar}>+ Cadastrar</button>
        </header>

        {/* Body */}
        <section className={styles.body}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.heading}>Itens</h2>
            <span className={styles.count}>{filtered.length} registros encontrados</span>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className={styles.searchInput}
            />
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value as "Todos" | Tipo)} className={styles.select}>
              <option value="Todos">Todos os tipos</option>
              <option value="Perdido">Perdido</option>
              <option value="Encontrado">Encontrado</option>
            </select>
            <select value={filtroCat} onChange={e => setFiltroCat(e.target.value as "Todas" | Categoria)} className={styles.select}>
              <option value="Todas">Todas as categorias</option>
              <option value="Eletrônico">Eletrônico</option>
              <option value="Livro/Material">Livro/Material</option>
              <option value="Documento">Documento</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Outro">Outro</option>
            </select>
            <select value={filtroLocal} onChange={e => setFiltroLocal(e.target.value as "Todos" | Local)} className={styles.select}>
              <option value="Todos">Todos os locais</option>
              <option value="Biblioteca">Biblioteca</option>
              <option value="Sala de Aula">Sala de Aula</option>
              <option value="Estacionamento">Estacionamento</option>
              <option value="Cantina">Cantina</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {(["Todos", "Perdido", "Encontrado"] as const).map((t) => {
              const label = t === "Todos" ? "Todos" : t === "Perdido" ? "Perdidos" : "Encontrados";
              const count = t === "Todos" ? ITEMS.length : t === "Perdido" ? perdidos : encontrados;
              return (
                <button key={t} onClick={() => setAba(t)} className={`${styles.tab} ${aba === t ? styles.tabActive : ""}`}>
                  {label} <span className={styles.tabCount}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* List */}
          <ul className={styles.list}>
            {filtered.length === 0 && <li className={styles.empty}>Nenhum item encontrado.</li>}
            {filtered.map((item, i) => (
              <li key={item.id} style={{ animationDelay: `${i * 45}ms` }}>
                <Link href={`/itemInfo/${item.id}`} className={styles.card}>
                  <div className={styles.cardIcon}>{item.emoji}</div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardNome}>{item.nome}</span>
                    <span className={styles.cardMeta}>{item.local} · {item.data}</span>
                    <div className={styles.tags}>
                      <span className={`${styles.tag} ${item.tipo === "Encontrado" ? styles.tagEncontrado : styles.tagPerdido}`}>{item.tipo}</span>
                      <span className={`${styles.tag} ${item.status === "Ativo" ? styles.tagAtivo : item.status === "Reivindicado" ? styles.tagReivindicado : styles.tagResolvido}`}>{item.status}</span>
                      <span className={`${styles.tag} ${styles.tagCategoria}`}>{item.categoria}</span>
                    </div>
                  </div>
                  <span className={styles.cardBtn} aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </main>
  );
}