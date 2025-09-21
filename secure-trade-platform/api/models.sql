-- users & roles
create table if not exists users (
id serial primary key,
email varchar(120) unique not null,
password_hash varchar(200) not null,
role varchar(24) not null check (role in ('ADMIN','TRADER','COMPLIANCE')),
created_at timestamptz default now()
);


-- trades
create table if not exists trades (
id serial primary key,
symbol varchar(16) not null,
side varchar(4) not null check (side in ('BUY','SELL')),
qty numeric(18,2) not null check (qty > 0),
price numeric(18,4) not null check (price > 0),
counterparty varchar(120) not null,
trade_ts timestamptz not null default now(),
status varchar(16) not null default 'NEW' check (status in ('NEW','CONFIRMED','CANCELLED')),
created_by integer references users(id)
);


-- settlements
create table if not exists settlements (
id serial primary key,
trade_id integer not null references trades(id) on delete cascade,
settlement_date date not null,
status varchar(16) not null default 'PENDING' check (status in ('PENDING','SETTLED','FAILED')),
cash_amount numeric(18,4) not null,
custodian varchar(120) not null,
created_at timestamptz default now(),
updated_at timestamptz default now()
);


-- audit log (append-only)
create table if not exists audit_log (
id serial primary key,
actor_email varchar(120) not null,
action varchar(32) not null,
entity varchar(32) not null,
entity_id integer,
before_state jsonb,
after_state jsonb,
ip varchar(64),
created_at timestamptz default now()
);


create index if not exists audit_created_idx on audit_log (created_at desc);