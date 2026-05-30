"use client";

import { useState, useRef } from "react";
import styles from "./item.module.css";
 
type Tipo = "Perdido" | "Encontrado";
type Categoria = "Eletrônico" | "Documento" | "Vestuário" | "Acessório" | "Outro";
type Local = "Biblioteca" | "Sala 204" | "Estacionamento" | "Cantina" | "Outro";
 
interface FormData {
  titulo: string;
  tipo: Tipo;
  categoria: Categoria;
  local: Local;
  data: string;
  descricao: string;
  foto: File | null;
}
 
const today = new Date().toLocaleDateString("pt-BR");
 
const initialForm: FormData = {
  titulo: "",
  tipo: "Perdido",
  categoria: "Eletrônico",
  local: "Biblioteca",
  data: today,
  descricao: "",
  foto: null,
};
 
interface Props {
  onCancel?: () => void;
  onSubmit?: (data: FormData) => void;
}
 
export default function ItemPage({ onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
 
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, foto: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }
 
  function handleSubmit() {
    if (!form.titulo.trim()) return alert("Informe o título do item.");
    onSubmit?.(form);
  }
 
  return (
    <div className={styles.page}>
      
      <nav className={styles.navbar}>
        <span className={styles.logo}>🔍 CampusAchados</span>
        <button className={styles.cancelBtn} onClick={onCancel}>
          ← Cancelar
        </button>
      </nav>
 
      
      <div className={styles.card}>
        <h2 className={styles.title}>Cadastrar item</h2>
 
       
        <div className={styles.field}>
          <label className={styles.label} htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            className={styles.input}
            placeholder="Ex: Fone de ouvido preto"
            value={form.titulo}
            onChange={handleChange}
          />
        </div>
 
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" className={styles.select} value={form.tipo} onChange={handleChange}>
              <option>Perdido</option>
              <option>Encontrado</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="categoria">Categoria</label>
            <select id="categoria" name="categoria" className={styles.select} value={form.categoria} onChange={handleChange}>
              <option>Eletrônico</option>
              <option>Documento</option>
              <option>Vestuário</option>
              <option>Acessório</option>
              <option>Outro</option>
            </select>
          </div>
        </div>
 
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="local">Local</label>
            <select id="local" name="local" className={styles.select} value={form.local} onChange={handleChange}>
              <option>Biblioteca</option>
              <option>Sala 204</option>
              <option>Estacionamento</option>
              <option>Cantina</option>
              <option>Outro</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="data">Data</label>
            <div className={styles.dateWrapper}>
              <input
                id="data"
                name="data"
                className={styles.input}
                value={form.data}
                onChange={handleChange}
              />
              <span className={styles.dateIcon}>📅</span>
            </div>
          </div>
        </div>
 
        
        <div className={styles.field}>
          <label className={styles.label} htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            className={styles.textarea}
            placeholder="Descreva o item com detalhes para facilitar a identificação..."
            value={form.descricao}
            onChange={handleChange}
          />
        </div>
 
        
        <div className={styles.field}>
          <label className={styles.label}>Foto (opcional)</label>
          <div
            className={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className={styles.preview} />
            ) : (
              <>
                <span className={styles.uploadIcon}>⬆</span>
                <span className={styles.uploadText}>Clique para enviar uma foto</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </div>
        </div>
 
        
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Cadastrar item
        </button>
      </div>
    </div>
  );
}