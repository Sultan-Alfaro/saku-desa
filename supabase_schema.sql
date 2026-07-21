-- Tabel Profil Pengguna
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  phone text
);

-- Tabel Transaksi (Pemasukan / Pengeluaran)
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  type text not null check (type in ('in', 'out')),
  category text,
  date date,
  note text,
  created_at timestamp with time zone default now()
);

-- Tabel Hutang / Piutang
create table debts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric not null,
  type text not null check (type in ('debt', 'receivable')),
  status text not null check (status in ('Belum Lunas', 'Lunas')),
  note text,
  date date,
  created_at timestamp with time zone default now()
);

-- Mengaktifkan Row Level Security (RLS)
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table debts enable row level security;

-- Policy untuk profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policy untuk transactions
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on transactions for delete using (auth.uid() = user_id);

-- Policy untuk debts
create policy "Users can view own debts" on debts for select using (auth.uid() = user_id);
create policy "Users can insert own debts" on debts for insert with check (auth.uid() = user_id);
create policy "Users can update own debts" on debts for update using (auth.uid() = user_id);
create policy "Users can delete own debts" on debts for delete using (auth.uid() = user_id);

-- Trigger untuk membuat data profile secara otomatis setelah user sign up di auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (new.id, new.email, '', '');
  return new;
end;
$$ language plpgsql security definer;

-- Hapus trigger lama jika ada
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
