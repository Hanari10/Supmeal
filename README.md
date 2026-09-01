# SUPMEAL

**SUPMEAL** est une application web de gestion de recettes et de planification de repas. Elle permet de centraliser ses recettes, organiser ses repas, générer des listes de courses et partager des recettes à travers des cookbooks collaboratifs.

# Sommaire

- [1. Introduction](#1-introduction)
- [2. Fonctionnalités principales](#2-fonctionnalités-principales)
- [3. Installation et configuration](#3-installation-et-configuration)
- [4. Structure du projet](#4-structure-du-projet)
- [5. Déploiement via Docker](#5-déploiement-via-docker)
- [6. Description des composants Docker](#6-description-des-composants-docker)
- [7. Documentation](#7-documentation)
- [8. Auteure](#8-auteure)

## 1. Introduction

**SUPMEAL** est une plateforme de gestion de recettes composée de trois éléments principaux :

- **Backend** : une API REST développée avec **NestJS**, **TypeScript** et **Prisma ORM**, assurant la logique métier, l'authentification et l'accès aux données.
- **Frontend** : une application web développée avec **React**, **Vite**, **TypeScript** et **PrimeReact**.
- **Base de données** : une base **PostgreSQL** utilisée pour stocker les utilisateurs, recettes, ingrédients, cookbooks, plannings et listes de courses.

L'application intègre également une authentification par **JWT et Google OAuth2**, ainsi que **Socket.IO** pour la messagerie instantanée des cookbooks.

## 2. Fonctionnalités principales

- **Authentification et profil** : création de compte, connexion, Google OAuth2, modification du profil et changement de mot de passe.
- **Gestion des recettes** : création, consultation, modification et suppression de recettes avec ingrédients, quantités, instructions, images, tags et favoris.
- **Recherche et filtrage** : recherche par nom, description, ingrédients, tags et différents critères.
- **Planning des repas** : organisation des recettes par jour, type de repas et nombre de portions.
- **Liste de courses** : génération automatique à partir du planning avec regroupement des ingrédients.
- **Cookbooks collaboratifs** : partage de recettes entre utilisateurs avec différents rôles et permissions.
- **Commentaires et messagerie** : commentaires sur les recettes partagées et échanges en temps réel dans les cookbooks.
- **Import et export** : importation et exportation des données de l'utilisateur.

## 3. Installation et configuration

### Prérequis

- **Git**
- **Docker** et **Docker Compose**
- **Node.js** et **npm** pour un lancement sans Docker

### 1. Cloner le dépôt

```bash
git clone https://github.com/Hanari10/Supmeal.git
cd Supmeal
```

### 2. Configuration

Les fichiers `.env.example` présents dans le projet indiquent les variables d'environnement nécessaires.

Les principales variables concernent :

- la connexion à PostgreSQL ;
- le secret JWT ;
- Google OAuth2 ;
- l'URL du frontend.

Les secrets réels ne doivent pas être enregistrés dans le dépôt Git.

### 3. Installation manuelle

#### Backend

```bash
cd serveur
npm install
npx prisma generate
npm run start:dev
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

Pour une installation et une configuration plus détaillées, consulter la documentation technique disponible dans le dossier `documentation/`.

## 4. Structure du projet

```text
SUPMEAL/
├── client/                # Application web React/Vite
│   ├── src/               # Pages, composants, services et types
│   ├── Dockerfile
│   └── nginx.conf
├── serveur/               # API NestJS
│   ├── prisma/            # Schéma et migrations de la base de données
│   ├── src/               # Modules et logique métier
│   └── Dockerfile
├── documentation/         # Documentation complète du projet
│   ├── images/
│   ├── documentation-technique.md
│   ├── manuel-utilisateur.md
│   ├── conception.md
│   ├── modele-de-donnees.md
│   └── suivi-du-projet.md
├── docker-compose.yml     # Orchestration des services
└── README.md
```

## 5. Déploiement via Docker

Le projet est entièrement conteneurisé.

Depuis la racine :

```bash
docker compose up --build
```

Pour lancer les services en arrière-plan :

```bash
docker compose up -d --build
```

L'application web est ensuite accessible à l'adresse :

```text
http://localhost:8080
```

Pour arrêter les services :

```bash
docker compose down
```

## 6. Description des composants Docker

Le fichier `docker-compose.yml` orchestre trois services principaux :

- `frontend` : application React compilée et servie avec **Nginx** ;
- `backend` : API **NestJS** et accès aux données avec **Prisma** ;
- `postgres` : base de données **PostgreSQL**.

Des volumes Docker assurent la persistance de la base de données et des images de recettes.

## 7. Documentation

La documentation détaillée est disponible dans le dossier [`documentation`](documentation/).

Elle comprend notamment :

- la documentation technique et le guide de déploiement ;
- le manuel utilisateur ;
- les choix de conception ;
- le modèle de données et les diagrammes ;
- le suivi du développement.

## 8. Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation **SUPINFO**.

Dépôt GitHub : https://github.com/Hanari10/Supmeal