# Documentation technique — SUPMEAL

## 1. Présentation

SUPMEAL est une application web de gestion de recettes et de planification de repas développée dans le cadre d'un projet individuel SUPINFO.

L'application permet notamment de gérer des recettes et leurs ingrédients, d'organiser des repas, de générer des listes de courses, de gérer des favoris et des cookbooks, ainsi que d'importer et d'exporter des données.

SUPMEAL repose sur une architecture composée de trois briques distinctes :

- un client web développé avec React ;
- une API REST développée avec NestJS ;
- une base de données PostgreSQL.

L'accès à PostgreSQL est réalisé à l'aide de Prisma ORM.

L'ensemble peut être déployé avec Docker Compose.

---

# 2. Architecture générale

## 2.1. Architecture trois tiers

L'application est divisée en trois composants principaux.

```text
┌─────────────────────────────┐
│                             │
│        Client React         │
│                             │
│ React + TypeScript + Vite   │
│ PrimeReact + React Router   │
│                             │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               │ API REST
               ▼
┌─────────────────────────────┐
│                             │
│        API NestJS           │
│                             │
│ Authentification            │
│ Validation                  │
│ Logique métier              │
│ Contrôle des accès          │
│                             │
└──────────────┬──────────────┘
               │
               │ Prisma ORM
               ▼
┌─────────────────────────────┐
│                             │
│        PostgreSQL           │
│                             │
│ Persistance des données     │
│                             │
└─────────────────────────────┘
```

Cette séparation permet de limiter les responsabilités de chaque composant.

Le client est principalement chargé de l'affichage de l'interface et de l'envoi des actions de l'utilisateur vers le serveur.

Le serveur centralise la logique métier, la validation, l'authentification, les contrôles d'accès et les opérations sur les données.

PostgreSQL assure la persistance des données.

---

## 2.2. Communication entre les composants

Le client communique avec le serveur à travers une API REST.

Les données sont principalement échangées au format JSON.

Le fonctionnement général d'une requête est le suivant :

```text
Utilisateur
     │
     ▼
Interface React
     │
     │ Requête HTTP
     ▼
Contrôleur NestJS
     │
     ▼
Service métier
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
```

La réponse effectue ensuite le chemin inverse jusqu'à l'interface.

Cette organisation évite au client d'accéder directement à la base de données.

---

# 3. Technologies utilisées

## 3.1. TypeScript

TypeScript est utilisé côté client et côté serveur.

Ce choix permet :

- de disposer d'un typage statique ;
- de détecter de nombreuses erreurs pendant le développement ;
- d'améliorer l'autocomplétion ;
- de rendre les interfaces entre les différentes parties de l'application plus explicites ;
- de faciliter la maintenance du code.

L'utilisation du même langage sur le frontend et le backend permet également de conserver une certaine cohérence technique dans l'ensemble du projet.

---

## 3.2. React

React est utilisé pour développer l'interface web.

Il permet de construire l'application à partir de composants réutilisables et de gérer efficacement les changements d'état de l'interface.

React est adapté à SUPMEAL car l'application comporte de nombreuses interfaces dynamiques :

- formulaires ;
- tableaux ;
- navigation ;
- recherche ;
- favoris ;
- planning ;
- gestion des recettes ;
- listes de courses.

---

## 3.3. Vite

Vite est utilisé comme outil de développement et de build du client.

Il permet notamment :

- un démarrage rapide du serveur de développement ;
- un rechargement rapide pendant le développement ;
- la génération d'une version optimisée du client pour le déploiement.

---

## 3.4. PrimeReact

PrimeReact fournit les principaux composants graphiques de l'application.

Il est notamment utilisé pour les :

- boutons ;
- tableaux ;
- formulaires ;
- boîtes de dialogue ;
- cartes ;
- notifications ;
- outils de navigation.

Ce choix permet de maintenir une interface cohérente tout en réduisant la quantité de composants graphiques à développer manuellement.

---

## 3.5. React Router

React Router assure la navigation entre les différentes pages du client.

Il permet notamment de gérer :

- les pages publiques ;
- les pages nécessitant une authentification ;
- les paramètres présents dans certaines URL ;
- la navigation entre la liste, la création, la consultation et la modification des recettes.

---

## 3.6. NestJS

NestJS est utilisé pour développer l'API REST.

Le framework repose sur une architecture modulaire particulièrement adaptée à une application comportant plusieurs domaines fonctionnels.

Le serveur peut ainsi être séparé en modules responsables de fonctionnalités spécifiques, par exemple :

```text
auth
users
recipes
ingredients
recipe-ingredients
favorites
meal-plans
shopping-lists
cookbooks
```

Cette organisation améliore :

- la lisibilité ;
- la séparation des responsabilités ;
- la maintenance ;
- l'évolution du projet.

---

## 3.7. Prisma ORM

Prisma est utilisé comme couche d'accès à PostgreSQL.

Il permet :

- de définir le modèle de données ;
- de générer un client TypeScript ;
- d'effectuer les opérations CRUD ;
- de gérer les relations entre les entités ;
- de bénéficier d'un typage lors des accès aux données.

Le modèle détaillé est présenté dans :

```text
documentation/modele-de-donnees.md
```

---

## 3.8. PostgreSQL

PostgreSQL a été retenu comme système de gestion de base de données relationnelle.

SUPMEAL manipule de nombreuses relations structurées :

- utilisateurs et recettes ;
- recettes et ingrédients ;
- recettes et favoris ;
- utilisateurs et cookbooks ;
- recettes et cookbooks ;
- recettes et planifications ;
- listes de courses et leurs éléments.

Une base relationnelle est donc particulièrement adaptée à ces données.

---

## 3.9. Docker et Docker Compose

Docker permet d'isoler les différents composants nécessaires au fonctionnement de SUPMEAL.

Docker Compose orchestre les services nécessaires à l'application.

L'objectif est de pouvoir démarrer l'environnement complet depuis la racine du projet sans installer manuellement PostgreSQL ou configurer chaque service indépendamment.

---

## 3.10. Nginx

Nginx est utilisé pour servir le client web dans son environnement conteneurisé.

La version de production du client est construite puis servie par Nginx.

---

# 4. Organisation du projet

L'organisation générale est la suivante :

```text
SUPMEAL/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
│
├── serveur/
│   ├── prisma/
│   ├── src/
│   ├── uploads/
│   └── Dockerfile
│
├── documentation/
│
├── docker-compose.yml
└── README.md
```

---

# 5. Client web

## 5.1. Pages principales

Le client comporte notamment des pages permettant de gérer :

- l'inscription ;
- la connexion ;
- le tableau de bord ;
- le profil ;
- les ingrédients ;
- les recettes ;
- la création d'une recette ;
- la consultation détaillée d'une recette ;
- la modification d'une recette ;
- les favoris ;
- le planning ;
- la liste de courses ;
- les cookbooks ;
- l'import et l'export des données.

---

## 5.2. Services

Les appels à l'API sont regroupés dans des services dédiés.

Cette organisation évite de placer directement toute la logique HTTP dans les composants React.

Par exemple, les domaines fonctionnels peuvent disposer de services dédiés à :

- l'authentification ;
- la gestion des recettes ;
- la gestion des ingrédients d'une recette ;
- les favoris ;
- les transferts de données.

Cette séparation facilite la maintenance et limite la duplication.

---

## 5.3. Types

Les objets manipulés par le client sont décrits par des types ou interfaces TypeScript.

Par exemple, une recette contient notamment :

- un identifiant ;
- un nom ;
- une description éventuelle ;
- des instructions ;
- un temps de préparation ;
- un temps de cuisson ;
- un nombre de portions ;
- une difficulté ;
- une image éventuelle ;
- des ingrédients associés.

---

# 6. Serveur

## 6.1. Architecture NestJS

Le backend suit l'organisation modulaire de NestJS.

Les fonctionnalités sont généralement séparées entre :

### Controller

Le contrôleur reçoit les requêtes HTTP.

Il est responsable du routage vers la logique correspondante.

### Service

Le service contient la logique métier.

Il effectue notamment :

- les contrôles nécessaires ;
- les traitements ;
- les opérations Prisma ;
- les vérifications de propriété des ressources.

### DTO

Les Data Transfer Objects décrivent et valident les données reçues par l'API.

### Module

Le module regroupe les composants appartenant au même domaine fonctionnel.

---

# 7. API REST

Le serveur expose une API REST utilisée par le client web.

Les principaux domaines de l'API concernent :

- l'authentification ;
- les utilisateurs ;
- les recettes ;
- les ingrédients ;
- les associations entre recettes et ingrédients ;
- les favoris ;
- le planning ;
- les listes de courses ;
- les cookbooks ;
- l'import et l'export.

Les routes protégées nécessitent une authentification valide.

Le détail exact des routes doit rester cohérent avec les contrôleurs présents dans serveur/src/.

---

# 8. Authentification

## 8.1. Création de compte

Lors de l'inscription, l'utilisateur fournit les informations nécessaires à la création de son compte.

Le mot de passe n'est pas destiné à être stocké directement en clair dans PostgreSQL.

Une version dérivée sécurisée du mot de passe est enregistrée.

---

## 8.2. Connexion

Lors de la connexion :

1. le client transmet les identifiants au serveur ;
2. le serveur recherche l'utilisateur ;
3. le mot de passe fourni est vérifié ;
4. si les informations sont valides, le serveur délivre un JWT ;
5. ce jeton est utilisé pour authentifier les requêtes suivantes.

---

## 8.3. Protection des ressources

Un utilisateur authentifié ne doit pas pouvoir modifier arbitrairement les ressources appartenant à un autre utilisateur.

Les contrôles de propriété sont donc réalisés côté serveur.

Cette vérification est particulièrement importante pour les opérations telles que :

- modification d'une recette ;
- suppression d'une recette ;
- gestion des favoris ;
- gestion du planning ;
- modification des données personnelles.

---

# 9. Gestion des recettes

Une recette peut notamment contenir :

- un titre ;
- une description ;
- des instructions ;
- un temps de préparation ;
- un temps de cuisson ;
- un nombre de portions ;
- une difficulté ;
- une image ;
- des ingrédients.

Le serveur fournit les opérations nécessaires pour créer, lire, modifier et supprimer les recettes.

Les recettes sont associées à leur propriétaire.

---

# 10. Gestion des ingrédients

Les ingrédients sont représentés séparément des recettes.

Une relation intermédiaire permet d'associer un ingrédient à une recette.

Cette association peut contenir des informations spécifiques à la recette, telles que :

- la quantité ;
- l'unité ;
- l'ordre d'affichage.

Cette modélisation évite de dupliquer complètement un ingrédient pour chaque recette.

Exemple :

```text
Recette
   │
   │ 1..N
   ▼
RecipeIngredient
   │
   │ N..1
   ▼
Ingredient
```

---

# 11. Gestion des images

SUPMEAL permet d'associer une image à une recette.

L'image peut être sélectionnée directement depuis le stockage de l'utilisateur.

Le fichier est transmis au serveur, qui le stocke dans un emplacement prévu pour les fichiers uploadés.

La recette conserve ensuite une référence permettant au client d'afficher l'image.

Le dossier contenant les fichiers uploadés ne doit pas être utilisé pour stocker du code source et n'a pas vocation à contenir des secrets.

Les fichiers générés par les utilisateurs ne sont pas versionnés dans le dépôt Git.

---

# 12. Favoris

Une recette peut être ajoutée aux favoris d'un utilisateur.

L'association entre l'utilisateur et la recette permet :

- d'ajouter une recette aux favoris ;
- de retirer une recette des favoris ;
- d'afficher une page contenant uniquement les recettes favorites.

---

# 13. Planning des repas

Le planning permet d'associer une recette à une date et à un repas.

Une planification peut notamment contenir :

- une recette ;
- une date ;
- un type de repas ;
- un nombre de portions.

L'utilisateur peut créer, modifier et supprimer ses planifications.

---

# 14. Liste de courses

La liste de courses est liée au système de planification.

Les ingrédients des recettes planifiées peuvent être utilisés pour générer automatiquement les éléments nécessaires aux courses.

Lorsque plusieurs recettes utilisent le même ingrédient avec la même unité, les quantités peuvent être regroupées.

Exemple :

```text
Recette A : Farine — 200 g
Recette B : Farine — 300 g

Résultat :
Farine — 500 g
```

La version actuelle ne réalise pas de conversion automatique entre des unités différentes.

Ainsi :

```text
Farine — 1000 g
Farine — 1 kg
```

peuvent rester deux quantités distinctes.

Une normalisation automatique des unités constitue une amélioration future possible.

---

# 15. Cookbooks

Les cookbooks permettent de regrouper des recettes et de partager un espace entre plusieurs utilisateurs.

Un cookbook possède notamment :

- un propriétaire ;
- plusieurs membres ;
- plusieurs recettes ;
- un rôle associé à chaque membre.

Les rôles actuellement utilisés sont :

```text
CREATOR
EDITOR
READER
COMMENTER
```

---

## 15.1. Gestion des recettes d'un cookbook

Une recette peut être rattachée à un cookbook grâce au champ cookbookId présent dans le modèle Recipe.

Lorsqu'un utilisateur souhaite ajouter une recette à un cookbook, le serveur vérifie plusieurs éléments avant d'effectuer l'association :

- l'existence du cookbook ;
- l'appartenance de l'utilisateur au cookbook ;
- son rôle dans le cookbook ;
- l'existence de la recette ;
- la propriété de la recette ;
- l'absence d'association de la recette avec un autre cookbook.

Le processus d'ajout peut être représenté ainsi :

```text
Recette personnelle
        ↓
Vérification du cookbook
        ↓
Vérification des permissions
        ↓
Vérification de la recette
        ↓
Association au cookbook
        ↓
recipe.cookbookId = cookbook.id
```

Un utilisateur disposant du rôle CREATOR ou EDITOR peut ajouter ses propres recettes au cookbook.

Les rôles READER et COMMENTER ne disposent pas de cette permission.

Une recette déjà présente dans le cookbook ne peut pas être ajoutée une seconde fois.

De même, une recette déjà associée à un autre cookbook ne peut pas être directement déplacée vers un nouveau cookbook. Elle doit d'abord être retirée du cookbook auquel elle appartient.

Le retrait d'une recette d'un cookbook ne provoque pas sa suppression de la base de données.

Le serveur modifie uniquement son association :

```text
cookbookId = null
```

La recette existe donc toujours et redevient disponible en dehors du cookbook.

Les routes REST utilisées pour ces opérations sont :

```text
POST   /cookbooks/:id/recipes
DELETE /cookbooks/:id/recipes/:recipeId
```

La requête d'ajout transmet l'identifiant de la recette à associer au cookbook.

Cette organisation permet de séparer la suppression réelle d'une recette de son simple retrait d'un espace partagé.

---

## 15.2. Permissions liées aux recettes

Les permissions relatives aux recettes d'un cookbook sont contrôlées côté serveur afin de ne pas dépendre uniquement des restrictions affichées par l'interface cliente.

Les rôles disponibles sont :

```text
CREATOR
EDITOR
READER
COMMENTER
```

Pour l'ajout d'une recette dans un cookbook :

```text
CREATOR   → autorisé
EDITOR    → autorisé
READER    → interdit
COMMENTER → interdit
```

L'utilisateur doit également être propriétaire de la recette qu'il souhaite ajouter.

Pour le retrait d'une recette, l'opération est autorisée notamment pour :

- le propriétaire du cookbook ;
- le créateur de la recette ;
- un utilisateur disposant du rôle EDITOR.

Avant chaque opération, le serveur vérifie les droits de l'utilisateur concerné.

Le client adapte également les actions visibles en fonction du rôle. Un utilisateur ne disposant pas des permissions nécessaires ne voit pas les actions d'ajout ou de retrait correspondantes.

Cette vérification côté client améliore l'expérience utilisateur, mais la sécurité repose sur les contrôles réalisés par le serveur.

Après un ajout ou un retrait réussi, l'interface actualise les données du cookbook et affiche une notification confirmant l'opération.

La version actuelle intègre les rôles, les commentaires sur les recettes partagées, la recherche interne aux cookbooks et la messagerie instantanée via Socket.IO.

Les améliorations collaboratives restantes concernent principalement un système complet d'invitations et une granularité encore plus fine des permissions.

---

# 16. Import et export

SUPMEAL propose des fonctionnalités d'import et d'export permettant de transférer des données.

La version actuelle permet notamment de prendre en charge les recettes et les cookbooks.

Ces fonctionnalités facilitent :

- la sauvegarde ;
- le transfert ;
- la migration des données.

Les fichiers exportés doivent être considérés comme potentiellement lisibles et contenir uniquement les données prévues pour l'export.

Aucun secret d'authentification ne doit être inclus dans ces exports.

---

# 17. Base de données

La base PostgreSQL stocke les données persistantes de l'application.

Le modèle relationnel détaillé est documenté dans :

```text
documentation/modele-de-donnees.md
```

Le schéma Prisma constitue également une référence technique directe :

```text
serveur/prisma/schema.prisma
```

---

# 18. Configuration

## 18.1. Variables d'environnement

Le fonctionnement du serveur nécessite des variables d'environnement.

Les valeurs réelles ne doivent pas être versionnées dans Git.

Exemple générique :

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=CHANGE_ME
```

Les valeurs présentes dans la documentation sont uniquement des exemples.

---

## 18.2. Secrets

Sont notamment considérés comme secrets :

- les mots de passe de base de données ;
- le secret JWT ;
- les éventuelles clés d'API ;
- les secrets OAuth2.

Ils ne doivent apparaître :

- ni dans le code source ;
- ni dans les commits ;
- ni dans la documentation ;
- ni dans l'archive finale remise pour l'évaluation.

Un fichier d'exemple peut être fourni afin d'indiquer les variables nécessaires sans exposer leurs valeurs réelles.

---

# 19. Installation

## 19.1. Prérequis pour Docker

Pour lancer l'application conteneurisée :

- Git ;
- Docker ;
- Docker Compose.

Pour travailler directement sur le code :

- Node.js ;
- npm.

---

## 19.2. Récupération du projet

```bash
git clone https://github.com/Hanari10/Supmeal.git
cd Supmeal
```

---

# 20. Déploiement avec Docker Compose

Le fichier suivant se trouve à la racine :

```text
docker-compose.yml
```

Il permet de démarrer les principaux composants de SUPMEAL.

Depuis la racine :

```bash
docker compose up --build
```

Pour lancer les services en arrière-plan :

```bash
docker compose up -d --build
```

---

## 20.1. Vérification

L'état des conteneurs peut être vérifié avec :

```bash
docker compose ps
```

Les trois briques attendues sont :

```text
frontend
backend
postgres
```

Le nom exact des conteneurs peut dépendre de la configuration Docker Compose.

---

## 20.2. Arrêt

```bash
docker compose down
```

Cette commande arrête les services.

---

## 20.3. Reconstruction

Après une modification du code nécessitant de reconstruire les images :

```bash
docker compose up -d --build
```

L'option `--build` reconstruit les images avant de démarrer les services.

---

# 21. Persistance

Les données PostgreSQL doivent être conservées dans un volume Docker.

Ainsi, un arrêt classique :

```bash
docker compose down
```

ne doit pas supprimer les données persistantes.

En revanche, la commande :

```bash
docker compose down -v
```

supprime également les volumes associés.

Elle doit donc être utilisée avec précaution car elle peut entraîner la suppression des données de la base.

Les fichiers uploadés, notamment les images de recettes, doivent également être stockés dans un espace persistant afin de ne pas être perdus lors de la recréation du conteneur backend.

---

# 22. Lancement en environnement de développement

## 22.1. Backend

Depuis le dossier serveur :

```bash
cd serveur
npm install
npm run start:dev
```

---

## 22.2. Frontend

Dans un autre terminal :

```bash
cd client
npm install
npm run dev
```

---

## 22.3. PostgreSQL

Une instance PostgreSQL doit être disponible pour le backend.

Si PostgreSQL est fourni par Docker, il faut vérifier que son conteneur est démarré avant d'utiliser les fonctionnalités nécessitant la base de données.

Une erreur Prisma contenant :

```text
ECONNREFUSED
```

indique notamment que le serveur n'a pas réussi à établir la connexion attendue avec le service de base de données.

---

# 23. Vérification de la qualité du code

Avant un commit important ou le rendu final, le client et le serveur peuvent être vérifiés.

## Backend

```bash
cd serveur
npm run lint
npm run build
```

## Frontend

```bash
cd client
npm run lint
npm run build
```

Ces commandes permettent notamment de vérifier :

- les règles ESLint ;
- la compilation TypeScript ;
- la capacité du projet à produire un build.

---

# 24. Sécurité

La sécurité est prise en compte à plusieurs niveaux.

## 24.1. Mots de passe

Les mots de passe utilisateurs ne doivent jamais être enregistrés en clair.

Seule une représentation dérivée sécurisée est stockée.

---

## 24.2. JWT

Les JWT permettent d'authentifier les requêtes vers les routes protégées.

Le secret utilisé pour signer les jetons doit rester confidentiel.

---

## 24.3. Validation

Les données reçues par l'API sont validées avant d'être utilisées.

Les DTO permettent de définir les données acceptées par les différents endpoints.

---

## 24.4. Autorisations

Le serveur vérifie qu'un utilisateur possède les droits nécessaires avant d'effectuer certaines opérations.

Le contrôle ne doit pas reposer uniquement sur le client.

---

## 24.5. Secrets

Les secrets sont fournis à travers l'environnement d'exécution et ne doivent pas être intégrés au dépôt.

---

# 25. Diagrammes UML

## 25.1. Diagramme de cas d'utilisation

Le fonctionnement principal de SUPMEAL peut être représenté ainsi :

```mermaid
flowchart LR
    U[Utilisateur]

    U --> A[Créer un compte]
    U --> B[Se connecter]
    U --> C[Gérer son profil]
    U --> D[Gérer les ingrédients]
    U --> E[Gérer les recettes]
    U --> F[Gérer les favoris]
    U --> G[Planifier les repas]
    U --> H[Gérer la liste de courses]
    U --> I[Gérer les cookbooks]
    U --> J[Importer des données]
    U --> K[Exporter des données]

    E --> E1[Créer une recette]
    E --> E2[Consulter une recette]
    E --> E3[Modifier une recette]
    E --> E4[Supprimer une recette]
    E --> E5[Associer des ingrédients]
    E --> E6[Ajouter une image]

    G --> G1[Ajouter au planning]
    G --> G2[Modifier une planification]
    G --> G3[Supprimer une planification]

    H --> H1[Générer depuis le planning]

    I --> I1[Créer un cookbook]
    I --> I2[Gérer les membres]
    I --> I3[Ajouter une recette]
    I --> I4[Retirer une recette]
```

---

## 25.2. Diagramme d'architecture

```mermaid
flowchart LR
    User[Utilisateur]
    Front[Client React]
    API[API REST NestJS]
    Prisma[Prisma ORM]
    DB[(PostgreSQL)]
    Uploads[(Fichiers uploadés)]

    User --> Front
    Front -->|HTTP / JSON| API
    API --> Prisma
    Prisma --> DB
    API --> Uploads
```

---

# 26. Schéma relationnel simplifié

Le modèle complet est décrit dans modele-de-donnees.md.

Une représentation simplifiée des relations principales est la suivante :

```text
User
 │
 ├──────── Recipe
 │            │
 │            └──────── RecipeIngredient ─────── Ingredient
 │
 ├──────── Favorite ───────────────────── Recipe
 │
 ├──────── MealPlan ───────────────────── Recipe
 │
 ├──────── ShoppingList
 │            │
 │            └──────── ShoppingListItem
 │
 └──────── Cookbook
              │
              ├──────── CookbookMember ───────── User
              │
              └──────── Recipe
```

Le schéma Prisma doit être considéré comme la référence exacte de l'implémentation de la base.

---

# 27. Limites actuelles et évolutions

La version actuelle de SUPMEAL fournit le cœur fonctionnel nécessaire à la gestion personnelle de recettes et de repas.

Les principales améliorations encore envisageables concernent :

- un système complet d'invitations ;
- une gestion encore plus granulaire des rôles et permissions ;
- la conversion automatique entre unités compatibles ;
- une planification sur plusieurs semaines ;
- une couverture de tests automatisés plus importante ;
- le déploiement public et la CI/CD.

Google OAuth2, les préférences alimentaires et allergies, les filtres de recettes, la recherche interne aux cookbooks, les commentaires et la messagerie instantanée sont intégrés à la version actuelle.

D'autres améliorations peuvent également être envisagées :

- suggestions intelligentes de recettes ;
- optimisation automatique d'un menu hebdomadaire ;
- statistiques nutritionnelles ;
- amélioration de la gestion des quantités ;
- déploiement public de production.

---

# 28. Documentation complémentaire

Les documents complémentaires sont disponibles dans le même dossier :

```text
documentation/
├── README.md
├── documentation-technique.md
├── manuel-utilisateur.md
├── conception.md
├── modele-de-donnees.md
└── suivi-du-projet.md
```

conception.md détaille les choix de conception.

modele-de-donnees.md présente le modèle relationnel et les entités.

suivi-du-projet.md retrace l'évolution du développement.

manuel-utilisateur.md explique l'utilisation de l'application.

---

# 29. Références techniques du projet

Les fichiers suivants constituent les principales références de l'implémentation :

```text
docker-compose.yml
client/package.json
client/vite.config.ts
client/nginx.conf
serveur/package.json
serveur/prisma/schema.prisma
serveur/src/
client/src/
```

En cas de différence entre cette documentation et le code source, la version effectivement présente dans le dépôt constitue la référence d'implémentation.

---

# 30. Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation SUPINFO.