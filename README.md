# OracolO v2 — Fase 0/F1a
Home v2 (concept: HOME_V2_CONCEPT.md). Consuma le API v1 same-origin.

## Setup locale
    npm install
    npm run dev        # proxy /analisi -> VPS (vite.config.js)

## Deploy sul VPS
1. clonare il repo in /opt/oracolo-v2
2. npm install && bash deploy_v2.sh
3. aggiungere nginx_v2.conf al server block + nginx -s reload
4. https://oracolo.bet/v2/

## Regole (da ARCHITETTURA_V2.md)
- v1 intoccabile; questo repo non scrive mai in /var/www/oracolo
- niente credenziali nel codice (.env.example)
- ogni fase chiusa prima della successiva
