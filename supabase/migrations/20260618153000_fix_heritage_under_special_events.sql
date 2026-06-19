-- Fix Heritage: move from Festival (theme_id=4) to Special Events theme
-- Step 1: Create "Special Events" theme in Themes Directory Catalog if missing
INSERT INTO "Themes Directory Catalog" (name, description, premium, tags)
SELECT 'Special Events', 'Awards ceremonies, galas, product launches, heritage celebrations, and other landmark occasions', false, ARRAY['Heritage']
WHERE NOT EXISTS (
  SELECT 1 FROM "Themes Directory Catalog" WHERE name = 'Special Events'
);

-- Step 2: Remove orphaned Heritage (id=728) from Festival theme
DELETE FROM event_types WHERE id = 728;

-- Step 3: Create Heritage as top-level category under Special Events
INSERT INTO event_types (name, parent_id, theme_id)
SELECT 'Heritage', NULL, id
FROM "Themes Directory Catalog"
WHERE name = 'Special Events'
AND NOT EXISTS (
  SELECT 1 FROM event_types WHERE name = 'Heritage' AND parent_id IS NULL
);

-- Step 4: Create Heritage child types
INSERT INTO event_types (name, parent_id, theme_id)
SELECT v.name, ht.id, ht.id
FROM (VALUES
  ('Cultural Heritage'),
  ('Family Heritage'),
  ('Community Heritage'),
  ('Historical Heritage'),
  ('Ethnic Heritage')
) AS v(name)
CROSS JOIN (
  SELECT et.id
  FROM event_types et
  JOIN "Themes Directory Catalog" tdc ON et.theme_id = tdc.id
  WHERE et.name = 'Heritage'
    AND et.parent_id IS NULL
    AND tdc.name = 'Special Events'
  LIMIT 1
) ht
WHERE NOT EXISTS (
  SELECT 1 FROM event_types WHERE name = v.name AND parent_id = ht.id
);
