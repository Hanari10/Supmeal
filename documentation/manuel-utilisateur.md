# Manuel utilisateur — SUPMEAL

## 1. Présentation

SUPMEAL est une application web permettant de gérer des recettes et d'organiser ses repas depuis une interface unique.

L'application permet notamment de :

- créer et gérer un compte utilisateur ;
- gérer une liste d'ingrédients ;
- créer et modifier des recettes ;
- associer des ingrédients et des quantités aux recettes ;
- ajouter des images aux recettes ;
- rechercher des recettes ;
- ajouter des recettes aux favoris ;
- organiser un planning de repas ;
- générer une liste de courses ;
- gérer des cookbooks ;
- importer et exporter des données.

Ce manuel présente les principales fonctionnalités disponibles dans la version actuelle de SUPMEAL.

---

# 2. Accès à l'application

Une fois SUPMEAL démarré, l'utilisatrice accède à l'application depuis son navigateur web.

Les fonctionnalités personnelles nécessitent une authentification.

Une utilisatrice ne possédant pas encore de compte doit commencer par en créer un.

---

# 3. Création d'un compte

Depuis la page de connexion, sélectionner l'option permettant de créer un compte.

Le formulaire d'inscription demande les informations nécessaires à la création du compte.

Il faut notamment renseigner :

- une adresse e-mail valide ;
- un mot de passe respectant les contraintes indiquées ;
- les éventuelles informations personnelles proposées par le formulaire.

Une fois les informations renseignées, valider la création du compte.

Si les données sont valides, le compte est créé.

L'utilisatrice peut ensuite se connecter à SUPMEAL.

---

# 4. Connexion

Depuis la page de connexion :

1. saisir l'adresse e-mail du compte ;
2. saisir le mot de passe ;
3. sélectionner **Se connecter**.

Si les identifiants sont corrects, l'utilisatrice accède à l'espace principal de SUPMEAL.

En cas d'identifiants incorrects, un message indique que la connexion n'a pas pu aboutir.

### Aperçu de la page de connexion

![Page de connexion de SUPMEAL](images/connexion.png)

---

# 5. Navigation dans l'application

Après connexion, un menu permet d'accéder aux différentes parties de SUPMEAL.

L'organisation principale comprend notamment :

```text
Tableau de bord
Ingrédients
Recettes
Nouvelle recette
Favoris
Planning
Liste de courses
Cookbooks
Import / Export
Profil
```

Chaque rubrique correspond à un domaine fonctionnel de l'application.

---

# 6. Tableau de bord

Le tableau de bord constitue le point d'entrée principal après la connexion.

Il permet d'accéder rapidement aux fonctionnalités importantes de l'application.

Depuis le menu latéral, l'utilisatrice peut ensuite naviguer vers les différentes sections de SUPMEAL.

### Aperçu du tableau de bord

![Tableau de bord de SUPMEAL](images/dashboard.png)
![Suite du tableau de bord de SUPMEAL](images/dashboard_2.png)

---

# 7. Gestion des ingrédients

## 7.1. Accéder aux ingrédients

Sélectionner **Ingrédients** dans le menu.

Cette page permet de gérer les ingrédients pouvant être utilisés dans les recettes.

---

## 7.2. Ajouter un ingrédient

Utiliser le bouton prévu pour ajouter un nouvel ingrédient.

Renseigner les informations demandées puis valider.

L'ingrédient devient ensuite disponible pour être associé aux recettes.

---

## 7.3. Utilisation dans les recettes

Les ingrédients créés peuvent être sélectionnés lors de la création ou de la modification d'une recette.

Pour chaque ingrédient associé à une recette, SUPMEAL permet de renseigner notamment :

- une quantité ;
- une unité.

Exemple :

```text
Farine : 250 g
Lait : 500 ml
Œufs : 3
```

### Aperçu de la gestion des ingrédients

![Gestion des ingrédients dans SUPMEAL](images/ingredients.png)

---

# 8. Gestion des recettes

La section **Recettes** regroupe les recettes de l'utilisatrice.

Elle permet notamment :

- de consulter la liste des recettes ;
- de rechercher une recette ;
- de consulter son contenu ;
- de modifier une recette ;
- de supprimer une recette ;
- de gérer les favoris.

### Aperçu de la liste des recettes

![Liste des recettes dans SUPMEAL](images/recettes.png)

---

# 9. Création d'une recette

## 9.1. Accéder au formulaire

Pour créer une recette, sélectionner :

**Nouvelle recette**

ou utiliser le bouton de création disponible depuis la page des recettes.

---

## 9.2. Informations générales

Le formulaire permet de renseigner les différentes informations de la recette.

Selon les informations disponibles, il est possible de définir notamment :

- le nom ;
- la description ;
- les instructions ;
- le temps de préparation ;
- le temps de cuisson ;
- le nombre de portions ;
- la difficulté ;
- une image.

---

## 9.3. Instructions

Les étapes nécessaires à la préparation peuvent être renseignées dans la partie dédiée aux instructions.

Il est recommandé de les écrire dans l'ordre de réalisation afin de faciliter la lecture de la recette.

Exemple :

```text
1. Mélanger la farine et les œufs.
2. Ajouter progressivement le lait.
3. Mélanger jusqu'à obtenir une pâte homogène.
4. Faire cuire les crêpes dans une poêle chaude.
```

---

# 10. Ajouter des ingrédients à une recette

Lors de la création d'une recette, l'utilisatrice peut lui associer des ingrédients.

Pour chaque ingrédient, elle peut renseigner :

- l'ingrédient concerné ;
- la quantité ;
- l'unité.

Exemple :

| Ingrédient | Quantité | Unité |
| --- | ---: | --- |
| Farine | 250 | g |
| Lait | 500 | ml |
| Œufs | 3 | unité |

Une recette peut contenir plusieurs ingrédients.

Après validation, les ingrédients sont enregistrés avec la recette.

---

# 11. Ajouter une image à une recette

SUPMEAL permet d'associer une image à une recette.

Depuis le formulaire de création, utiliser le contrôle permettant de sélectionner une image.

L'image peut être choisie directement depuis le stockage de l'appareil utilisé.

Après sélection et enregistrement de la recette, l'image est envoyée vers le serveur et associée à la recette.

Elle peut ensuite être affichée dans l'application.

L'image est optionnelle : une recette peut être créée sans image.

---

# 12. Consulter une recette

Depuis la liste des recettes, utiliser le bouton **Voir** associé à la recette souhaitée.

La fiche détaillée présente les informations de la recette, notamment :

- son nom ;
- sa description ;
- son image lorsqu'elle en possède une ;
- le nombre de portions ;
- le temps de préparation ;
- le temps de cuisson ;
- la difficulté ;
- ses ingrédients ;
- les quantités ;
- les unités ;
- les instructions.

Cette vue permet de consulter la recette sans entrer dans le formulaire de modification.

### Aperçu d'une fiche recette

![Fiche détaillée d'une recette dans SUPMEAL](images/fiche_recette.png)
![Suite de la fiche détaillée d'une recette](images/fiche_recette_2.png)

---

# 13. Modifier une recette

Depuis la liste des recettes ou la fiche détaillée, utiliser le bouton **Modifier**.

Le formulaire de modification permet de mettre à jour les informations existantes.

L'utilisatrice peut notamment modifier :

- le nom ;
- la description ;
- les instructions ;
- les temps ;
- les portions ;
- la difficulté ;
- l'image ;
- les ingrédients ;
- leurs quantités ;
- leurs unités.

Il est également possible d'ajouter ou de retirer des ingrédients.

Après les modifications, enregistrer la recette.

### Aperçu de la modification d'une recette

![Modification des informations d'une recette](images/modifier_recette.png)
![Modification des ingrédients d'une recette](images/modifier_recette_2.png)
![Suite du formulaire de modification d'une recette](images/modifier_recette_3.png)

---

# 14. Modifier l'image d'une recette

Depuis le formulaire de modification, l'utilisatrice peut remplacer l'image existante par une nouvelle image.

Elle peut également retirer l'image de la recette.

Après enregistrement, la modification est appliquée à la recette.

---

# 15. Supprimer une recette

Depuis la liste des recettes, utiliser le bouton **Supprimer** correspondant à la recette.

Une confirmation est demandée afin de limiter les suppressions accidentelles.

Après confirmation, la recette est supprimée.

Cette action doit donc être utilisée avec précaution.

---

# 16. Aperçu des ingrédients dans la liste des recettes

La liste des recettes affiche également un aperçu de leurs ingrédients.

Pour conserver un tableau lisible, seuls les premiers ingrédients sont affichés directement.

Par exemple :

```text
Farine — 250 g
Lait — 500 ml
Œufs — 3
Beurre — 50 g
+2 autres...
```

La fiche détaillée permet de consulter la liste complète.

---

# 17. Recherche de recettes

Une barre de recherche est disponible dans la section des recettes.

Elle permet de retrouver plus rapidement une recette.

La recherche peut notamment prendre en compte les informations textuelles des recettes et les noms des ingrédients associés.

Par exemple, une recherche :

```text
tomate
```

peut permettre de retrouver les recettes contenant cet ingrédient.

---

# 18. Favoris

## 18.1. Ajouter une recette aux favoris

Depuis la liste des recettes, utiliser le bouton représentant le favori associé à la recette.

La recette est alors marquée comme favorite.

---

## 18.2. Retirer un favori

Utiliser à nouveau le bouton de favori.

La recette est retirée des favoris sans être supprimée.

---

## 18.3. Consulter les favoris

Sélectionner **Favoris** dans le menu.

Cette page permet de retrouver les recettes précédemment marquées comme favorites.

---

# 19. Planning des repas

La section **Planning** permet d'organiser les repas à l'avance.

Une recette peut être associée à une planification.

---

## 19.1. Ajouter un repas au planning

Depuis la page de planning, utiliser le bouton permettant d'ajouter une planification.

Sélectionner les informations demandées, notamment :

- la recette ;
- la date ;
- le type de repas ;
- le nombre de portions.

Valider ensuite l'ajout.

La recette apparaît dans le planning.

---

## 19.2. Modifier une planification

Une planification existante peut être modifiée.

Utiliser le bouton **Modifier** correspondant au repas souhaité.

Effectuer les changements puis enregistrer.

---

## 19.3. Supprimer une planification

Utiliser le bouton **Supprimer** associé à la planification.

Après confirmation, le repas est retiré du planning.

La recette elle-même n'est pas supprimée.

### Aperçu du planning

![Planning des repas dans SUPMEAL](images/planning.png)

---

# 20. Liste de courses

La section **Liste de courses** permet de gérer les ingrédients nécessaires aux repas.

Une liste peut être générée à partir du planning.

### Aperçu de la liste de courses

![Liste de courses dans SUPMEAL](images/liste_courses.png)

---

## 20.1. Génération depuis le planning

Lorsque plusieurs recettes sont planifiées, SUPMEAL peut récupérer leurs ingrédients afin de construire la liste de courses.

Le nombre de portions sélectionné dans le planning peut être utilisé pour adapter les besoins.

---

## 20.2. Regroupement des ingrédients

Lorsque plusieurs recettes utilisent le même ingrédient avec la même unité, SUPMEAL additionne automatiquement les quantités.

Exemple :

```text
Recette A
Farine : 200 g

Recette B
Farine : 300 g
```

La liste de courses obtient :

```text
Farine : 500 g
```

Cela évite d'obtenir plusieurs lignes identiques pour un même produit.

---

## 20.3. Unités différentes

La version actuelle ne convertit pas automatiquement toutes les unités compatibles.

Par exemple :

```text
Farine : 1000 g
Farine : 1 kg
```

ne sont pas nécessairement transformés automatiquement en :

```text
Farine : 2 kg
```

Cette conversion constitue une amélioration envisageable.

---

# 21. Cookbooks

La section **Cookbooks** permet de gérer des regroupements de recettes.

L'utilisatrice peut accéder à ses cookbooks et utiliser les fonctionnalités disponibles depuis cette page.

Les fonctionnalités collaboratives avancées prévues dans le cahier des charges peuvent être complétées dans de futures versions de l'application.

Cela concerne notamment :

- la messagerie instantanée ;
- les commentaires ;
- certaines permissions collaboratives avancées.

---

# 22. Import et export

La section **Import / Export** permet de transférer les données de SUPMEAL.

Elle concerne notamment :

- les recettes ;
- les cookbooks.

---

## 22.1. Exporter les données

Utiliser la fonction d'export disponible dans la page **Import / Export**.

L'application génère un fichier contenant les données exportées.

Ce fichier permet notamment :

- de conserver une sauvegarde ;
- de transférer des données ;
- de préparer une migration.

Les données exportées sont lisibles et doivent donc être conservées dans un emplacement approprié.

---

## 22.2. Importer des données

Depuis la même page, sélectionner la fonction d'import.

Choisir un fichier compatible puis lancer l'import.

Les données reconnues par SUPMEAL sont alors intégrées au compte de l'utilisatrice.

Il est recommandé de vérifier le contenu du fichier avant son import.

---

# 23. Profil

La section **Profil** permet de consulter et modifier les informations liées au compte.

Selon les informations disponibles dans l'application, l'utilisatrice peut mettre à jour ses données personnelles.

---

# 24. Modification du mot de passe

La gestion du profil permet également de modifier le mot de passe du compte.

Pour des raisons de sécurité, il est recommandé d'utiliser un mot de passe suffisamment long et difficile à deviner.

Le mot de passe ne doit pas être communiqué à d'autres personnes.

---

# 25. Déconnexion

Lorsque l'utilisatrice a terminé d'utiliser SUPMEAL, elle peut utiliser la fonction de déconnexion.

La session active est alors terminée et l'application revient vers la partie publique ou la page de connexion.

Sur un appareil partagé, il est recommandé de toujours se déconnecter après utilisation.

---

# 26. Messages et confirmations

SUPMEAL utilise différents messages pour informer l'utilisatrice du résultat de ses actions.

Des notifications peuvent notamment apparaître après :

- la création d'une recette ;
- une modification ;
- une suppression ;
- l'ajout d'un favori ;
- le retrait d'un favori ;
- une erreur de chargement ;
- une erreur de validation.

Certaines opérations sensibles, comme la suppression, utilisent également une demande de confirmation.

---

# 27. Utilisation conseillée

Pour profiter correctement des différentes fonctionnalités, un ordre d'utilisation possible est :

```text
1. Créer un compte
        ↓
2. Se connecter
        ↓
3. Créer les ingrédients
        ↓
4. Créer les recettes
        ↓
5. Associer les ingrédients aux recettes
        ↓
6. Ajouter éventuellement des favoris
        ↓
7. Ajouter des recettes au planning
        ↓
8. Générer la liste de courses
```

L'import peut également être utilisé pour récupérer directement des données existantes.

---

# 28. Exemple de scénario complet

Une utilisatrice souhaite préparer des crêpes.

### Étape 1 — Ingrédients

Elle crée ou sélectionne :

```text
Farine
Lait
Œufs
Beurre
```

### Étape 2 — Recette

Elle crée une recette :

```text
Nom : Crêpes
Portions : 4
Préparation : 15 minutes
Cuisson : 20 minutes
```

Puis elle associe :

```text
Farine : 250 g
Lait : 500 ml
Œufs : 3
Beurre : 50 g
```

Elle peut également ajouter une image.

### Étape 3 — Planning

Elle ajoute la recette au planning pour le repas souhaité.

### Étape 4 — Liste de courses

Elle génère la liste de courses depuis le planning.

SUPMEAL récupère automatiquement les ingrédients nécessaires.

Si d'autres recettes planifiées utilisent les mêmes ingrédients avec les mêmes unités, les quantités sont regroupées.

---

# 29. Fonctionnalités non disponibles dans la version actuelle

Certaines fonctionnalités prévues dans le cahier des charges ne font pas encore partie de la version actuelle ou nécessitent d'être approfondies.

Elles comprennent notamment :

- la connexion avec OAuth2 ;
- la messagerie instantanée dans les cookbooks ;
- les commentaires collaboratifs ;
- certaines permissions avancées des cookbooks ;
- certaines préférences culinaires ;
- la gestion avancée des allergies ;
- la conversion automatique entre toutes les unités compatibles.

Ces éléments constituent des perspectives d'évolution de SUPMEAL.

---

# 30. En cas de problème

## Impossible de se connecter

Vérifier :

- l'adresse e-mail ;
- le mot de passe ;
- que l'application est correctement démarrée.

Si l'application est exécutée localement, le serveur et PostgreSQL doivent être disponibles.

---

## Une image ne s'affiche pas

Vérifier que :

- l'image a bien été enregistrée avec la recette ;
- le serveur est accessible ;
- le fichier existe toujours dans le stockage utilisé par le serveur.

---

## La liste de courses est vide

Vérifier notamment :

- qu'un repas est présent dans le planning ;
- que la recette possède des ingrédients ;
- que les ingrédients disposent des informations nécessaires à la génération.

---

## Une quantité ne fusionne pas avec une autre

Vérifier les unités.

Par exemple :

```text
500 g
```

et :

```text
1 kg
```

peuvent être traités séparément dans la version actuelle.

---

# 31. Résumé des fonctionnalités

| Fonctionnalité | Utilisation principale |
| --- | --- |
| Compte | Créer un espace personnel |
| Connexion | Accéder aux données personnelles |
| Profil | Gérer les informations du compte |
| Ingrédients | Créer les ingrédients utilisés dans les recettes |
| Recettes | Créer, consulter, modifier et supprimer des recettes |
| Images | Illustrer les recettes |
| Recherche | Retrouver rapidement une recette |
| Favoris | Marquer les recettes importantes |
| Planning | Organiser les repas |
| Liste de courses | Calculer les ingrédients nécessaires |
| Cookbooks | Regrouper des recettes |
| Import | Ajouter des données depuis un fichier |
| Export | Sauvegarder ou transférer les données |

---

# 32. Documentation complémentaire

La documentation technique est disponible dans :

```text
documentation/documentation-technique.md
```

Les informations relatives à la conception sont disponibles dans :

```text
documentation/conception.md
```

Le modèle de données est décrit dans :

```text
documentation/modele-de-donnees.md
```

Le suivi du développement est disponible dans :

```text
documentation/suivi-du-projet.md
```

---

# 33. Auteure

**Marion LEFEBVRE**

Projet individuel réalisé dans le cadre de la formation SUPINFO.