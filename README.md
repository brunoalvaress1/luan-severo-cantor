# Site do Luan Severo — Guia passo a passo

Este guia parte do zero: você nunca fez isso, então vamos com calma.

## O que este site já tem pronto
- Página Início, Sobre, Agenda (completa) e Contato
- Shows com data passada somem sozinhos automaticamente
- Painel `/admin` (login + dashboard) para adicionar/remover shows e editar textos/imagens
- Link de calendário (`.ics`) que o cantor pode assinar no iPhone/Google/Outlook, sempre atualizado com os shows confirmados

---

## PARTE 1 — Criar a conta no Supabase (o banco de dados)

1. Acesse **supabase.com** e crie uma conta gratuita.
2. Clique em **New Project**. Dê um nome (ex: `luan-severo`) e uma senha forte para o banco (guarde essa senha).
3. Espere ~2 minutos até o projeto ser criado.
4. No menu lateral, clique em **SQL Editor** > **New query**.
5. Abra o arquivo `supabase/schema.sql` (está na pasta do projeto que te entreguei), copie **todo o conteúdo** e cole no editor do Supabase.
6. Clique em **Run**. Isso cria as tabelas `shows` (a agenda) e `site_conteudo` (os textos/imagens editáveis).
7. Vá em **Authentication > Users > Add user**. Cadastre o e-mail e senha que o Luan vai usar para entrar em `/admin`. Esse é o login dele.
8. Vá em **Project Settings > API**. Copie os dois valores:
   - **Project URL**
   - **anon public key**

Guarde os dois, vamos usar no próximo passo.

---

## PARTE 2 — Configurar o projeto no seu computador

1. Instale o **Node.js** (versão 18 ou mais nova): nodejs.org
2. Abra a pasta do projeto no terminal (ou VS Code) e rode:
   ```
   npm install
   ```
3. Copie o arquivo `.env.local.example` e renomeie a cópia para `.env.local`.
4. Abra o `.env.local` e cole os valores que você copiou do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
5. Rode o site localmente para testar:
   ```
   npm run dev
   ```
6. Abra **http://localhost:3000** no navegador. O site deve aparecer.
7. Teste o painel: vá em **http://localhost:3000/admin/login** e entre com o e-mail/senha que você criou no Supabase (Parte 1, passo 7).

---

## PARTE 3 — Logo e imagens (upload direto, sem precisar de URL)

Isso agora é bem mais simples do que antes: o Supabase guarda as imagens que você envia direto no painel, sem precisar subir manualmente em lugar nenhum.

### 3.1 — Criar o bucket de imagens (uma vez só)

Se você já rodou o `schema.sql` antes desta atualização, rode só a parte nova no **SQL Editor** do Supabase:

```sql
insert into storage.buckets (id, name, public)
values ('imagens', 'imagens', true)
on conflict (id) do nothing;

create policy "Leitura publica de imagens" on storage.objects
  for select using (bucket_id = 'imagens');

create policy "Admin pode enviar imagens" on storage.objects
  for insert to authenticated with check (bucket_id = 'imagens');

create policy "Admin pode atualizar imagens" on storage.objects
  for update to authenticated using (bucket_id = 'imagens');

create policy "Admin pode apagar imagens" on storage.objects
  for delete to authenticated using (bucket_id = 'imagens');
```

Se for um projeto novo, isso já vem incluso quando você roda o `schema.sql` inteiro — não precisa fazer nada extra.

Para conferir se deu certo: no menu lateral do Supabase, vá em **Storage** — deve aparecer um bucket chamado **imagens**.

### 3.2 — Trocar a logo

1. Entre em `/admin/dashboard` > aba **Textos e imagens do site**.
2. No campo **logo url**, clique em escolher arquivo e selecione a imagem da logo do Luan (PNG com fundo transparente funciona melhor).
3. Pronto — assim que o upload terminar, a logo já aparece no cabeçalho do site no lugar do texto "LUAN SEVERO".
   - Se você apagar a imagem da logo (deixar vazio), o site volta a mostrar o texto automaticamente.

### 3.3 — Trocar a foto principal (hero) e fotos de shows

- Foto principal: mesma aba, campo **hero imagem url** — escolha o arquivo, é só isso.
- Foto de um show: na aba **Agenda de shows**, ao cadastrar um show novo, tem um campo **Foto do show** — escolha o arquivo antes de clicar em "Adicionar show".

---

## PARTE 4 — Colocar o site no ar (deploy)

1. Crie uma conta gratuita em **vercel.com** (recomendado — é feito pela mesma empresa do Next.js, usado neste projeto).
2. Suba o código do projeto para o **GitHub** (crie um repositório e envie os arquivos).
3. Na Vercel, clique em **Add New > Project**, escolha o repositório.
4. Em **Environment Variables**, adicione as mesmas 3 variáveis do seu `.env.local` (com a `NEXT_PUBLIC_SITE_URL` já sendo o domínio final, ex: `https://luansevero.com.br`).
5. Clique em **Deploy**. Em ~1 minuto o site estará no ar.
6. Se o Luan tiver um domínio próprio (ex: luansevero.com.br), configure em **Project Settings > Domains** na Vercel.

---

## PARTE 5 — O cantor usando o site no dia a dia

- Para adicionar um show: entrar em `seusite.com/admin/login` > aba **Agenda de shows** > preencher e clicar em **Adicionar show**.
- Para remover: clicar no ícone de lixeira ao lado do show na lista.
- Shows com data já passada **saem sozinhos** da Home e da Agenda — não precisa apagar manualmente.
- Para trocar textos/fotos: aba **Textos e imagens do site**.

---

## PARTE 6 — Conectar com o Google Calendar (bloqueio automático de datas)

Diferente da Apple, o Google tem uma API completa que permite o site criar e apagar eventos direto na agenda do Google do cantor.

### 6.1 — Criar as credenciais no Google Cloud

1. Acesse **console.cloud.google.com** e crie um projeto (ex: "Agenda Luan Severo").
2. **APIs e Serviços > Biblioteca** > procure **Google Calendar API** > **Ativar**.
3. **APIs e Serviços > Tela de consentimento OAuth**:
   - Tipo de usuário: **Externo**
   - Preencha nome do app, e-mail de suporte e de contato
   - Em **Usuários de teste**, adicione o e-mail do Gmail do Luan
4. **Credenciais > Criar Credenciais > ID do cliente OAuth**:
   - Tipo: **Aplicativo da Web**
   - Em **URIs de redirecionamento autorizados**, adicione:
     - `http://localhost:3000/api/admin/google/callback`
     - `https://SEUDOMINIO.com.br/api/admin/google/callback`
5. Copie o **Client ID** e o **Client Secret**.

⚠️ **Importante:** enquanto o app estiver em modo "Teste" (sem verificação do Google), a autorização expira a cada **7 dias**, e o Luan vai precisar clicar em "Conectar Google Calendar" de novo no painel. Isso é uma regra do Google para apps não verificados — verificar o app é um processo longo e não compensa para um único usuário.

### 6.2 — Pegar a chave de serviço do Supabase

1. No Supabase, vá em **Project Settings > API**.
2. Copie a chave **service_role** (é diferente da "anon public" que você já usa). Essa chave nunca deve aparecer no navegador — só é usada dentro das rotas de servidor do site.

### 6.3 — Preencher o `.env.local`

Adicione essas linhas (além das que você já tinha):
```
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/google/callback
```
Quando fizer o deploy, troque a `GOOGLE_REDIRECT_URI` para a URL de produção e adicione o mesmo valor nas variáveis de ambiente da Vercel.

### 6.4 — Rodar o SQL atualizado

Se você já tinha rodado o `schema.sql` antes, rode no **SQL Editor** do Supabase só a parte nova:
```sql
alter table shows add column if not exists google_event_id text;

create table if not exists google_tokens (
  id int primary key default 1,
  refresh_token text,
  access_token text,
  expiry_date bigint,
  connected_email text,
  updated_at timestamp with time zone default now(),
  constraint unica_linha check (id = 1)
);

alter table google_tokens enable row level security;
```

### 6.5 — Conectar

1. Rode `npm install` de novo (para instalar a nova dependência `googleapis`).
2. Entre em `/admin/dashboard`, clique em **Conectar Google Calendar**.
3. Faça login com a conta do Google do Luan e autorize.
4. Pronto — a partir de agora, todo show adicionado no painel cria um evento automaticamente na agenda do Google dele, e remover o show apaga o evento também.

---

## PARTE 7 — Sincronizar com o Apple Calendar (iPhone)

Não existe uma API pública da Apple para "escrever" direto no calendário de alguém (diferente do Google Calendar API). A solução usada aqui é um **link de assinatura de calendário (.ics)**, formato universal aceito por Apple, Google e Outlook:

**No iPhone:**
1. Ajustes > Calendário > Contas > Adicionar Conta
2. Escolher **Outra** > **Adicionar Assinatura de Calendário**
3. Colar o link: `https://seusite.com/api/ics`
4. Salvar

A partir daí, toda vez que o Luan adicionar ou remover um show no painel admin, o calendário do iPhone atualiza sozinho (pode levar de minutos a algumas horas, dependendo de como cada app sincroniza assinaturas externas).

---

## PARTE 8 — Página Sobre mais rica + formulário de contato com WhatsApp

Se você já tinha rodado o `schema.sql` antes desta atualização, rode este SQL novo no **SQL Editor** do Supabase:

```sql
alter table shows add column if not exists google_event_id text;

create table if not exists galeria_fotos (
  id uuid primary key default gen_random_uuid(),
  imagem_url text not null,
  legenda text,
  ordem int default 0,
  created_at timestamp with time zone default now()
);

alter table galeria_fotos enable row level security;

create policy "Leitura publica de galeria" on galeria_fotos for select using (true);
create policy "Admin insere na galeria" on galeria_fotos for insert to authenticated with check (true);
create policy "Admin apaga da galeria" on galeria_fotos for delete to authenticated using (true);

insert into site_conteudo (chave, valor) values
  ('sobre_imagem_principal', ''),
  ('sobre_frase_destaque', 'Escreva aqui uma frase marcante sobre a carreira do Luan.'),
  ('sobre_stat1_numero', '100+'),
  ('sobre_stat1_label', 'Shows realizados'),
  ('sobre_stat2_numero', '15'),
  ('sobre_stat2_label', 'Cidades percorridas'),
  ('sobre_stat3_numero', '5'),
  ('sobre_stat3_label', 'Anos de carreira'),
  ('whatsapp_numero', '5534999999999')
on conflict (chave) do nothing;
```

**Sobre a página Sobre:** no painel > aba **Textos e imagens do site**, agora tem campos pra foto principal, frase de destaque e 3 estatísticas (número + legenda). Na aba **Galeria de fotos**, é só clicar em "Adicionar foto" quantas vezes quiser — elas aparecem na página Sobre em uma grade, e clicando numa foto ela abre ampliada.

**Sobre o formulário de contato:** o campo `whatsapp_numero` (aba Textos e imagens) precisa estar no formato **só números, com código do país e DDD** — ex: `5534999999999` para o número (34) 99999-9999. Sem espaço, sem parênteses, sem traço. O visitante escolhe uma data livre no calendário (datas com show já marcado ficam bloqueadas automaticamente), preenche os dados, e ao clicar em "Enviar para o WhatsApp" abre uma conversa já com a mensagem pronta.

## PARTE 9 — Sobre em estilo revista, feed de Fotos & Vídeos, e correção do Google Calendar

### 9.1 — O que foi corrigido
O botão "Conectar Google Calendar" não funcionava por um bug no código (uso errado de uma função de redirecionamento). Já está corrigido — se ainda não conectou, tente de novo em `/admin/dashboard`.

Se mesmo assim não conectar, confira:
- As variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` estão certas no `.env.local`
- A `GOOGLE_REDIRECT_URI` é **exatamente igual** (mesma letra maiúscula/minúscula, com ou sem barra no final) à que você cadastrou no Google Cloud Console
- O e-mail do Luan foi adicionado como **usuário de teste** na Tela de Consentimento OAuth

### 9.2 — Rodar o SQL novo

No **SQL Editor** do Supabase:

```sql
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('foto', 'video')),
  midia_url text not null,
  capa_url text,
  legenda text,
  created_at timestamp with time zone default now()
);

alter table posts enable row level security;

create policy "Leitura publica de posts" on posts for select using (true);
create policy "Admin insere posts" on posts for insert to authenticated with check (true);
create policy "Admin apaga posts" on posts for delete to authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('posts', 'posts', true, 209715200)
on conflict (id) do nothing;

create policy "Leitura publica de posts bucket" on storage.objects for select using (bucket_id = 'posts');
create policy "Admin pode enviar posts" on storage.objects for insert to authenticated with check (bucket_id = 'posts');
create policy "Admin pode apagar posts bucket" on storage.objects for delete to authenticated using (bucket_id = 'posts');

insert into site_conteudo (chave, valor) values
  ('sobre_banner_imagem', ''),
  ('sobre_bloco1_titulo', 'As raízes'),
  ('sobre_bloco1_texto', 'Nascido em Leme, interior de São Paulo, Luan Severo cresceu ouvindo os discos de vinil do pai e cantando no coral da igreja aos domingos.'),
  ('sobre_bloco1_imagem', ''),
  ('sobre_bloco2_titulo', 'A virada'),
  ('sobre_bloco2_texto', 'Um vídeo cantando em um bar da cidade viralizou nas redes sociais e, em poucos meses, Luan já estava se apresentando em casas de show de todo o estado.'),
  ('sobre_bloco2_imagem', ''),
  ('sobre_bloco3_titulo', 'Hoje'),
  ('sobre_bloco3_texto', 'Hoje Luan Severo roda o Brasil com sua turnê, levando um som que mistura sertanejo raiz com toques contemporâneos.'),
  ('sobre_bloco3_imagem', '')
on conflict (chave) do nothing;
```

⚠️ **Sobre o tamanho dos vídeos:** o plano gratuito do Supabase tem limite de armazenamento total (1GB) e o bucket de posts está configurado para aceitar arquivos de até 200MB cada. Vídeos de shows inteiros podem ser pesados — vale a pena orientar o Luan a subir clipes curtos (alguns segundos a poucos minutos) em boa compressão, não o show completo. Se um dia isso virar um problema, dá pra migrar pra hospedar os vídeos no YouTube (modo "não listado") e só linkar aqui — me avise que eu adapto.

### 9.3 — Como usar

**Sobre:** no painel > aba **Textos e imagens do site**, agora tem um banner e 3 blocos (título + texto + imagem cada), todos preenchidos com um texto fictício de exemplo — troque pelo conteúdo real do Luan quando quiser.

**Feed de Fotos & Vídeos:** no painel > aba **Feed (Fotos & Vídeos)**. Escolha se é foto ou vídeo, envie o arquivo (vídeos pedem também uma foto de capa, que aparece antes de dar o play), escreva uma legenda curta se quiser, e clique em Publicar. Aparece na hora em `/videos` no site.

## PARTE 10 — Visual novo, painel reorganizado, correção do calendário e vídeo no banner

### 10.1 — Correção: o link de calendário (.ics) agora atualiza sozinho
Antes, o link `/api/ics` era "congelado" no momento da publicação do site: shows adicionados ou removidos depois **não apareciam** para quem tinha assinado o calendário. Isso foi corrigido — agora o link é gerado na hora, sempre com a lista real de shows. (A demora de sincronização do lado do iPhone/Google continua normal, cada app tem o seu intervalo.)

As rotas do Google Calendar (`connect`/`status`) também foram corrigidas pelo mesmo motivo — o "Conectado como..." no painel agora mostra o estado real.

Nada a fazer da sua parte além de publicar essa versão.

### 10.2 — Painel admin reorganizado
- As abas agora têm ícones e **rolam na horizontal no celular** (não estouram mais a tela).
- A aba **Textos e imagens** foi dividida em seções que abrem/fecham (Início, Redes sociais, Contato, Página Sobre, Números da carreira). Cada campo tem um nome claro em vez da "chave" crua do banco.
- Os campos agora **salvam ao sair do campo** (além do botão Salvar), e avisos aparecem como notificações no canto, sem `alerta` do navegador travando a tela.
- A lista de shows tem busca e marca quais já passaram / quais aparecem na home.

### 10.3 — Vídeo no banner da página Sobre
Na aba **Textos e imagens > Página "Sobre"** tem um campo novo: **Vídeo do banner (topo)**. Envie um clipe curto, sem som, e ele passa de fundo no topo da página Sobre. Regras de prioridade:
1. Se tiver **vídeo** enviado, ele aparece.
2. Senão, se tiver **foto de banner** enviada, ela aparece (e serve de imagem de espera enquanto o vídeo carrega).
3. Se não tiver nem um nem outro, o site usa um **vídeo de exemplo** que já vem no projeto (`public/videos/palco-exemplo.webm` — um pianista ao vivo, © Suyash Dwivedi, CC BY-SA 4.0). Troque pelo vídeo real do Luan quando tiver.

O vídeo do banner vai para o mesmo bucket `posts` do Feed (aceita arquivos grandes), então não precisa rodar SQL nenhum.

## Dúvidas comuns




**"O show que eu apaguei ainda aparece no meu iPhone."**
Calendários assinados (.ics) não atualizam na hora — cada app tem seu próprio intervalo de sincronização. Isso é normal.

**"Posso adicionar mais campos de texto editável?"**
Sim — basta rodar `insert into site_conteudo (chave, valor) values ('nome_do_campo', 'texto inicial');` no SQL Editor do Supabase, e o campo aparece automaticamente no painel admin.
