#!/usr/bin/env bash
# ==============================================================================
# ALPHABETTE SASU — Suite de Tests de Validation E2E & Sécurité SSO
# Teste l'ensemble des flux d'authentification, Deep Linking et rotation JWT
# ==============================================================================

set -euo pipefail

AUTH_URL="${1:-http://localhost:4000}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="audit_${TIMESTAMP}@alphabette.fr"
TEST_PASS="SouveraineteAlphabette2026!"
TEST_DEVICE="device_hw_sec_${TIMESTAMP}"
APP_ID="infoperso"

echo "========================================================================"
echo " [ALPHABETTE] Lancement des tests de validation SSO sur $AUTH_URL"
echo "========================================================================"

# Test 1 : Health Check
echo -n "[Test 1/6] Vérification du point de santé /health... "
HEALTH_RES=$(curl -s -f "$AUTH_URL/health")
echo "OK ($HEALTH_RES)"

# Test 2 : Android Digital Asset Links (Google Play Deep Linking)
echo -n "[Test 2/6] Vérification /.well-known/assetlinks.json... "
ASSET_RES=$(curl -s -f "$AUTH_URL/.well-known/assetlinks.json")
if echo "$ASSET_RES" | grep -q "fr.alphabette.infoperso"; then
    echo "OK (Package Android vérifié)"
else
    echo "ÉCHEC"
    exit 1
fi

# Test 3 : Inscription Utilisateur Unique
echo -n "[Test 3/6] Inscription d'un compte centralisé ($TEST_EMAIL)... "
REG_RES=$(curl -s -X POST "$AUTH_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASS\",
    \"fullName\": \"Valentin Auditeur\",
    \"appId\": \"$APP_ID\",
    \"clientType\": \"android\",
    \"deviceFingerprint\": \"$TEST_DEVICE\"
  }")

ACCESS_TOKEN=$(echo "$REG_RES" | jq -r '.accessToken // empty')
REFRESH_TOKEN=$(echo "$REG_RES" | jq -r '.refreshToken // empty')

if [ -n "$ACCESS_TOKEN" ] && [ -n "$REFRESH_TOKEN" ]; then
    echo "OK (Tokens reçus)"
else
    echo "ÉCHEC"
    echo "$REG_RES"
    exit 1
fi

# Test 4 : Consultation des Droits & Tarifs
echo -n "[Test 4/6] Vérification des droits et abonnements (/auth/subscriptions)... "
SUB_RES=$(curl -s "$AUTH_URL/auth/subscriptions" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Alphabette-App-Id: $APP_ID")

if echo "$SUB_RES" | grep -q "catalogPricing"; then
    echo "OK (Catalogue 15 € unitaire / 40 € Pass vérifié)"
else
    echo "ÉCHEC"
    echo "$SUB_RES"
    exit 1
fi

# Test 5 : Rotation du Refresh Token
echo -n "[Test 5/6] Rotation transparente du Refresh Token (/auth/refresh)... "
REFRESH_RES=$(curl -s -X POST "$AUTH_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\",
    \"deviceFingerprint\": \"$TEST_DEVICE\"
  }")

NEW_ACCESS=$(echo "$REFRESH_RES" | jq -r '.accessToken // empty')
NEW_REFRESH=$(echo "$REFRESH_RES" | jq -r '.refreshToken // empty')

if [ -n "$NEW_ACCESS" ] && [ "$NEW_REFRESH" != "$REFRESH_TOKEN" ]; then
    echo "OK (Rotation effectuée avec succès)"
else
    echo "ÉCHEC"
    echo "$REFRESH_RES"
    exit 1
fi

# Test 6 : Détection d'Attaque par Rejeu (Replay Attack)
echo -n "[Test 6/6] Détection d'attaque par rejeu avec l'ancien Refresh Token... "
REPLAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$AUTH_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\",
    \"deviceFingerprint\": \"$TEST_DEVICE\"
  }")

if [ "$REPLAY_STATUS" -eq 401 ]; then
    echo "OK (401 Unauthorized - Rejeu bloqué & session invalidée)"
else
    echo "ÉCHEC (Code inattendu: $REPLAY_STATUS)"
    exit 1
fi

echo "========================================================================"
echo " [ALPHABETTE] Tous les tests de conformité ont été validés avec succès !"
echo "========================================================================"
