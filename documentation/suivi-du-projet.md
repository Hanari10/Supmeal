# Suivi du projet SUPMEAL

## 1. Présentation

Ce document présente l'état d'avancement du projet SUPMEAL et retrace les principales étapes réalisées pendant le développement.

Il complète l'historique Git du dépôt en donnant une vue fonctionnelle des travaux terminés, partiellement réalisés ou encore prévus.

---

# 2. Préparation du projet

- [x] Création du dépôt Git
- [x] Initialisation du projet
- [x] Création du serveur NestJS
- [x] Création du client React
- [x] Installation et configuration de Prisma
- [x] Configuration de PostgreSQL
- [x] Création du modèle de données
- [x] Mise en place des migrations Prisma
- [x] Configuration de Docker
- [x] Création du fichier `docker-compose.yml`
- [x] Mise en place de la persistance PostgreSQL
- [x] Mise en place de la persistance des images uploadées

---

# 3. Authentification

- [x] Création du modèle utilisateur
- [x] Inscription
- [x] Validation des champs
- [x] Hachage des mots de passe
- [x] Connexion
- [x] Génération de JWT
- [x] Protection des routes privées
- [x] Déconnexion
- [x] Modification du profil
- [x] Changement de mot de passe
- [ ] OAuth2

L'authentification standard est fonctionnelle.

OAuth2 reste une évolution prévue.

---

# 4. Gestion du profil

- [x] Consultation des informations du compte
- [x] Modification du prénom
- [x] Modification du nom
- [x] Modification du mot de passe
- [x] Interface dédiée au profil
- [ ] Préférences culinaires avancées
- [ ] Gestion complète des allergies
- [ ] Association d'un compte OAuth2

---

# 5. Gestion des ingrédients

- [x] Création d'un ingrédient
- [x] Consultation des ingrédients
- [x] Modification d'un ingrédient
- [x] Suppression d'un ingrédient
- [x] Catégorie d'ingrédient
- [x] Unité de mesure par défaut
- [x] Recherche dans la liste des ingrédients
- [x] Utilisation d'un ingrédient dans plusieurs recettes

---

# 6. Gestion des recettes

- [x] Création du modèle recette
- [x] Création d'une recette
- [x] Consultation de la liste des recettes
- [x] Consultation détaillée d'une recette
- [x] Modification d'une recette
- [x] Suppression d'une recette
- [x] Description
- [x] Instructions
- [x] Temps de préparation
- [x] Temps de cuisson
- [x] Nombre de portions
- [x] Difficulté
- [x] Gestion des ingrédients d'une recette
- [x] Quantités
- [x] Unités
- [x] Ordre des ingrédients
- [x] Image de recette
- [x] Upload d'image depuis le stockage local
- [x] Remplacement d'une image
- [x] Suppression d'une image
- [x] Aperçu des ingrédients dans la liste des recettes
- [x] Affichage complet des ingrédients dans la fiche recette
- [x] Gestion des favoris
- [ ] Gestion complète des catégories
- [~] Gestion des tags
- [~] Source de recette pleinement exploitée

---

# 7. Images

- [x] Upload d'image
- [x] Stockage serveur
- [x] Référence de l'image dans la recette
- [x] Affichage dans la fiche recette
- [x] Modification de l'image
- [x] Suppression de l'image
- [x] Proxy Vite pour les uploads
- [x] Proxy Nginx pour les uploads
- [x] Volume Docker pour la persistance
- [x] Exclusion des fichiers uploadés du dépôt Git

---

# 8. Recherche et filtrage

- [x] Recherche par nom
- [x] Recherche dans la description
- [x] Recherche dans les instructions
- [x] Recherche par ingrédient
- [~] Recherche avancée backend
- [~] Filtrage par tag
- [~] Filtrage par difficulté
- [~] Filtrage par temps de préparation
- [ ] Filtrage complet par cookbook
- [x] Accès aux favoris via une page dédiée
- [ ] Interface complète de filtres combinés

La structure backend permet plusieurs filtres avancés, mais tous ne disposent pas encore d'une interface complète côté client.

---

# 9. Favoris

- [x] Ajouter une recette aux favoris
- [x] Retirer une recette des favoris
- [x] Afficher l'état du favori sans rechargement
- [x] Page dédiée aux favoris
- [x] Tooltips sur les actions

---

# 10. Planning des repas

- [x] Création du modèle de planification
- [x] Ajout d'une recette au planning
- [x] Choix du jour
- [x] Choix du type de repas
- [x] Nombre de portions
- [x] Modification d'une planification
- [x] Suppression d'une planification
- [x] Affichage du planning
- [ ] Vue calendrier plus avancée
- [ ] Gestion de plusieurs semaines

---

# 11. Liste de courses

- [x] Création de la liste de courses
- [x] Ajout manuel d'un élément
- [x] Modification d'un élément
- [x] Suppression d'un élément
- [x] Génération depuis le planning
- [x] Récupération des ingrédients des recettes planifiées
- [x] Adaptation aux quantités
- [x] Regroupement des ingrédients identiques
- [x] Addition des quantités utilisant la même unité
- [ ] Conversion automatique entre unités compatibles

Exemple actuellement fonctionnel :

```text
Farine — 200 g
Farine — 300 g

→ Farine — 500 g
```

Amélioration future :

```text
1000 g + 1 kg
→ 2 kg
```

---

# 12. Cookbooks

- [x] Création d'un cookbook
- [x] Consultation des cookbooks
- [x] Modification d'un cookbook
- [x] Suppression d'un cookbook
- [x] Gestion des membres
- [x] Ajout d'un membre
- [x] Retrait d'un membre
- [x] Notifications lors de l'ajout ou du retrait d'un membre
- [x] Affichage des recettes du cookbook
- [x] Ajout d'une recette dans un cookbook
- [x] Retrait d'une recette d'un cookbook
- [x] Conservation de la recette après son retrait
- [x] Contrôle des permissions d'ajout côté serveur
- [x] Notifications lors de l'ajout ou du retrait d'une recette
- [~] Gestion des rôles
- [~] Gestion avancée des permissions
- [ ] Système complet d'invitations
- [ ] Recherche propre à chaque cookbook
- [ ] Commentaires de recettes
- [ ] Messagerie instantanée

Les cookbooks permettent désormais de regrouper réellement plusieurs recettes et plusieurs membres.

Les rôles `CREATOR` et `EDITOR` peuvent ajouter des recettes.

Les fonctionnalités collaboratives avancées restent à développer.

---

# 13. Import et export

- [x] Page dédiée Import / Export
- [x] Export des recettes
- [x] Export des cookbooks
- [x] Import des recettes
- [x] Import des cookbooks
- [x] Service frontend dédié
- [x] Validation générale des échanges
- [~] Compatibilité avec des formats tiers
- [ ] Compatibilité Mealie complète
- [ ] Import CSV complet si nécessaire

---

# 14. Client web

- [x] Initialisation React
- [x] TypeScript
- [x] Vite
- [x] React Router
- [x] PrimeReact
- [x] Navigation latérale
- [x] Navigation mobile
- [x] Barre latérale défilable sur les écrans de faible hauteur
- [x] Bouton de déconnexion toujours accessible
- [x] Pages publiques
- [x] Pages privées
- [x] Gestion des erreurs
- [x] Notifications
- [x] Dialogues de confirmation
- [x] Tooltips
- [x] Interface cohérente entre les pages
- [x] Responsive principal
- [x] Page de connexion retravaillée
- [x] Page d'inscription retravaillée
- [x] Page de profil retravaillée

---

# 15. Backend

- [x] Architecture NestJS
- [x] Modules séparés
- [x] Controllers
- [x] Services
- [x] DTO
- [x] Validation
- [x] Prisma
- [x] PostgreSQL
- [x] Authentification JWT
- [x] Contrôle des propriétés de certaines ressources
- [x] Gestion des uploads
- [x] API REST
- [x] Génération de liste de courses
- [x] Import / export
- [x] Gestion de l'ajout et du retrait des recettes dans les cookbooks
- [~] Permissions avancées des cookbooks
- [ ] OAuth2
- [ ] Temps réel

---

# 16. Docker et déploiement

- [x] Dockerfile backend
- [x] Dockerfile frontend
- [x] Nginx
- [x] PostgreSQL conteneurisé
- [x] `docker-compose.yml`
- [x] Trois services distincts
- [x] Persistance de PostgreSQL
- [x] Persistance des images
- [x] Lancement complet avec Docker Compose
- [x] Build du frontend dans Docker
- [x] Build du backend dans Docker
- [ ] Déploiement public en production
- [ ] CI/CD

---

# 17. Qualité du code

- [x] Typage TypeScript
- [x] Séparation frontend/backend
- [x] Séparation pages/services/types
- [x] Architecture modulaire NestJS
- [x] DTO et validation
- [x] Utilisation de Prisma
- [x] Contrôles ESLint
- [x] Build frontend validé
- [x] Build backend validé
- [x] Historique Git
- [x] Commits réguliers
- [x] Dépôt Git distant
- [~] Tests automatisés
- [ ] Couverture de tests complète

---

# 18. Documentation

- [x] README principal
- [x] README du dossier documentation
- [x] Documentation technique
- [x] Manuel utilisateur
- [x] Mise à jour de la conception
- [x] Mise à jour du modèle de données
- [x] Mise à jour du suivi du projet
- [x] Diagramme de cas d'utilisation
- [x] Diagramme d'architecture
- [x] Diagramme du modèle relationnel
- [x] Captures d'écran du manuel utilisateur
- [~] Vérification finale de cohérence
- [ ] Création de l'archive ZIP

---

# 19. Sécurité

- [x] Hachage des mots de passe
- [x] Authentification JWT
- [x] Routes privées protégées
- [x] Secrets prévus via variables d'environnement
- [x] `.env` exclu du dépôt
- [x] Uploads exclus du dépôt
- [~] Audit complet des secrets avant rendu
- [ ] OAuth2 sécurisé

---

# 20. Difficultés rencontrées

## Connexion à PostgreSQL

Plusieurs erreurs `ECONNREFUSED` ont été rencontrées lorsque PostgreSQL n'était pas lancé.

La solution a consisté à vérifier le conteneur PostgreSQL avant le démarrage du backend.

---

## Ports Docker

Des conflits ont été rencontrés sur certains ports utilisés par PostgreSQL ou le backend.

La configuration Docker Compose a été adaptée afin d'utiliser les ports disponibles.

---

## Persistance Docker

Une attention particulière a été portée à la différence entre :

```text
docker compose down
```

et :

```text
docker compose down -v
```

afin d'éviter la suppression accidentelle des données persistantes.

---

## Images des recettes

L'utilisation initiale d'une simple URL d'image a été remplacée par un véritable système d'upload.

Plusieurs éléments ont été nécessaires :

- upload côté frontend ;
- stockage backend ;
- exposition des fichiers ;
- proxy Vite ;
- proxy Nginx ;
- volume Docker.

---

## Gestion des favoris

Le changement d'état du bouton de favori nécessitait initialement un rechargement de la page.

La gestion de l'état React a été corrigée afin que l'interface se mette à jour immédiatement.

---

## Ingrédients des recettes

Les premières versions du formulaire de recette ne permettaient pas d'associer des ingrédients.

Un service dédié `RecipeIngredient` a ensuite été intégré afin de gérer :

- l'ajout ;
- la quantité ;
- l'unité ;
- la modification ;
- la suppression.

---

## Liste de courses

La génération de la liste de courses nécessitait des recettes disposant réellement d'ingrédients structurés.

L'intégration des `RecipeIngredient` a permis de rendre la chaîne complète fonctionnelle :

```text
Recette
  ↓
Ingrédients
  ↓
Planning
  ↓
Liste de courses
```

---

## Recettes dans les cookbooks

La première version des cookbooks permettait de créer un cookbook et de gérer ses membres, mais ne permettait pas réellement d'y ajouter ou d'en retirer des recettes.

La fonctionnalité a ensuite été complétée côté serveur et côté client.

Le serveur vérifie notamment :

- l'existence du cookbook ;
- l'appartenance de l'utilisateur au cookbook ;
- son rôle ;
- la propriété de la recette ;
- l'association éventuelle de la recette à un autre cookbook.

L'interface permet désormais d'ajouter et de retirer des recettes selon les permissions de l'utilisateur.

Le retrait d'une recette remet son `cookbookId` à `null` sans supprimer la recette.

---

# 21. Fonctionnalités majeures terminées

Les fonctionnalités principales finalisées dans la version actuelle sont :

- authentification classique ;
- gestion du profil ;
- gestion des ingrédients ;
- CRUD complet des recettes ;
- ingrédients structurés ;
- images de recettes ;
- favoris ;
- planning ;
- liste de courses automatique ;
- cookbooks et gestion de leurs recettes ;
- import/export ;
- Docker Compose ;
- persistance ;
- interface web ;
- documentation.

---

# 22. Fonctionnalités restant à développer

Les principales fonctions encore absentes ou partielles sont :

- OAuth2 ;
- commentaires ;
- messagerie instantanée ;
- invitations complètes ;
- permissions avancées des cookbooks ;
- recherche et filtres avancés complets ;
- préférences culinaires avancées ;
- allergies ;
- normalisation et conversion des unités ;
- tests automatisés complets ;
- déploiement public.

---

# 23. Améliorations envisagées

Si du temps supplémentaire est disponible, les priorités d'amélioration possibles sont :

1. conversion automatique des unités ;
2. amélioration des filtres ;
3. permissions avancées des cookbooks ;
4. commentaires ;
5. OAuth2 ;
6. messagerie temps réel ;
7. préférences culinaires ;
8. suggestions intelligentes de recettes ;
9. déploiement public ;
10. CI/CD.

---

# 24. État actuel

La version actuelle de SUPMEAL est fonctionnelle pour les principaux parcours d'utilisation.

Les builds du frontend et du backend ont été validés.

Les contrôles ESLint ont également été validés avant la finalisation de la documentation.

Les captures d'écran nécessaires au manuel utilisateur ont été réalisées.

La documentation fait actuellement l'objet d'une dernière vérification de cohérence avec l'application.

Le projet est désormais dans une phase de finalisation du rendu.

---

# 25. Étapes restantes avant rendu

- [x] Ajouter les captures d'écran au manuel utilisateur
- [~] Vérifier la cohérence de toute la documentation
- [ ] Vérifier tous les secrets
- [ ] Vérifier le dépôt Git
- [ ] Vérifier le lancement complet avec `docker compose up`
- [ ] Faire le dernier commit de documentation
- [ ] Faire le dernier push
- [ ] Créer l'archive ZIP
- [ ] Passer le dépôt Git en public au moment du rendu

---

# 26. Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation SUPINFO.