// src/app/itens/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById, ITEMS, type Status, type Tipo } from "@/lib/lista/types";
import styles from "./info.module.css";


export function generateStaticParams() {
  return ITEMS.map((item: { id: number | string }) => ({ id: String(item.id) }));
}


export default async function ItemDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItemById(Number(id));
  if (!item) notFound();

  const statusClass: Record<Status, string> = {
    Ativo:        styles.tagAtivo,
    Reivindicado: styles.tagReivindicado,
    Resolvido:    styles.tagResolvido,
  };

  const tipoClass: Record<Tipo, string> = {
    Perdido:    styles.tagPerdido,
    Encontrado: styles.tagEncontrado,
  };

  return (
    <main className={styles.root}>
      <div className={styles.container}>

        {/* ── Back ── */}
        <Link href="/itens" className={styles.back}>
          ← Voltar para lista
        </Link>

        {/* ── Hero ── */}
        <div className={styles.hero}>
          <div className={styles.heroIcon}>{item.emoji}</div>
          <div className={styles.heroInfo}>
            <div className={styles.heroBadges}>
              <span className={`${styles.tag} ${tipoClass[item.tipo]}`}>{item.tipo}</span>
              <span className={`${styles.tag} ${statusClass[item.status]}`}>{item.status}</span>
              <span className={`${styles.tag} ${styles.tagCategoria}`}>{item.categoria}</span>
            </div>
            <h1 className={styles.heroNome}>{item.nome}</h1>
            <p className={styles.heroMeta}>
              <span>📍 {item.local}</span>
              <span>·</span>
              <span>📅 {item.data}</span>
            </p>
          </div>
        </div>

        <div className={styles.grid}>

          {/* ── Descrição ── */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Descrição</h2>
            <p className={styles.cardText}>{item.descricao}</p>
          </section>

          {/* ── Detalhes ── */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Detalhes do item</h2>
            <dl className={styles.dl}>
              <div className={styles.dlRow}>
                <dt className={styles.dt}>Categoria</dt>
                <dd className={styles.dd}>{item.categoria}</dd>
              </div>
              <div className={styles.dlRow}>
                <dt className={styles.dt}>Local</dt>
                <dd className={styles.dd}>{item.local}</dd>
              </div>
              <div className={styles.dlRow}>
                <dt className={styles.dt}>Data de registro</dt>
                <dd className={styles.dd}>{item.data}</dd>
              </div>
              {item.cor && (
                <div className={styles.dlRow}>
                  <dt className={styles.dt}>Cor</dt>
                  <dd className={styles.dd}>{item.cor}</dd>
                </div>
              )}
              {item.marca && (
                <div className={styles.dlRow}>
                  <dt className={styles.dt}>Marca</dt>
                  <dd className={styles.dd}>{item.marca}</dd>
                </div>
              )}
              <div className={styles.dlRow}>
                <dt className={styles.dt}>Status</dt>
                <dd className={styles.dd}>
                  <span className={`${styles.tag} ${statusClass[item.status]}`}>{item.status}</span>
                </dd>
              </div>
            </dl>
          </section>

          {/* ── Observações ── */}
          {item.observacoes && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Observações</h2>
              <p className={styles.cardText}>{item.observacoes}</p>
            </section>
          )}

          {/* ── Contato ── */}
          {(item.contatoNome || item.contatoEmail || item.contatoTelefone) && (
            <section className={`${styles.card} ${styles.cardContato}`}>
              <h2 className={styles.cardTitle}>Contato responsável</h2>
              <dl className={styles.dl}>
                {item.contatoNome && (
                  <div className={styles.dlRow}>
                    <dt className={styles.dt}>Nome</dt>
                    <dd className={styles.dd}>{item.contatoNome}</dd>
                  </div>
                )}
                {item.contatoEmail && (
                  <div className={styles.dlRow}>
                    <dt className={styles.dt}>E-mail</dt>
                    <dd className={styles.dd}>
                      <a href={`mailto:${item.contatoEmail}`} className={styles.link}>
                        {item.contatoEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {item.contatoTelefone && (
                  <div className={styles.dlRow}>
                    <dt className={styles.dt}>Telefone</dt>
                    <dd className={styles.dd}>
                      <a href={`tel:${item.contatoTelefone}`} className={styles.link}>
                        {item.contatoTelefone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
              <a
                href={`mailto:${item.contatoEmail}`}
                className={styles.btnContato}
              >
                Entrar em contato
              </a>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}