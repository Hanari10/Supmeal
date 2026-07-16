# Modèle de données de SUPMEAL

## 1. Objectif

La base de données de SUPMEAL doit permettre de gérer :

- les utilisateurs ;
- l’authentification ;
- les recettes personnelles ;
- les recettes partagées dans des cookbooks ;
- les ingrédients ;
- les étapes ;
- les catégories et les tags ;
- les favoris ;
- la planification des repas ;
- les commentaires ;
- la messagerie ;
- les invitations ;
- les rôles et les permissions.

---

## 2. Utilisateur

### Table `Utilisateur`

Cette table représente un compte utilisateur.

### Champs principaux

- `id` : identifiant unique
- `email` : adresse email unique
- `motDePasseHash` : mot de passe haché
- `prenom` : prénom (facultatif)
- `nom` : nom (facultatif)
- `imageProfil` : image de profil
- `portionsParDefaut`
- `preferencesAlimentaires`
- `allergies`
- `cuisinesPreferees`
- `dateCreation`
- `dateModification`

### Règles

- l'adresse email est unique ;
- le mot de passe n'est jamais enregistré en clair ;
- les préférences peuvent rester vides.

---

## 3. Compte OAuth

### Table `CompteOAuth`

Cette table permet d'associer un utilisateur à un fournisseur OAuth.

### Champs principaux

- `id`
- `fournisseur`
- `identifiantFournisseur`
- `utilisateurId`
- `dateCreation`

### Exemples de fournisseurs

- Google
- Microsoft
- GitHub

### Règles

- un utilisateur peut posséder plusieurs comptes OAuth ;
- la combinaison fournisseur + identifiant fournisseur doit être unique.

---

## 4. Cookbook

### Table `Cookbook`

Cette table représente un livre de recettes partagé.

### Champs principaux

- `id`
- `nom`
- `description`
- `image`
- `createurId`
- `dateCreation`
- `dateModification`

### Règles

- le créateur devient automatiquement propriétaire ;
- un cookbook possède plusieurs membres ;
- un cookbook possède plusieurs recettes.

---

## 5. MembreCookbook

Cette table relie un utilisateur à un cookbook.

### Champs principaux

- `id`
- `cookbookId`
- `utilisateurId`
- `role`
- `dateAjout`

### Rôles possibles

- PROPRIETAIRE
- EDITEUR
- COMMENTATEUR
- LECTEUR

### Règles

- un utilisateur ne peut apparaître qu'une seule fois dans un cookbook ;
- le propriétaire possède tous les droits ;
- les permissions sont toujours vérifiées par le serveur.

---

## 6. InvitationCookbook

Cette table représente une invitation à rejoindre un cookbook.

### Champs principaux

- `id`
- `cookbookId`
- `email`
- `role`
- `jeton`
- `dateExpiration`
- `dateAcceptation`
- `inviteParId`
- `dateCreation`

### Règles

- le jeton est unique ;
- une invitation expirée ne peut pas être acceptée ;
- lors de l'acceptation, le rôle prévu est automatiquement attribué.

---

## 7. Recette

Cette table représente une recette.

### Champs principaux

- `id`
- `titre`
- `description`
- `tempsPreparation`
- `tempsCuisson`
- `portions`
- `image`
- `sourceUrl`
- `sourceType`
- `createurId`
- `cookbookId`
- `dateCreation`
- `dateModification`

### Règles

- une recette possède obligatoirement un titre ;
- une recette possède toujours un créateur ;
- une recette peut être personnelle ;
- une recette peut appartenir à un cookbook ;
- `cookbookId` est facultatif.

---

## 8. Ingredient

Cette table représente un ingrédient réutilisable.

### Champs principaux

- `id`
- `nom`
- `nomNormalise`
- `dateCreation`

### Règles

- le nom normalisé sert à améliorer la recherche ;
- les doublons doivent être limités.

Exemple :

- Nom : `Tomates cerises`
- Nom normalisé : `tomates cerises`

---

## 9. IngredientRecette

Cette table relie une recette à un ingrédient.

### Champs principaux

- `id`
- `recetteId`
- `ingredientId`
- `quantite`
- `unite`
- `note`
- `position`

### Exemple

Recette : Crêpes

- Farine : 250 g
- Lait : 500 ml
- Œufs : 3

### Règles

- la position détermine l'ordre d'affichage ;
- la quantité peut être décimale ;
- l'unité peut être vide.

---

## 10. EtapeRecette

Cette table représente une étape de préparation.

### Champs principaux

- `id`
- `recetteId`
- `position`
- `instruction`

### Règles

- une étape appartient à une seule recette ;
- la position détermine l'ordre d'affichage.

---

## 11. Catégorie

Cette table représente une catégorie générale.

### Exemples

- Entrée
- Plat
- Dessert
- Boisson

### Champs principaux

- `id`
- `nom`
- `nomNormalise`

---

## 12. RecetteCategorie

Cette table relie les recettes et les catégories.

### Règles

- une recette peut avoir plusieurs catégories ;
- une catégorie peut être utilisée par plusieurs recettes.

---

## 13. Tag

Cette table représente une étiquette libre.

### Exemples

- Rapide
- Végétarien
- Italien
- Sans gluten
- Économique

### Champs principaux

- `id`
- `nom`
- `nomNormalise`

---

## 14. RecetteTag

Cette table relie les recettes et les tags.

### Règles

- une recette peut posséder plusieurs tags ;
- un tag peut être utilisé par plusieurs recettes.

---

## 15. Favori

Cette table relie un utilisateur à une recette favorite.

### Champs principaux

- `utilisateurId`
- `recetteId`
- `dateCreation`

### Règles

- un utilisateur ne peut ajouter une recette qu'une seule fois à ses favoris ;
- les favoris sont personnels.

---

## 16. PlanificationRepas

Cette table représente une recette planifiée.

### Champs principaux

- `id`
- `utilisateurId`
- `recetteId`
- `cookbookId`
- `dateRepas`
- `typeRepas`
- `portions`
- `dateCreation`

### Types de repas

- PETIT_DEJEUNER
- DEJEUNER
- DINER
- COLLATION

### Règles

- une planification appartient toujours à un utilisateur ;
- elle peut être liée à un cookbook ;
- une recette peut être planifiée plusieurs fois.

---

## 17. CommentaireRecette

Cette table contient les commentaires d'une recette.

### Champs principaux

- `id`
- `contenu`
- `utilisateurId`
- `recetteId`
- `dateCreation`
- `dateModification`

### Règles

- seuls les membres autorisés peuvent commenter ;
- un utilisateur peut modifier ou supprimer ses propres commentaires ;
- le propriétaire du cookbook peut modérer les commentaires.

---

## 18. MessageCookbook

Cette table contient les messages d'un cookbook.

### Champs principaux

- `id`
- `contenu`
- `utilisateurId`
- `cookbookId`
- `dateCreation`

### Règles

- seuls les membres autorisés peuvent envoyer un message ;
- les messages sont conservés dans la base de données ;
- Socket.IO servira uniquement à transmettre les nouveaux messages en temps réel.

---

## 19. Relations principales

- un utilisateur possède plusieurs recettes ;
- un utilisateur peut créer plusieurs cookbooks ;
- un utilisateur peut appartenir à plusieurs cookbooks ;
- un cookbook possède plusieurs membres ;
- un cookbook possède plusieurs recettes ;
- une recette possède plusieurs ingrédients ;
- une recette possède plusieurs étapes ;
- une recette possède plusieurs catégories ;
- une recette possède plusieurs tags ;
- une recette peut recevoir plusieurs commentaires ;
- un utilisateur peut avoir plusieurs favoris ;
- un utilisateur peut créer plusieurs planifications ;
- un cookbook possède plusieurs messages.

---

## 20. Contraintes importantes

- les adresses email sont uniques ;
- les jetons d'invitation sont uniques ;
- les mots de passe sont toujours hachés ;
- les suppressions doivent être contrôlées ;
- les relations doivent éviter les doublons ;
- les recherches utiliseront des colonnes normalisées ;
- les permissions seront toujours vérifiées par le serveur ;
- les données personnelles ne seront jamais exposées inutilement.

---

## 21. Suppressions en cascade

Les suppressions en cascade seront utilisées avec prudence.

Exemples :

- supprimer une recette supprime automatiquement ses étapes ;
- supprimer une recette supprime automatiquement les ingrédients associés à cette recette ;
- supprimer un cookbook supprime ses membres, ses invitations et ses messages ;
- supprimer un utilisateur ne supprimera pas automatiquement toutes les données partagées sans vérification.

La stratégie exacte sera définie lors de la création du schéma Prisma.

---

## 22. Choix techniques

La base de données sera développée avec PostgreSQL.

L'accès aux données sera réalisé avec Prisma.

Les principales raisons de ce choix sont :

- un modèle fortement typé ;
- une gestion simple des relations ;
- la création automatique des migrations ;
- une meilleure maintenabilité du code ;
- une réduction des erreurs SQL ;
- une bonne intégration avec NestJS.