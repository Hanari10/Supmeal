# Schéma relationnel simplifié

Le schéma suivant représente les principales relations de la version actuelle de SUPMEAL.

```mermaid
erDiagram
    UTILISATEUR ||--o{ RECETTE : cree
    UTILISATEUR ||--o{ INGREDIENT : possede
    UTILISATEUR ||--o{ COOKBOOK : cree
    UTILISATEUR ||--o{ MEMBRE_COOKBOOK : rejoint
    UTILISATEUR ||--o{ COMPTE_OAUTH : associe
    UTILISATEUR ||--o{ FAVORI : ajoute
    UTILISATEUR ||--o{ PLANIFICATION_REPAS : planifie
    UTILISATEUR ||--o{ COMMENTAIRE_RECETTE : ecrit
    UTILISATEUR ||--o{ MESSAGE_COOKBOOK : envoie
    UTILISATEUR ||--o| LISTE_COURSES : possede

    COOKBOOK ||--o{ MEMBRE_COOKBOOK : contient
    COOKBOOK ||--o{ RECETTE : regroupe
    COOKBOOK ||--o{ MESSAGE_COOKBOOK : contient

    RECETTE ||--o{ INGREDIENT_RECETTE : contient
    INGREDIENT ||--o{ INGREDIENT_RECETTE : utilise

    RECETTE ||--o{ RECETTE_TAG : possede
    TAG ||--o{ RECETTE_TAG : classe

    RECETTE ||--o{ FAVORI : est_ajoutee
    RECETTE ||--o{ PLANIFICATION_REPAS : est_planifiee
    RECETTE ||--o{ COMMENTAIRE_RECETTE : recoit

    LISTE_COURSES ||--o{ ELEMENT_LISTE_COURSES : contient
    INGREDIENT ||--o{ ELEMENT_LISTE_COURSES : reference
```

Le schéma Prisma présent dans `serveur/prisma/schema.prisma` reste la référence exacte pour les noms, types, contraintes et règles de suppression.
