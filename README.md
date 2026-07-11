# SUPMEAL

SUPMEAL est une application web de gestion de recettes et de planification de repas.

Elle permet aux utilisateurs de créer et organiser leurs recettes personnelles, de collaborer dans des livres de recettes partagés, de planifier leurs repas et d’importer ou exporter leurs données.

## Fonctionnalités prévues

- Inscription et connexion sécurisées
- Connexion avec un fournisseur OAuth2
- Création et gestion de recettes
- Gestion structurée des ingrédients et des étapes
- Catégories et étiquettes
- Recherche et filtrage des recettes
- Livres de recettes partagés
- Gestion des membres et des permissions
- Favoris
- Planification des repas
- Commentaires sur les recettes
- Messagerie instantanée
- Import et export de données

## Architecture prévue

L’application est composée de trois services principaux :

- un client web ;
- un serveur proposant une API REST ;
- une base de données PostgreSQL.

Les services seront exécutés avec Docker Compose.

## Technologies prévues

### Client

- React
- TypeScript
- Vite

### Serveur

- NestJS
- TypeScript
- Prisma
- API REST

### Base de données

- PostgreSQL

### Déploiement

- Docker
- Docker Compose

## État du projet

Le projet est actuellement en cours de développement.

## Structure du dépôt

- `client` : application web
- `serveur` : API et logique métier
- `documentation` : documentation technique et manuel utilisateur
- `stockage` : fichiers envoyés par les utilisateurs

## Sécurité

Aucun secret ne doit être enregistré dans le dépôt Git.

Les variables d’environnement nécessaires sont présentées dans le fichier `.env.example`.