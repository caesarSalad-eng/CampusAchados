"use client";
import { useState } from "react";
import styles from "./login.module.css";
import Image from "next/image";

export default function LoginPage() {
    const[email ,setEmail] = useState("");
    const[password ,setPassword] = useState("");
    const[loading ,setLoading] = useState(false);
    const[error ,setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try{//ainda vai ser implementado a parte de autenticação}
            await new Promise((res) => setTimeout(res, 1200));
        } catch {
            setError("An error occurred while logging in");
        } finally {
            setLoading(false);
        }
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
                    <h1 className={styles.title}>Olá, Bem-vindo!</h1>
                    <p className={styles.subtitle}>Faça login para continuar</p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input 
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="achados@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        aria-required="true"
                        />
                    </div>
                    <div className={styles.field}>
                        <div className={styles.labelRow}>
                            <label htmlFor="password" className={styles.label}>Senha</label>
                            <a href="/forgot-password" className={styles.forgot}>Esqueci minha senha</a>
                        </div>
                        <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        aria-required="true"
                        />
                    </div>

                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                    <button
                    type="submit"
                    className={styles.button}
                    aria-busy={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner} aria-hidden="true"></span>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>
                <p className={styles.sregister}>
                    Não tem uma conta? 
                    <a href="./cadastro" className={styles.registerLink}>Cadastre-se
                    </a>
                </p>
            </div>
        </main>
     );
}
