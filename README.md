# Noto TMS — Interaktivno uputstvo

## Fajlovi

| Fajl | Opis |
|------|------|
| `index.html` | Installer stranica — korisnici dolaze ovde i prevlače bookmark |
| `admin.html` | Admin panel — dodavanje/brisanje/sortiranje koraka |
| `bookmarklet.js` | Skript koji se injektuje u Noto TMS (fetchuje korake sa GitHub-a) |
| `steps.json` | Koraci uputstva |
| `staticwebapp.config.json` | Azure konfiguracija (CORS, routing) |

---

## Postavljanje na Azure

### 1. GitHub repo
Napravi novi GitHub repo i pushuj sve fajlove:
```bash
git init
git add .
git commit -m "Initial Noto tour"
git remote add origin https://github.com/TVOJ_USER/REPO_NAME.git
git push -u origin main
```

### 2. Azure Static Web App
1. Otvori [portal.azure.com](https://portal.azure.com)
2. Kreiraj **Static Web App**
3. Poveži na GitHub repo
4. App location: `/`
5. Output location: ostavi prazno

### 3. Podesi URL-ove
U `index.html` i `bookmarklet.js` promeni:
```
GITHUB_USER → tvoj GitHub username
REPO_NAME   → naziv repo-a
```

Bookmarklet fetchuje `steps.json` sa:
```
https://raw.githubusercontent.com/GITHUB_USER/REPO_NAME/main/steps.json
```

---

## Korišćenje admin panela

1. Otvori `https://tvoj-sajt.azurestaticapps.net/admin.html`
2. U desnom panelu unesi GitHub podešavanja (čuvaju se u localStorage)
3. Dodaj/uredi/sortiraj korake
4. Klikni **Sačuvaj na GitHub** — Azure automatski redeploya za ~30 sekundi

### GitHub Personal Access Token
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klikni **Generate new token**
3. Scope: čekiraj `repo`
4. Kopiraj token i unesi u admin panel

---

## Kako korisnici koriste uputstvo

1. Otvore `https://tvoj-sajt.azurestaticapps.net`
2. Prevuku bookmark dugme u bookmark bar
3. Odu na Noto TMS
4. Kliknu bookmark → overlay se pojavi
5. Navigacija: `←` `→` strelice ili dugmad, `Esc` zatvara
