-- Which way a category lays out the subcategories inside it, chosen by the
-- admin instead of inferred.
--
-- Until now the split was a heuristic: a group of subcategories rendered as
-- clickable cards only if it was a *mixed* set (some holding subcategories,
-- some holding products), and opened out inline otherwise. That gave no way to
-- ask for cards on a group that happens to be uniform, so it is now an explicit
-- per-category setting.
--
--   'inline' — each subcategory's products are listed on this category's page,
--              one section after another (the reference-site pattern).
--   'cards'  — each subcategory gets a card that opens its own page.
--
-- Only applies to subcategories that hold products. One that holds its own
-- subcategories always gets a card: there is no product grid to open out.

alter table categories
  add column if not exists child_layout text not null default 'inline';

alter table categories drop constraint if exists categories_child_layout_check;
alter table categories add constraint categories_child_layout_check
  check (child_layout in ('cards', 'inline'));

-- Backfill so nothing changes appearance the moment this runs: the old
-- heuristic produced cards exactly when a category's children were a mixed set
-- of branches and leaves (e.g. Food Products, whose Indian Spices sits beside
-- three branches). Everything else opened out, which is the column default.
update categories p
set child_layout = 'cards'
where exists (
        select 1 from categories c
        where c.parent_id = p.id
          and exists (select 1 from categories g where g.parent_id = c.id)
      )
  and exists (
        select 1 from categories c
        where c.parent_id = p.id
          and not exists (select 1 from categories g where g.parent_id = c.id)
      );
