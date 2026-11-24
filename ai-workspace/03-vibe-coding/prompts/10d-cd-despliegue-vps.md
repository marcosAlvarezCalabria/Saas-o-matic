# Prompt 10d · CD: desplegar la api en el VPS

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** cuando un push a `main` pasa el CI, la api se despliega sola en el VPS y se comprueba que responde.

&nbsp;

**Por qué está escrito así**

El job `deploy` va en el mismo `ci.yml`, con `needs: checks`: si algo falla, no se despliega.

Se conecta por SSH con una clave que solo sirve para esto. La huella del VPS va en un secreto: nada de `StrictHostKeyChecking=no`, que aceptaría cualquier servidor.

En el VPS solo hace `git pull --ff-only` y `docker compose up -d --build`. Si alguien tocó el repo del VPS a mano, el `--ff-only` falla en vez de mezclar cambios.

El último paso llama a `/health` por HTTPS, como lo haría el navegador. Así se prueba todo el camino: DNS, Caddy, certificado y api.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/02-despliegue.md (decisiones
y tabla de variables).
No toques nada fuera de .github/workflows/ci.yml.
Haz solo este prompt y para.

1. En ci.yml, un job deploy:
   - needs: checks
   - if: github.event_name == 'push' && github.ref == 'refs/heads/main'
   - concurrency: group deploy-production, cancel-in-progress false (un
     despliegue no se corta a medias).
   - environment: production
   - Pasos:
     · Preparar SSH: escribir secrets.VPS_SSH_KEY en ~/.ssh/deploy_key
       (chmod 600) y secrets.VPS_KNOWN_HOSTS en ~/.ssh/known_hosts.
     · ssh -i ~/.ssh/deploy_key ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}
       con: set -e; cd ~/saas-o-matic; git pull --ff-only;
       docker compose --profile prod up -d --build;
       docker image prune -f
     · Comprobar https://${{ vars.API_DOMAIN }}/health con curl --fail,
       hasta 10 intentos con 6 s de espera. Si no responde, el job falla.
   Sin acciones de terceros para el SSH: ssh y curl del runner.

Commit: ci: desplegar la api en el VPS tras el CI
```

---

&nbsp;

**Qué revisaremos al terminar**

`deploy` no corre en pull requests.

No hay `StrictHostKeyChecking=no` en ningún sitio.

La clave solo se usa desde el archivo y no se imprime en el log.

Prueba real: un push a `main` con el CI en verde despliega la api y el último paso da 200.
