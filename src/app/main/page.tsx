"use client";
import Image from "next/image";
import styles from "./main.module.css";
import { useState } from "react";

type BadgeVariant = "found" | "lost" | "active" | "claimed";
 
interface Item {
  id: number;
  icon: string;
  name: string;
  meta: string;
  badges: BadgeVariant[];
}
 
interface Stat {
  label: string;
  value: number;
}
 
const STATS: Stat[] = [// Dados de exemplo para estatísticas
  { label: "Itens perdidos", value: 12 },
  { label: "Itens encontrados", value: 8 },
  { label: "Devolvidos", value: 34 },
];
 
const ITEMS: Item[] = [// Dados de exemplo para itens perdidos/encontrados
  {
    id: 1,
    icon: "🎧",
    name: "Fone de ouvido preto",
    meta: "Encontrado na Biblioteca · hoje às 14h",
    badges: ["found", "active"],
  },
  {
    id: 2,
    icon: "📓",
    name: "Caderno de Cálculo II",
    meta: "Perdido na Sala 204 · ontem",
    badges: ["lost", "active"],
  },
  {
    id: 3,
    icon: "💳",
    name: "Carteira com documentos",
    meta: "Encontrado no Estacionamento · há 2 dias",
    badges: ["found", "claimed"],
  },
];
 
const badgeClassMap: Record<BadgeVariant, string> = {
  found: styles.badgeFound,
  lost: styles.badgeLost,
  active: styles.badgeActive,
  claimed: styles.badgeClaimed,
};
 
const badgeLabels: Record<BadgeVariant, string> = {
  found: "Encontrado",
  lost: "Perdido",
  active: "Ativo",
  claimed: "Reivindicado",
};
 
function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span className={`${styles.badge} ${badgeClassMap[variant]}`}>
      {badgeLabels[variant]}
    </span>
  );
}
 
function StatCard({ label, value }: Stat) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
    </div>
  );
}
 
function ItemCard({ item }: { item: Item }) {
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemIcon}>{item.icon}</div>
      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemMeta}>{item.meta}</p>
        <div className={styles.badges}>
          {item.badges.map((b) => (
            <Badge key={b} variant={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);
 
  return (
    <div className={styles.app}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Image className={styles.logoImg}
    src="/logo.png"
    alt="Logo CampusAchados"
    width={74}
    height={74}
    quality={1080}
  />
          <span>CampusAchados</span>
          </div>
        <div className={styles.navButtons}>
          <button className={styles.navBtn}>Itens</button>
          <button className={styles.navBtnPrimary}>+ Cadastrar</button>
          <button className={styles.navBtn}>👤 João</button>
        </div>
      </nav>
 
      <div className={styles.content}>
        {showAlert && (
          <div className={styles.alert}>
            <span className={styles.alertText}>✓ Bem-vindo(a) de volta, João!</span>
            <button className={styles.alertClose} onClick={() => setShowAlert(false)}>
              ×
            </button>
          </div>
        )}
 
        <h2 className={styles.greeting}>Olá, João!</h2>
        <p className={styles.greetingSub}>Veja o que está acontecendo no campus</p>
 
        <div className={styles.stats}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
 
        <p className={styles.sectionTitle}>Adicionados recentemente</p>
        <div className={styles.itemsList}>
          {ITEMS.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}