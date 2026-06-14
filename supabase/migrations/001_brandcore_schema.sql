-- BRANDCORE™ — Schema completo
-- Ejecuta este SQL en: Supabase Dashboard > SQL Editor > New query

-- CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  type text,
  website text,
  description text,
  created_at timestamptz default now()
);

-- STORYBRAND
create table if not exists storybrand (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  character text,
  external_problem text,
  internal_problem text,
  philosophical_problem text,
  guide_empathy text,
  guide_authority text,
  plan text,
  cta_direct text,
  cta_transitional text,
  failure text,
  success text,
  one_liner text,
  brandscript text,
  website_copy text,
  email_sequence text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- BRAND VOICE
create table if not exists brand_voice (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  archetype text,
  formality int default 5,
  humor int default 5,
  boldness int default 5,
  inspiration int default 5,
  yes_words text[],
  no_words text[],
  voice_guide text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- TAGLINES
create table if not exists taglines (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  tagline text,
  angle text,
  final_analysis text,
  is_selected boolean default false,
  created_at timestamptz default now()
);

-- SCRIPTS
create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  platform text,
  format text,
  hook text,
  content text,
  cta text,
  full_script text,
  created_at timestamptz default now()
);

-- OFFERS
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  offer_name text,
  dream_outcome text,
  target_audience text,
  price_point text,
  deliverables jsonb,
  offer_stack text,
  guarantee text,
  created_at timestamptz default now()
);

-- AUDIENCE RESEARCH
create table if not exists audience_research (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  demographics text,
  psychographics text,
  pain_points text,
  desires text,
  objections text,
  buying_triggers text,
  competitor_analysis text,
  created_at timestamptz default now()
);

-- CAMPAIGNS
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  campaign_name text,
  objective text,
  platform text,
  budget text,
  duration text,
  ads jsonb,
  created_at timestamptz default now()
);

-- ANALYTICS
create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  platform text,
  period_start date,
  period_end date,
  followers int,
  reach int,
  impressions int,
  engagement_rate numeric,
  top_content jsonb,
  notes text,
  created_at timestamptz default now()
);

-- STRATEGY REPORTS
create table if not exists strategy_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  month int,
  year int,
  summary text,
  wins text,
  opportunities text,
  actions jsonb,
  full_report text,
  created_at timestamptz default now()
);

-- Clientes iniciales
insert into clients (name, industry, type, website, description) values
  ('North Factory LLC', 'Agencia de Marketing Digital', 'agency', 'northfactory.com', 'Agencia de comunicación y marketing digital fundada por Carmen Victoria Pardo.'),
  ('Carmen Victoria Pardo', 'Marca Personal / Coaching & Negocios', 'personal_brand', 'carmenvictoriapardo.com', 'Empresaria, autora y estratega de negocios. Método C.R.E.A.R.™ Business. The Money Lab™.'),
  ('Midtown Doral', 'Centro Comercial / Retail & Gastronomía', 'business', '', 'Centro que reúne varios locales en Doral, FL. Marca de lugar, comunidad y experiencia.'),
  ('Rosita Manrique', 'Marca Personal', 'personal_brand', '', 'Marca personal. Industria por definir.'),
  ('Iliana Mestayer', 'Marca Personal', 'personal_brand', '', 'Marca personal. Industria por definir.'),
  ('Lizamell Cabrera', 'Salud / Doulas — Academia & Agencia', 'personal_brand', '', 'Doula certificada. Visión: academia de certificación de Doulas + agencia de posicionamiento.'),
  ('Ximena Yanez', 'Marca Personal', 'personal_brand', '', 'Marca personal. Industria por definir.');
