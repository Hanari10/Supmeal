# Conception de l’application SUPMEAL

## 1. Présentation du projet

SUPMEAL est une application web permettant aux utilisateurs de créer, organiser et partager des recettes de cuisine.

L’application permet également de planifier des repas, de rechercher des recettes, de gérer des favoris, d’importer ou d’exporter des données et de collaborer dans des livres de recettes partagés appelés cookbooks.

## 2. Objectifs du projet

Les principaux objectifs de SUPMEAL sont :

* permettre à un utilisateur de gérer ses recettes personnelles ;
* permettre la création de cookbooks partagés ;
* permettre à plusieurs utilisateurs de collaborer au sein d’un cookbook ;
* gérer différents rôles et permissions ;
* faciliter la recherche et le filtrage des recettes ;
* proposer un planning de repas ;
* permettre l’import et l’export de données ;
* proposer une interface claire et accessible.

## 3. Types d’utilisateurs

L’application possède un seul type de compte utilisateur.

Cependant, un utilisateur peut avoir différents rôles dans chaque cookbook.

### 3.1 Utilisateur standard

Un utilisateur connecté peut :

* gérer son profil ;
* modifier son mot de passe ;
* renseigner ses préférences culinaires ;
* créer des recettes personnelles ;
* modifier ou supprimer ses recettes ;
* marquer des recettes comme favorites ;
* planifier des repas ;
* créer un cookbook ;
* rejoindre un cookbook sur invitation ;
* importer et exporter ses données.

### 3.2 Rôles dans un cookbook

#### Propriétaire

Le propriétaire est le créateur du cookbook.

Il peut :

* consulter les recettes ;
* ajouter des recettes ;
* modifier les recettes ;
* supprimer les recettes ;
* commenter les recettes ;
* utiliser la messagerie ;
* inviter des utilisateurs ;
* modifier les rôles des membres ;
* retirer des membres ;
* modifier le cookbook ;
* supprimer le cookbook.

#### Éditeur

L’éditeur peut :

* consulter les recettes ;
* ajouter des recettes ;
* modifier les recettes ;
* commenter les recettes ;
* utiliser la messagerie.

#### Commentateur

Le commentateur peut :

* consulter les recettes ;
* commenter les recettes ;
* utiliser la messagerie.

#### Lecteur

Le lecteur peut uniquement :

* consulter le cookbook ;
* consulter les recettes.

## 4. Fonctionnalités principales

### 4.1 Authentification

L’utilisateur peut :

* créer un compte avec une adresse email et un mot de passe ;
* se connecter ;
* se déconnecter ;
* modifier son mot de passe ;
* associer un compte OAuth2 ;
* consulter ses informations personnelles.

Les mots de passe doivent être hachés avant leur enregistrement dans la base de données.

### 4.2 Gestion des recettes

Une recette contient :

* un titre ;
* une description facultative ;
* une liste d’ingrédients ;
* une liste d’étapes ;
* un temps de préparation ;
* un temps de cuisson ;
* un nombre de portions ;
* une ou plusieurs catégories ;
* une ou plusieurs étiquettes ;
* une image facultative ;
* une source facultative ;
* un créateur ;
* une date de création ;
* une date de modification.

Une recette peut être personnelle ou appartenir à un cookbook.

### 4.3 Ingrédients

Chaque ingrédient d’une recette contient :

* un nom ;
* une quantité ;
* une unité ;
* une note facultative ;
* une position dans la liste.

Exemple :

* 200 g de farine ;
* 2 œufs ;
* 10 ml d’huile d’olive.

### 4.4 Étapes de préparation

Chaque étape contient :

* un numéro d’ordre ;
* une instruction.

Exemple :

1. Préchauffer le four à 180 °C.
2. Mélanger la farine et les œufs.
3. Faire cuire pendant 25 minutes.

### 4.5 Cookbooks

Un utilisateur peut créer un cookbook.

Un cookbook contient :

* un nom ;
* une description ;
* une image facultative ;
* un propriétaire ;
* une liste de membres ;
* une liste de recettes ;
* une messagerie ;
* une date de création ;
* une date de modification.

### 4.6 Invitations

Le propriétaire d’un cookbook peut inviter un utilisateur avec son adresse email.

Une invitation contient :

* le cookbook concerné ;
* l’adresse email invitée ;
* le rôle proposé ;
* un jeton d’invitation ;
* une date d’expiration ;
* un statut.

### 4.7 Recherche et filtrage

L’utilisateur peut rechercher une recette selon :

* son titre ;
* ses ingrédients ;
* ses catégories ;
* ses étiquettes ;
* son contenu ;
* son cookbook.

L’utilisateur peut filtrer les recettes selon :

* le cookbook ;
* les catégories ;
* les étiquettes ;
* les ingrédients ;
* le temps de préparation ;
* le temps de cuisson ;
* les favoris.

### 4.8 Favoris

Un utilisateur peut ajouter une recette à ses favoris.

Les favoris sont personnels. Une recette peut donc être favorite pour un utilisateur sans l’être pour les autres.

### 4.9 Planning des repas

Un utilisateur peut ajouter une recette à son planning.

Une planification contient :

* une recette ;
* une date ;
* un type de repas ;
* un nombre de portions ;
* un utilisateur ;
* éventuellement un cookbook.

Les types de repas prévus sont :

* petit-déjeuner ;
* déjeuner ;
* dîner ;
* collation.

### 4.10 Commentaires

Les membres autorisés peuvent commenter les recettes présentes dans un cookbook.

Un commentaire contient :

* un auteur ;
* une recette ;
* un contenu ;
* une date de création ;
* une date de modification.

### 4.11 Messagerie

Chaque cookbook possède une messagerie de groupe.

Un message contient :

* un auteur ;
* un cookbook ;
* un contenu ;
* une date d’envoi.

La messagerie pourra être mise à jour en temps réel avec Socket.IO.

### 4.12 Import et export

L’utilisateur peut exporter ses données dans un fichier JSON.

Le fichier peut contenir :

* les recettes personnelles ;
* les ingrédients ;
* les étapes ;
* les tags ;
* les catégories ;
* les cookbooks créés ;
* les membres ;
* les planifications.

L’utilisateur doit recevoir un avertissement indiquant que les données exportées sont lisibles en clair.

L’utilisateur peut importer un fichier JSON respectant le format de SUPMEAL.

Lors d’un import :

* les données doivent être validées ;
* les recettes sont attribuées à l’utilisateur ;
* les cookbooks importés sont attribués à l’utilisateur comme propriétaire ;
* les données invalides doivent produire un message d’erreur.

## 5. Architecture technique

L’application comporte trois parties distinctes.

### 5.1 Client web

Le client est développé avec React et TypeScript.

Son rôle est :

* d’afficher l’interface ;
* de collecter les saisies de l’utilisateur ;
* d’envoyer des requêtes au serveur ;
* d’afficher les réponses du serveur.

Le client ne contient pas la logique métier principale.

### 5.2 Serveur

Le serveur est développé avec NestJS et TypeScript.

Son rôle est :

* de gérer l’authentification ;
* de vérifier les permissions ;
* de valider les données ;
* d’exécuter la logique métier ;
* de communiquer avec la base de données ;
* de gérer les fichiers ;
* de gérer les imports et exports ;
* de gérer les commentaires et la messagerie.

### 5.3 Base de données

La base de données utilisée est PostgreSQL.

Prisma est utilisé comme ORM afin de :

* définir les modèles de données ;
* gérer les relations ;
* créer les migrations ;
* effectuer des requêtes typées ;
* réduire les erreurs lors des accès à la base.

### 5.4 Communication

Le client communique uniquement avec le serveur par l’intermédiaire d’une API REST.

Le serveur communique avec PostgreSQL à l’aide de Prisma.

Les trois services seront exécutés avec Docker Compose.

## 6. Pages prévues

### Pages publiques

* connexion ;
* inscription ;
* réception d’une invitation ;
* page d’erreur.

### Pages privées

* tableau de bord ;
* mes recettes ;
* détail d’une recette ;
* création d’une recette ;
* modification d’une recette ;
* favoris ;
* planning des repas ;
* liste des cookbooks ;
* détail d’un cookbook ;
* membres d’un cookbook ;
* messagerie d’un cookbook ;
* import et export ;
* paramètres du compte.

## 7. Règles métier principales

* une adresse email ne peut appartenir qu’à un seul utilisateur ;
* une recette personnelle ne peut être modifiée que par son propriétaire ;
* une recette appartenant à un cookbook respecte les permissions du membre ;
* seul le propriétaire d’un cookbook peut modifier les rôles ;
* seul le propriétaire peut supprimer un cookbook ;
* un lecteur ne peut pas commenter ;
* un commentateur ne peut pas modifier une recette ;
* un éditeur ne peut pas modifier les rôles ;
* les mots de passe ne sont jamais stockés en clair ;
* les contrôles de permission sont effectués par le serveur ;
* les fichiers importés sont validés avant leur enregistrement ;
* les données exportées sont lisibles et doivent faire l’objet d’un avertissement.

## 8. Priorités de développement

### Priorité 1

* base de données ;
* inscription ;
* connexion ;
* gestion des utilisateurs ;
* gestion des recettes.

### Priorité 2

* ingrédients ;
* étapes ;
* catégories ;
* tags ;
* recherche ;
* filtres ;
* favoris.

### Priorité 3

* cookbooks ;
* membres ;
* permissions ;
* invitations.

### Priorité 4

* planning ;
* commentaires ;
* messagerie ;
* import ;
* export.

### Priorité 5

* amélioration de l’interface ;
* tests ;
* documentation ;
* déploiement ;
* fonctionnalités bonus.
