CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users (id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'fulltime',
    company_market TEXT,
    skills TEXT[],
    location TEXT,
    remote BOOL DEFAULT false,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1
);