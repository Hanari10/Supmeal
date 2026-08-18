/*
  Migration : isolation des ingrédients par utilisateur.

  Objectifs :
  - ajouter un propriétaire à chaque ingrédient ;
  - conserver les ingrédients et recettes existants ;
  - créer une copie d'un ingrédient lorsqu'il est utilisé par plusieurs utilisateurs ;
  - réaffecter les RecipeIngredient aux bonnes copies ;
  - réaffecter les ShoppingListItem aux bonnes copies ;
  - permettre à plusieurs utilisateurs de posséder un ingrédient du même nom.
*/

-- ============================================================
-- 1. Ajouter userId temporairement nullable
-- ============================================================

ALTER TABLE "Ingredient"
ADD COLUMN "userId" UUID;


-- ============================================================
-- 2. Attribuer les ingrédients déjà utilisés dans des recettes
-- ============================================================

-- Lorsqu'un ingrédient n'est utilisé que par un utilisateur,
-- on peut directement lui attribuer cet utilisateur.

UPDATE "Ingredient" AS i
SET "userId" = owners."userId"
FROM (
    SELECT
        ri."ingredientId",
        MIN(r."userId"::text)::uuid AS "userId"
    FROM "RecipeIngredient" ri
    INNER JOIN "Recipe" r
        ON r."id" = ri."recipeId"
    GROUP BY ri."ingredientId"
) AS owners
WHERE i."id" = owners."ingredientId";


-- ============================================================
-- 3. Utilisateurs supplémentaires utilisant le même ingrédient
-- ============================================================

-- Si un ingrédient global était utilisé par plusieurs utilisateurs,
-- on crée une copie personnelle pour chacun des utilisateurs
-- différents du propriétaire temporairement choisi.

INSERT INTO "Ingredient" (
    "id",
    "name",
    "category",
    "defaultMeasurementUnit",
    "userId",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    i."name",
    i."category",
    i."defaultMeasurementUnit",
    r."userId",
    i."createdAt",
    i."updatedAt"
FROM "Ingredient" i
INNER JOIN (
    SELECT DISTINCT
        ri."ingredientId",
        r."userId"
    FROM "RecipeIngredient" ri
    INNER JOIN "Recipe" r
        ON r."id" = ri."recipeId"
) r
    ON r."ingredientId" = i."id"
WHERE i."userId" IS DISTINCT FROM r."userId";


-- ============================================================
-- 4. Réaffecter les ingrédients des recettes
-- ============================================================

UPDATE "RecipeIngredient" ri
SET "ingredientId" = personalIngredient."id"
FROM "Recipe" r,
     "Ingredient" originalIngredient,
     "Ingredient" personalIngredient
WHERE
    ri."recipeId" = r."id"
    AND originalIngredient."id" = ri."ingredientId"
    AND personalIngredient."name" = originalIngredient."name"
    AND personalIngredient."userId" = r."userId"
    AND personalIngredient."id" <> originalIngredient."id";


-- ============================================================
-- 5. Attribuer les ingrédients utilisés uniquement dans une
--    liste de courses
-- ============================================================

UPDATE "Ingredient" AS i
SET "userId" = owners."userId"
FROM (
    SELECT
        sli."ingredientId",
        MIN(sl."userId"::text)::uuid AS "userId"
    FROM "ShoppingListItem" sli
    INNER JOIN "ShoppingList" sl
        ON sl."id" = sli."shoppingListId"
    GROUP BY sli."ingredientId"
) AS owners
WHERE
    i."id" = owners."ingredientId"
    AND i."userId" IS NULL;


-- ============================================================
-- 6. Copier les ingrédients de listes de courses lorsqu'ils
--    doivent appartenir à un autre utilisateur
-- ============================================================

INSERT INTO "Ingredient" (
    "id",
    "name",
    "category",
    "defaultMeasurementUnit",
    "userId",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    i."name",
    i."category",
    i."defaultMeasurementUnit",
    sl."userId",
    i."createdAt",
    i."updatedAt"
FROM "Ingredient" i
INNER JOIN (
    SELECT DISTINCT
        sli."ingredientId",
        sl."userId"
    FROM "ShoppingListItem" sli
    INNER JOIN "ShoppingList" sl
        ON sl."id" = sli."shoppingListId"
) sl
    ON sl."ingredientId" = i."id"
WHERE
    i."userId" IS DISTINCT FROM sl."userId"
    AND NOT EXISTS (
        SELECT 1
        FROM "Ingredient" existing
        WHERE existing."name" = i."name"
          AND existing."userId" = sl."userId"
    );


-- ============================================================
-- 7. Réaffecter les éléments des listes de courses
-- ============================================================

UPDATE "ShoppingListItem" sli
SET "ingredientId" = personalIngredient."id"
FROM "ShoppingList" sl,
     "Ingredient" originalIngredient,
     "Ingredient" personalIngredient
WHERE
    sli."shoppingListId" = sl."id"
    AND originalIngredient."id" = sli."ingredientId"
    AND personalIngredient."name" = originalIngredient."name"
    AND personalIngredient."userId" = sl."userId"
    AND personalIngredient."id" <> originalIngredient."id";


-- ============================================================
-- 8. Ingrédients inutilisés
-- ============================================================

-- Les ingrédients qui ne sont utilisés ni dans une recette ni
-- dans une liste de courses ne permettent pas de déterminer leur
-- propriétaire historique.
--
-- On les attribue au premier utilisateur existant afin de ne
-- perdre aucune donnée.

UPDATE "Ingredient"
SET "userId" = (
    SELECT "id"
    FROM "users"
    ORDER BY "createdAt" ASC
    LIMIT 1
)
WHERE "userId" IS NULL;


-- ============================================================
-- 9. Remplacer l'ancienne contrainte d'unicité
-- ============================================================

DROP INDEX "Ingredient_name_key";


-- ============================================================
-- 10. Rendre userId obligatoire
-- ============================================================

ALTER TABLE "Ingredient"
ALTER COLUMN "userId" SET NOT NULL;


-- ============================================================
-- 11. Index
-- ============================================================

CREATE INDEX "Ingredient_userId_idx"
ON "Ingredient"("userId");

CREATE UNIQUE INDEX "Ingredient_userId_name_key"
ON "Ingredient"("userId", "name");


-- ============================================================
-- 12. Clé étrangère
-- ============================================================

ALTER TABLE "Ingredient"
ADD CONSTRAINT "Ingredient_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;