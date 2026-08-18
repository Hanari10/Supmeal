# SUPMEAL

SUPMEAL est une application web de gestion de recettes et de planification de repas développée dans le cadre d'un projet individuel SUPINFO.

L'objectif de l'application est de proposer une solution permettant de centraliser ses recettes, gérer leurs ingrédients, organiser ses repas et générer des listes de courses depuis une interface unique.

Le projet repose sur une architecture composée de trois briques distinctes :

- un client web React ;
- une API REST NestJS ;
- une base de données PostgreSQL.

L'ensemble de l'application peut être déployé avec Docker Compose.

---

## Fonctionnalités

### Authentification et profil

SUPMEAL dispose d'un système d'authentification permettant :

- la création d'un compte ;
- la connexion à un compte existant ;
- l'authentification par JWT ;
- la protection des routes privées ;
- la modification des informations du profil ;
- le changement de mot de passe.

Les mots de passe ne sont pas stockés en clair dans la base de données.

### Recettes

L'utilisateur peut :

- créer une recette ;
- consulter ses recettes ;
- modifier une recette ;
- supprimer une recette ;
- renseigner une description ;
- renseigner les instructions de préparation ;
- définir le temps de préparation ;
- définir le temps de cuisson ;
- définir le nombre de portions ;
- définir la difficulté ;
- ajouter une image ;
- ajouter plusieurs ingrédients avec quantité et unité ;
- modifier ou supprimer les ingrédients d'une recette ;
- ajouter une recette aux favoris.

Les images peuvent être sélectionnées directement depuis le stockage de l'utilisateur puis envoyées au serveur.

### Ingrédients

Une section dédiée permet de gérer les ingrédients utilisés dans les recettes.

Les ingrédients peuvent ensuite être associés aux recettes avec :

- une quantité ;
- une unité de mesure ;
- un ordre d'affichage.

### Recherche

La liste des recettes dispose d'un système de recherche permettant notamment de rechercher une recette à partir de son contenu ou de ses ingrédients.

### Favoris

Les recettes peuvent être ajoutées ou retirées des favoris.

Une page dédiée permet de retrouver rapidement les recettes favorites.

### Planning des repas

SUPMEAL permet de planifier des recettes afin d'organiser les repas.

L'utilisateur peut notamment :

- ajouter une recette au planning ;
- définir un jour de la semaine ;
- définir un type de repas ;
- choisir le nombre de portions ;
- modifier une planification ;
- supprimer une planification.

### Liste de courses

Une liste de courses peut être générée à partir des recettes planifiées.

Les ingrédients identiques utilisant la même unité sont regroupés automatiquement et leurs quantités sont additionnées.

Par exemple, deux recettes nécessitant respectivement `200 g` et `300 g` de farine produisent une entrée de `500 g` de farine dans la liste de courses.

### Cookbooks

L'application permet de créer et gérer des cookbooks afin de regrouper des recettes.

Selon son rôle dans le cookbook, un utilisateur peut notamment :

- consulter les recettes du cookbook ;
- ajouter une de ses recettes personnelles au cookbook ;
- retirer une recette du cookbook sans la supprimer ;
- gérer les membres du cookbook ;
- consulter les rôles des membres.

Les rôles actuellement utilisés sont :

- créateur ;
- éditeur ;
- lecteur ;
- commentateur.

Les fonctionnalités collaboratives avancées comme les commentaires, la messagerie instantanée et les invitations complètes restent des évolutions possibles.

### Import et export

SUPMEAL permet d'importer et d'exporter des données afin de faciliter leur sauvegarde ou leur transfert.

L'import et l'export prennent en charge les recettes et les cookbooks.

---

## Fonctionnalités prévues ou à approfondir

Certaines fonctionnalités prévues dans le cahier des charges constituent des pistes d'évolution du projet :

- authentification OAuth2 ;
- gestion avancée des membres et permissions des cookbooks ;
- commentaires sur les recettes partagées ;
- messagerie instantanée au sein des cookbooks ;
- recherche et filtrage avancés supplémentaires ;
- préférences culinaires et allergies ;
- conversion automatique des unités, par exemple `1000 g` vers `1 kg`.

Ces fonctionnalités pourront être ajoutées dans de futures versions de SUPMEAL.

---

## Technologies utilisées

### Client web

- React
- TypeScript
- Vite
- PrimeReact
- React Router
- Axios

### Serveur

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- JWT

### Base de données

- PostgreSQL

### Déploiement

- Docker
- Docker Compose
- Nginx

---

## Architecture

SUPMEAL utilise une architecture en trois parties :

```text
┌──────────────────────┐
│                      │
│     Client React     │
│                      │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│                      │
│     API NestJS       │
│                      │
└──────────┬───────────┘
           │
           │ Prisma ORM
           ▼
┌──────────────────────┐
│                      │
│     PostgreSQL       │
│                      │
└──────────────────────┘
```

Le client web sert d'interface utilisateur et communique avec l'API REST.

Le serveur contient la logique métier, assure l'authentification et réalise les opérations nécessaires sur les données.

Prisma assure l'accès à PostgreSQL.

---

## Structure du projet

```text
SUPMEAL/
│
├── client/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
│
├── serveur/
│   ├── prisma/
│   ├── src/
│   └── Dockerfile
│
├── documentation/
│   ├── images/
│   ├── README.md
│   ├── documentation-technique.md
│   ├── manuel-utilisateur.md
│   ├── conception.md
│   ├── modele-de-donnees.md
│   └── suivi-du-projet.md
│
├── docker-compose.yml
└── README.md
```

---

# Installation et lancement

## Prérequis

Pour lancer SUPMEAL avec Docker, il faut disposer de :

- Git ;
- Docker ;
- Docker Compose.

Pour le développement sans Docker, Node.js et npm sont également nécessaires.

---

## Récupération du projet

Cloner le dépôt :

```bash
git clone https://github.com/Hanari10/Supmeal.git
```

Puis entrer dans le dossier :

```bash
cd Supmeal
```

---

## Variables d'environnement

L'application nécessite certaines variables d'environnement pour fonctionner.

Les secrets réels ne doivent jamais être enregistrés dans le dépôt Git.

Un fichier `.env` doit être créé à partir des exemples fournis dans le projet lorsque cela est nécessaire.

Exemple :

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=CHANGE_ME
```

Les valeurs ci-dessus sont uniquement des exemples et doivent être remplacées par les valeurs correspondant à l'environnement utilisé.

---

# Lancement avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Pour lancer les conteneurs en arrière-plan :

```bash
docker compose up -d --build
```

Docker Compose démarre les trois services principaux :

- le client web ;
- le serveur ;
- PostgreSQL.

Pour vérifier leur état :

```bash
docker compose ps
```

Pour arrêter l'application :

```bash
docker compose down
```

Les données PostgreSQL sont conservées grâce à un volume Docker.

> Attention : l'utilisation de `docker compose down -v` supprime également les volumes et peut donc supprimer les données persistantes de la base.

---

# Lancement en développement

## Serveur

Se placer dans :

```bash
cd serveur
```

Installer les dépendances :

```bash
npm install
```

Puis lancer le serveur :

```bash
npm run start:dev
```

---

## Client

Dans un autre terminal :

```bash
cd client
```

Installer les dépendances :

```bash
npm install
```

Puis lancer le client :

```bash
npm run dev
```

---

## Base de données

Le serveur nécessite une instance PostgreSQL fonctionnelle.

Dans l'environnement de développement du projet, PostgreSQL peut être démarré avec Docker.

En cas d'erreur Prisma de type :

```text
ECONNREFUSED
```

il faut notamment vérifier que le conteneur PostgreSQL est démarré :

```bash
docker compose ps
```

---

# Vérification du projet

Avant un commit ou un déploiement, le client et le serveur peuvent être vérifiés avec ESLint et leur système de build.

## Serveur

```bash
cd serveur

npm run lint
npm run build
```

## Client

```bash
cd client

npm run lint
npm run build
```

---

# Sécurité

Plusieurs mesures sont mises en place afin de protéger l'application et les données :

- les mots de passe ne sont pas stockés en clair ;
- l'authentification utilise des jetons JWT ;
- les routes nécessitant une authentification sont protégées ;
- les opérations sur les données sont contrôlées côté serveur ;
- les secrets sont configurés avec des variables d'environnement ;
- aucun secret réel ne doit être versionné dans Git.

Les fichiers `.env` contenant des informations sensibles doivent être exclus du dépôt.

---

# Documentation

La documentation complète du projet se trouve dans le dossier :

```text
documentation/
```

Elle comprend notamment :

- la documentation technique ;
- le manuel utilisateur ;
- les choix de conception ;
- le modèle de données ;
- les diagrammes ;
- le suivi du développement.

---

# État du projet

La version actuelle fournit les principales fonctionnalités de gestion personnelle de recettes et de planification de repas.

L'architecture Docker permet de déployer ensemble le client web, l'API et PostgreSQL.

Certaines fonctionnalités collaboratives avancées prévues dans le cahier des charges restent des axes d'évolution, notamment OAuth2, la messagerie instantanée, les commentaires et la gestion avancée des permissions des cookbooks.

---

# Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation SUPINFO.