-- Editorial fields for the "About Our <category>" block.
--
-- Every category page now opens with an About section: a small badge, a
-- heading built from the category name, a few paragraphs on one side and a
-- large photo with a caption overlay on the other. A category rendered inside
-- its parent's page (one that holds products rather than subcategories) uses
-- the same four fields, so the copy travels with the category wherever it is
-- shown.
--
-- `description` stays what it was — the one-line blurb on the category card.
-- `about_body` is the longer prose, paragraphs separated by a blank line.
-- `about_image_url` falls back to `image_url` when left empty, so an existing
-- category keeps working without being re-edited.

alter table categories add column if not exists badge text not null default '';
alter table categories add column if not exists about_body text not null default '';
alter table categories add column if not exists about_image_url text not null default '';
alter table categories add column if not exists about_caption text not null default '';
