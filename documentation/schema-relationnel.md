# Schéma relationnel simplifié

```mermaid
erDiagram
    UTILISATEUR ||--o{ RECETTE : cree
    UTILISATEUR ||--o{ COOKBOOK : cree
    UTILISATEUR ||--o{ MEMBRE_COOKBOOK : rejoint
    UTILISATEUR ||--o{ COMPTE_OAUTH : associe
    UTILISATEUR ||--o{ FAVORI : ajoute
    UTILISATEUR ||--o{ PLANIFICATION_REPAS : planifie
    UTILISATEUR ||--o{ COMMENTAIRE_RECETTE : ecrit
    UTILISATEUR ||--o{ MESSAGE_COOKBOOK : envoie

    COOKBOOK ||--o{ MEMBRE_COOKBOOK : contient
    COOKBOOK ||--o{ INVITATION_COOKBOOK : possede
    COOKBOOK ||--o{ RECETTE : contient
    COOKBOOK ||--o{ MESSAGE_COOKBOOK : contient
    COOKBOOK ||--o{ PLANIFICATION_REPAS : concerne

    RECETTE ||--o{ INGREDIENT_RECETTE : contient
    INGREDIENT ||--o{ INGREDIENT_RECETTE : utilise

    RECETTE ||--o{ ETAPE_RECETTE : contient

    RECETTE ||--o{ RECETTE_TAG : possede
    TAG ||--o{ RECETTE_TAG : classe

    RECETTE ||--o{ RECETTE_CATEGORIE : possede
    CATEGORIE ||--o{ RECETTE_CATEGORIE : classe

    RECETTE ||--o{ FAVORI : est_ajoutee
    RECETTE ||--o{ PLANIFICATION_REPAS : est_planifiee
    RECETTE ||--o{ COMMENTAIRE_RECETTE : recoit