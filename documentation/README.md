# Documentation de SUPMEAL

Ce dossier regroupe la documentation du projet **SUPMEAL**, une application web de gestion de recettes et de planification de repas développée dans le cadre d'un projet individuel SUPINFO.

---

## Organisation de la documentation

La documentation du projet est répartie en plusieurs fichiers afin de séparer les informations destinées aux développeurs, la conception de l'application et les informations destinées aux utilisateurs.

### `documentation-technique.md`

La documentation technique constitue le document de référence pour l'installation, le déploiement et la maintenance de SUPMEAL.

Elle présente notamment :

- les prérequis ;
- la configuration nécessaire ;
- les variables d'environnement ;
- l'installation du projet ;
- le déploiement avec Docker Compose ;
- l'architecture générale ;
- les technologies et bibliothèques utilisées ;
- la justification des principaux choix techniques ;
- l'organisation du serveur et du client ;
- l'API REST ;
- la persistance des données ;
- la gestion des fichiers ;
- les mécanismes de sécurité ;
- les diagrammes UML ;
- le schéma de la base de données.

---

### `manuel-utilisateur.md`

Le manuel utilisateur explique le fonctionnement de SUPMEAL du point de vue d'un utilisateur de l'application.

Il décrit notamment :

- la création d'un compte ;
- la connexion et la déconnexion ;
- la navigation dans l'application ;
- la gestion du profil ;
- la gestion des ingrédients ;
- la création, la consultation, la modification et la suppression des recettes ;
- la gestion des ingrédients et des images des recettes ;
- la recherche ;
- les favoris ;
- le planning des repas ;
- la génération et la gestion de la liste de courses ;
- la création et la gestion des cookbooks ;
- la gestion des membres et de leurs rôles ;
- l'ajout et le retrait de recettes dans les cookbooks ;
- l'import et l'export des données.

---

### `conception.md`

Ce document présente les choix réalisés lors de la conception de SUPMEAL.

Il décrit notamment :

- les objectifs du projet ;
- les acteurs ;
- les principaux cas d'utilisation ;
- l'architecture fonctionnelle ;
- l'organisation du client web ;
- l'organisation du serveur ;
- les principes de sécurité ;
- les règles métier importantes ;
- les choix de conception.

Il permet également de distinguer les fonctionnalités actuellement implémentées des évolutions envisagées.

---

### `modele-de-donnees.md`

Ce document décrit le modèle de données utilisé par SUPMEAL.

Il présente :

- les principales entités ;
- leurs champs ;
- leurs relations ;
- les contraintes d'intégrité ;
- les relations entre recettes et ingrédients ;
- les utilisateurs ;
- les cookbooks ;
- les favoris ;
- les planifications ;
- les listes de courses ;
- les autres données nécessaires au fonctionnement de l'application.

Le modèle de données est implémenté avec **PostgreSQL** et **Prisma ORM**.

---

### `suivi-du-projet.md`

Ce document retrace l'avancement du développement.

Il permet de visualiser :

- les fonctionnalités terminées ;
- les fonctionnalités partiellement réalisées ;
- les fonctionnalités restant à développer ;
- les étapes de finalisation ;
- les améliorations envisageables.

Il constitue également une trace de l'évolution du projet en complément de l'historique Git.

---

## Architecture générale

SUPMEAL repose sur trois composants principaux :

```text
┌──────────────────────────┐
│                          │
│      Client React        │
│                          │
└────────────┬─────────────┘
             │
             │ Requêtes HTTP
             │ API REST
             ▼
┌──────────────────────────┐
│                          │
│      API NestJS          │
│                          │
└────────────┬─────────────┘
             │
             │ Prisma ORM
             ▼
┌──────────────────────────┐
│                          │
│      PostgreSQL          │
│                          │
└──────────────────────────┘
```

Le client web sert d'interface avec l'utilisateur.

La logique métier et les contrôles d'accès sont réalisés par le serveur.

La persistance des données est assurée par PostgreSQL via Prisma ORM.

---

## Déploiement

Le projet dispose d'un fichier `docker-compose.yml` situé à la racine.

Il permet de déployer les trois services principaux :

- le frontend ;
- le backend ;
- la base de données PostgreSQL.

Le lancement complet peut être effectué depuis la racine du projet avec :

```bash
docker compose up --build
```

ou en arrière-plan :

```bash
docker compose up -d --build
```

---

## Sécurité

Aucun secret réel ne doit être enregistré dans le dépôt Git ou intégré à la documentation.

Les informations sensibles doivent être fournies à l'application à l'aide de variables d'environnement.

Cela concerne notamment :

- les mots de passe de base de données ;
- le secret utilisé pour les JWT ;
- les éventuelles clés d'API ;
- les futurs identifiants OAuth2.

Les mots de passe des comptes utilisateurs ne sont pas conservés en clair.

---

## État de la documentation

La documentation est maintenue en cohérence avec la version actuelle de l'application.

Les fonctionnalités prévues lors de la conception mais non présentes dans la version finale sont explicitement identifiées comme des évolutions possibles afin de ne pas les confondre avec les fonctionnalités effectivement disponibles.

---

## Documents

| Document | Objectif |
| --- | --- |
| `../README.md` | Présentation générale et démarrage rapide |
| `documentation-technique.md` | Installation, déploiement, architecture et maintenance |
| `manuel-utilisateur.md` | Guide d'utilisation de SUPMEAL |
| `conception.md` | Conception fonctionnelle et technique |
| `modele-de-donnees.md` | Description de la base de données |
| `suivi-du-projet.md` | Suivi de l'avancement et évolutions |

---

## Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation SUPINFO.