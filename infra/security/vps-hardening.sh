#!/usr/bin/env bash
# ==============================================================================
# ALPHABETTE SASU — Script de Durcissement Serveur VPS OVH (Ubuntu 24.04 LTS)
# Configuration Pare-feu UFW, Fail2ban, Sysctl Kernel & Isolation Environnement
# ==============================================================================

set -euo pipefail

echo "========================================================================"
echo " [ALPHABETTE] Lancement du durcissement de l'hôte VPS OVH Ubuntu 24.04"
echo "========================================================================"

# 1. Mise à jour système et installation des outils essentiels de sécurité
echo "[1/5] Mise à jour des dépôts et paquets..."
apt-get update -q
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -q
apt-get install -y -q ufw fail2ban iptables-persistent curl ca-certificates jq

# 2. Configuration du Pare-feu UFW
echo "[2/5] Configuration UFW (Default Deny + Ports Web & SSH)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Autorisation SSH (par défaut 22 ou port personnalisé)
SSH_PORT=${SSH_PORT:-22}
ufw allow "${SSH_PORT}/tcp" comment "SSH sécurisé"

# Autorisation Web (Traefik / Coolify Reverse Proxy)
ufw allow 80/tcp comment "HTTP Let's Encrypt & Redirections"
ufw allow 443/tcp comment "HTTPS Sécurisé TLS"

# Bloquer explicitement les accès publics à PostgreSQL et Redis
ufw deny 5432/tcp comment "Interdiction externe PostgreSQL (réservé Docker)"
ufw deny 6379/tcp comment "Interdiction externe Redis (réservé Docker)"

# Activation UFW
ufw --force enable
echo "État UFW :"
ufw status verbose

# 3. Durcissement du Noyau Linux (sysctl.conf)
echo "[3/5] Application des règles sysctl anti-spoofing et anti-DDoS..."
SYSCTL_CONF="/etc/sysctl.d/99-alphabette-security.conf"
cat << 'EOF' > "$SYSCTL_CONF"
# Protection contre les attaques SYN Flood
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_synack_retries = 2

# Protection contre le Spoofing IP (RFC 3704)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignorer les paquets ICMP de redirection (anti-MITM)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Ignorer les messages de broadcast ICMP (anti-Smurf)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Désactiver le routage par la source
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Réduction de la fenêtre TIME_WAIT
net.ipv4.tcp_fin_timeout = 15
EOF

sysctl -p "$SYSCTL_CONF"

# 4. Configuration Fail2ban
echo "[4/5] Configuration de Fail2ban..."
JAIL_LOCAL="/etc/fail2ban/jail.local"
cat << 'EOF' > "$JAIL_LOCAL"
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
banaction = ufw

[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
bantime = 24h
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# 5. Sécurisation des fichiers d'environnement (.env)
echo "[5/5] Sécurisation des permissions de fichiers..."
if [ -d "/opt/alphabette" ]; then
    find /opt/alphabette -type f -name "*.env*" -exec chmod 600 {} +
    find /opt/alphabette -type f -name "*.env*" -exec chown root:root {} +
fi

echo "========================================================================"
echo " [ALPHABETTE] Durcissement terminé avec succès sur Ubuntu 24.04 LTS."
echo "========================================================================"
