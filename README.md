# TECH 221 - Gestion Interne

Application backend Node.js / Express / Prisma pour la gestion des employés, projets et affectations.

## Architecture

```
tech221/
├─ package.json
├─ .env
├─ .gitignore
├─ prisma/
│  └─ schema.prisma          ← Modèles Prisma (Departement, Employe, Projet, Affectation)
└─ src/
   ├─ app.js                  ← Configuration Express (middlewares, routes)
   ├─ server.js               ← Point d'entrée + connexion DB
   ├─ config/
   │  ├─ env.js               ← Variables d'environnement
   │  └─ db.js                ← Instance PrismaClient
   ├─ routes/
   │  ├─ index.js             ← Agrégation de toutes les routes (/api/v1)
   │  ├─ departement.routes.js
   │  ├─ employe.routes.js
   │  ├─ projet.routes.js
   │  └─ affectation.routes.js
   ├─ controllers/            ← Gestion req/res, délèguent au service
   ├─ services/               ← Logique métier & règles de gestion
   ├─ repositories/           ← Accès base de données via Prisma
   ├─ validations/            ← Schémas Zod (validation des inputs)
   ├─ middlewares/
   │  ├─ validate.js          ← Middleware Zod générique
   │  ├─ errorHandler.js      ← Gestion centralisée des erreurs
   │  └─ notFound.js          ← Route 404
   └─ utils/
      ├─ response.js          ← Helpers de réponse JSON standardisée
      └─ httpError.js         ← Classe d'erreur HTTP personnalisée
```

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données dans .env
DATABASE_URL="postgresql://user:password@host:port/database"

# Optionnel: si tu veux une DB locale, tu peux lancer PostgreSQL via `docker-compose.yml`
# et pointer `DATABASE_URL` dessus. Sinon, Docker n'est pas nécessaire.

# 3. Générer le client Prisma
npm run db:generate

# (Optionnel) Créer les tables via Prisma
# Si tu crées les tables manuellement, ne lance pas cette commande.
npm run db:migrate

# 4. Lancer en dev
npm run dev
```

## Endpoints API

Base URL : `http://localhost:3000/api/v1`

### Départements
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/departements` | Lister (query: `?archive=true`) |
| GET | `/departements/:id` | Détail |
| POST | `/departements` | Créer |
| PUT | `/departements/:id` | Modifier |
| PATCH | `/departements/:id/archive` | Archiver |
| DELETE | `/departements/:id` | Supprimer (bloqué si employés liés) |

Note: les routes `GET /departements` et `GET /departements/:id` renvoient aussi `sousDepartements: []` (objets) pour un département racine.

### Sous-départements
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/departements/:id/sous-departements` | Lister (query: `?archive=true`) |
| POST | `/departements/:id/sous-departements` | Créer (dépend d'un département) |
| GET | `/sous-departements/:id` | Détail |
| PUT | `/sous-departements/:id` | Modifier |
| PATCH | `/sous-departements/:id/archive` | Archiver |
| DELETE | `/sous-departements/:id` | Supprimer (bloqué si employés liés) |

### Employés
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/employes` | Lister |
| GET | `/employes/:id` | Détail |
| POST | `/employes` | Créer |
| PUT | `/employes/:id` | Modifier |
| DELETE | `/employes/:id` | Supprimer (bloqué si affectations) |

### Projets
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/projets` | Lister |
| GET | `/projets/:id` | Détail |
| GET | `/projets/:id/affectations` | Affectations d'un projet |
| POST | `/projets` | Créer |
| PUT | `/projets/:id` | Modifier (statut, dates) |
| DELETE | `/projets/:id` | Supprimer (bloqué si affectations) |

### Affectations
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/affectations` | Lister |
| GET | `/affectations/:id` | Détail |
| POST | `/affectations` | Créer (toutes les règles métier vérifiées) |
| PUT | `/affectations/:id` | Modifier rôle/date |
| DELETE | `/affectations/:id` | Supprimer |

## Implémenté

- Code département unique, min 2 caractères
- Email employé unique, téléphone validé (regex)
- Un employé doit appartenir à un département existant et non archivé
- Suppression département bloquée si employés liés
- dateFin projet >= dateDebut
- Projet TERMINÉ requiert une dateFin
- Affectation bloquée si projet TERMINÉ ou ANNULÉ
- Unicité (employeId, projetId) sur les affectations
- dateAffectation >= dateDebut du projet

---

## Déploiement sur Render

### Prérequis

- Un compte [Render](https://render.com)
- Un compte [GitHub](https://github.com)
- Un compte [Cloudinary](https://cloudinary.com) (pour les uploads d'images)

### Étape 1 : Préparer le projet

1. **S'assurer que tous les fichiers sont commités** :
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   ```

2. **Pousser vers GitHub** :
   ```bash
   git push origin main
   ```

### Étape 2 : Créer la base de données PostgreSQL sur Render

1. Se connecter à [Render Dashboard](https://dashboard.render.com)
2. Cliquer sur **New +** → **PostgreSQL**
3. Configurer :
   - **Name** : `tech221-db`
   - **Region** : Oregon (ou la plus proche)
   - **Database** : `tech221`
   - **User** : `tech221`
4. Cliquer sur **Create Database**
5. **Important** : Copier la `Internal Database URL` (elle sera utilisée pour `DATABASE_URL`)

### Étape 3 : Créer le service Web sur Render

1. Dans le dashboard Render, cliquer sur **New +** → **Web Service**
2. Connecter votre dépôt GitHub
3. Configurer le service :
   - **Name** : `tech221-api`
   - **Region** : Oregon
   - **Branch** : `main`
   - **Root Directory** : (laisser vide)
   - **Runtime** : Node
   - **Build Command** : `npm install && npx prisma generate`
   - **Start Command** : `npm start`

### Étape 4 : Configurer les variables d'environnement

Dans la section **Environment** du service Render, ajouter les variables suivantes :

| Clé | Valeur | Description |
|-----|--------|-------------|
| `NODE_ENV` | `production` | Mode production |
| `PORT` | `10000` | Port requis par Render |
| `DATABASE_URL` | (URL de PostgreSQL Render) | Connexion à la DB |
| `CLOUDINARY_CLOUD_NAME` | (votre cloud name) | Cloudinary |
| `CLOUDINARY_API_KEY` | (votre API key) | Cloudinary |
| `CLOUDINARY_API_SECRET` | (votre API secret) | Cloudinary |

### Étape 5 : Déployer

1. Cliquer sur **Create Web Service**
2. Render va automatiquement :
   - Installer les dépendances (`npm install`)
   - Générer le client Prisma (`npx prisma generate`)
   - Lancer l'application (`npm start`)

### Étape 6 : Vérifier le déploiement

- L'API sera disponible sur : `https://tech221-api.onrender.com`
- La documentation Swagger : `https://tech221-api.onrender.com/docs`

### Configuration Cloudinary

1. Se connecter à [Cloudinary Dashboard](https://cloudinary.com/users/login)
2. Aller dans **Settings** → **API Keys**
3. Copier :
   - **Cloud Name** (dans Overview)
   - **API Key**
   - **API Secret**

### Commandes utiles

```bash
#Voir les logs
render logs --tail -s tech221-api

#Redéployer manuellement
#Aller sur Render Dashboard → Deploy → Manual Deploy → Deploy latest
```

---

## Variables d'environnement

Voir le fichier [`.env.example`](.env.example) pour la liste complète des variables nécessaires.
