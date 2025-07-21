-- Create enum type for pocket categories
CREATE TYPE pocket_category AS ENUM ('home', 'emergency', 'trips', 'entertainment', 'studies', 'transportation', 'debt', 'other');

-- Create country_codes table
CREATE TABLE IF NOT EXISTS country_codes (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    phone BIGINT UNIQUE,
    code_id CHAR(36) NOT NULL REFERENCES country_codes(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthdate TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create pockets table
CREATE TABLE IF NOT EXISTS pockets (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL REFERENCES users(id),
    name VARCHAR(50) NOT NULL,
    category pocket_category NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL REFERENCES users(id),
    favorite_user_id CHAR(36) NOT NULL REFERENCES users(id),
    alias VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Insert some default country codes
INSERT INTO country_codes (id, name, code) VALUES
    (gen_random_uuid(), 'United States', 1),
    (gen_random_uuid(), 'Mexico', 52),
    (gen_random_uuid(), 'Canada', 1),
    (gen_random_uuid(), 'Spain', 34),
    (gen_random_uuid(), 'Colombia', 57)
ON CONFLICT DO NOTHING; 