# 🎒 Campus Achados

Sistema web desenvolvido para auxiliar estudantes e instituições no gerenciamento de itens perdidos e encontrados dentro do ambiente acadêmico.

O projeto permite cadastrar objetos perdidos/encontrados, reivindicar itens e organizar todo o fluxo de recuperação de forma simples, moderna e intuitiva.

---

## ✨ Funcionalidades

- 🔐 Sistema de autenticação de usuários
- 👤 Perfil de aluno
- 📦 Cadastro de itens perdidos e encontrados
- 🖼️ Upload de imagens dos itens
- 🔎 Busca e filtragem de itens
- 📍 Organização por local do campus
- 🏷️ Categorias e ícones personalizados
- ✅ Sistema de reivindicação de itens
- 📊 Controle de status:
  - Ativo
  - Reivindicado
  - Entregue
- 🤖 Integração com Google GenAI
- 📱 Interface responsiva

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Python
- Django

### Banco de Dados
- PostgreSQL

### Frontend
- HTML5
- CSS3
- JavaScript

### Bibliotecas e Dependências
- Pillow
- Psycopg2
- Google GenAI
- Selenium
- Python Decouple

---

## 📂 Estrutura do Projeto

```bash
CampusAchados/
│
├── config/                # Configurações do Django
├── entidades/             # Aplicação principal
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── templates/
│   ├── static/
│   └── migrations/
│
├── media/                 # Uploads de imagens
├── requirements.txt
├── manage.py
└── .env
```

---

## ⚙️ Como Executar o Projeto

### 1️⃣ Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

---

### 2️⃣ Acesse a pasta

```bash
cd CampusAchados
```

---

### 3️⃣ Crie o ambiente virtual

#### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux/Mac
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 4️⃣ Instale as dependências

```bash
pip install -r requirements.txt
```

---

### 5️⃣ Configure o arquivo `.env`

Exemplo:

```env
DEBUG=True

DB_NAME=postgres
DB_USER=postgres.efelbrdtubpwxmpinpil
DB_HOST=aws-1-us-west-2.pooler.supabase.com
DB_PORT=5432

GOOGLE_API_KEY=sua_api_key
```

---

### 6️⃣ Execute as migrações

```bash
python manage.py migrate
```

---

### 7️⃣ Inicie o servidor

```bash
python manage.py runserver
```

---

## 🚀 Acesse o Projeto

```bash
http://127.0.0.1:8000/
```

---

## 🧠 Modelos Principais

### 👨‍🎓 Aluno
Responsável pelos dados dos usuários do sistema.

### 📦 Item
Representa os objetos perdidos ou encontrados.

### ✅ Reivindicação
Gerencia o processo de solicitação e validação de posse do item.

---

## 🎯 Objetivo do Projeto

O Campus Achados foi criado com o objetivo de facilitar a devolução de itens perdidos em ambientes acadêmicos, reduzindo a desorganização e aproximando estudantes de seus pertences através da tecnologia.

---

## 📸 Possíveis Melhorias Futuras

- 📲 Notificações em tempo real
- 🗺️ Mapa do campus
- 📧 Envio de emails automáticos
- 🤳 Login social
- 📱 Aplicativo mobile
- 🔔 Sistema de alertas inteligentes

---

## 👨‍💻 Autor

Desenvolvido por Kendall Ycaro, Arthur Henrique e Guilherme Pereira.

---

## 📄 Licença

Este projeto está sob a licença MIT.
