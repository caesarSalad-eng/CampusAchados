"use client";

import { useState } from "react";
import styles from "./cadastro.module.css";
import Image from "next/image";
interface FormData {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function CadastroPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Informe seu nome.";
    if (!form.email.includes("@")) e.email = "E-mail inválido.";
    if (form.password.length < 8) e.password = "Mínimo de 8 caracteres.";
    if (form.password !== form.confirm) e.confirm = "As senhas não coincidem.";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setLoading(true);
    try {
      // Substitua pela sua chamada real de cadastro
      await new Promise((res) => setTimeout(res, 1200));
      setSuccess(true);
    } catch {
      setErrors({ email: "Erro ao criar conta. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className={styles.root}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Conta criada!</h1>
          <p className={styles.subtitle}>
            Bem-vindo(a)! Sua conta foi criada com sucesso.
          </p>
          <a href="/login" className={styles.button} style={{ textDecoration: "none", display: "block", textAlign: "center" }}>
            Ir para o login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>
             <Image className={styles.logoImg}
                     src="/logo.png"
                    alt="Logo CampusAchados"
                    width={192}
                    height={192}
                    quality={1080}
            />
                        
                    </span>
          
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Preencha os dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Nome completo</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Digite Seu nome completo"
              value={form.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              aria-required="true"
              aria-describedby={errors.name ? "name-err" : undefined}
            />
            {errors.name && <span id="name-err" className={styles.fieldError} role="alert">{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              aria-required="true"
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && <span id="email-err" className={styles.fieldError} role="alert">{errors.email}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mín. 8 caracteres"
                value={form.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                aria-required="true"
                aria-describedby={errors.password ? "pass-err" : undefined}
              />
              {errors.password && <span id="pass-err" className={styles.fieldError} role="alert">{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm" className={styles.label}>Confirmar senha</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={form.confirm}
                onChange={handleChange}
                className={`${styles.input} ${errors.confirm ? styles.inputError : ""}`}
                aria-required="true"
                aria-describedby={errors.confirm ? "confirm-err" : undefined}
              />
              {errors.confirm && <span id="confirm-err" className={styles.fieldError} role="alert">{errors.confirm}</span>}
            </div>
          </div>

          <PasswordStrength password={form.password} />

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
            aria-busy={loading}
          >
            {loading ? <span className={styles.spinner} aria-hidden="true" /> : "Criar conta"}
          </button>
        </form>

        <p className={styles.login}>
          Já tem uma conta?{" "}
          <a href="/login" className={styles.loginLink}>Entrar</a>
        </p>
      </div>
    </main>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
  const colors = ["#ff4444", "#ff8800", "#f0b429", "#00c48c", "#00c48c"];

  return (
    <div style={{ marginTop: "-0.3rem" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: i < score ? colors[score] : "rgba(255,255,255,0.1)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.72rem", color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}