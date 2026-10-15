-- ============================================================================
-- ALPHABETTE SASU — Architecture Base de Données Centralisée PostgreSQL 16
-- VPS OVH (Ubuntu 24.04 LTS) - Déploiement Coolify
-- Modèle : Cloisonnement logique par schémas + Sécurité RLS + SSO Centralisé
-- Tarification intégrée : 15 €/an par app individuelle | 40 €/an Pass ALPHABETTE
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. SCHÉMA CENTRAL : AUTH_SSO (Utilisateurs, Sessions, Abonnements, Audit)
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS auth_sso;

-- Catalogue des applications de l'écosystème Alphabette (15 applications)
CREATE TABLE IF NOT EXISTS auth_sso.applications (
    app_id VARCHAR(64) PRIMARY KEY, -- 'infoperso', 'iadebat', 'oeildelatelier', etc.
    app_name VARCHAR(128) NOT NULL,
    domain_primary VARCHAR(128) NOT NULL UNIQUE, -- ex: 'infoperso.fr'
    android_package_name VARCHAR(128) NOT NULL UNIQUE, -- ex: 'fr.alphabette.infoperso'
    android_cert_sha256 VARCHAR(128) NOT NULL,
    annual_price_cents INTEGER NOT NULL DEFAULT 1500, -- 15,00 € TTC
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table centrale des comptes utilisateurs uniques Alphabette
CREATE TABLE IF NOT EXISTS auth_sso.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id ou bcrypt ($2b$12$)
    full_name VARCHAR(128),
    role VARCHAR(32) NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin', 'service')),
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON auth_sso.users(LOWER(email));

-- Abonnements & Droits d'accès : 15 €/an par application OU 40 €/an Pass ALPHABETTE
CREATE TABLE IF NOT EXISTS auth_sso.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    plan_type VARCHAR(32) NOT NULL CHECK (plan_type IN ('single_app', 'pass_alphabette')),
    app_id VARCHAR(64) REFERENCES auth_sso.applications(app_id), -- NULL si Pass ALPHABETTE
    amount_cents INTEGER NOT NULL, -- 1500 (15€) ou 4000 (40€)
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    payment_reference VARCHAR(128),
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE, -- Pas de prélèvement forcé (éthique ALPHABETTE)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_app_id_for_single CHECK (
        (plan_type = 'single_app' AND app_id IS NOT NULL) OR
        (plan_type = 'pass_alphabette' AND app_id IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_validity 
    ON auth_sso.subscriptions(user_id, expires_at) 
    WHERE is_active = TRUE;

-- Jetons Refresh Tokens sécurisés avec rotation obligatoire et empreinte appareil
CREATE TABLE IF NOT EXISTS auth_sso.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 du refresh token brut
    client_type VARCHAR(32) NOT NULL CHECK (client_type IN ('android', 'web')),
    app_id VARCHAR(64) NOT NULL REFERENCES auth_sso.applications(app_id),
    device_fingerprint VARCHAR(128) NOT NULL, -- Empreinte matérielle / navigateur
    ip_address INET,
    user_agent TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_lookup 
    ON auth_sso.refresh_tokens(token_hash) 
    WHERE is_revoked = FALSE;

-- Journal d'audit d'authentification et de sécurité
CREATE TABLE IF NOT EXISTS auth_sso.audit_events (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth_sso.users(id) ON DELETE SET NULL,
    app_id VARCHAR(64),
    event_type VARCHAR(64) NOT NULL, -- 'login_success', 'login_failed', 'token_refreshed', 'replay_attack_detected'
    ip_address INET,
    device_info TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON auth_sso.audit_events(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. SCHÉMAS MÉTIERS CLOISONNÉS (1 Schéma par application)
-- ----------------------------------------------------------------------------

-- A. Application Info-Perso (« Trier l'information avant de la subir »)
CREATE SCHEMA IF NOT EXISTS app_infoperso;

CREATE TABLE IF NOT EXISTS app_infoperso.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    selected_categories TEXT[] DEFAULT ARRAY['Général', 'Technologie', 'Économie'],
    noise_filter_level INT DEFAULT 3, -- Filtre anti-bruit de 1 à 5
    audio_playback_speed NUMERIC(3,2) DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_infoperso.saved_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    article_hash VARCHAR(64) NOT NULL,
    title TEXT NOT NULL,
    source_mention TEXT NOT NULL,
    score_bruit INT NOT NULL,
    script_podcast TEXT,
    debat_nuance JSONB,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, article_hash)
);

-- B. Application IADébat
CREATE SCHEMA IF NOT EXISTS app_iadebat;
CREATE TABLE IF NOT EXISTS app_iadebat.debates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    synthesis JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. Application L'Œil de l'Atelier
CREATE SCHEMA IF NOT EXISTS app_oeildelatelier;
CREATE TABLE IF NOT EXISTS app_oeildelatelier.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_sso.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. SEEDING INITIAL : APPLICATIONS DE L'ÉCOSYSTÈME ALPHABETTE
-- ----------------------------------------------------------------------------
INSERT INTO auth_sso.applications (app_id, app_name, domain_primary, android_package_name, android_cert_sha256, annual_price_cents)
VALUES 
    ('infoperso', 'Info-Perso', 'infoperso.fr', 'fr.alphabette.infoperso', '14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18', 1500),
    ('iadebat', 'IADébat', 'iadebat.fr', 'fr.alphabette.iadebat', '14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18', 1500),
    ('oeildelatelier', 'L''Œil de l''Atelier', 'oeildelatelier.fr', 'fr.alphabette.oeildelatelier', '14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18', 1500)
ON CONFLICT (app_id) DO UPDATE 
SET annual_price_cents = EXCLUDED.annual_price_cents;
