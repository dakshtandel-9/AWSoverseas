-- Nested categories — a category can hold subcategories OR products, never both.
--
-- Adding a child to a category turns it into a "branch": products can no longer
-- be attached to it. Adding a product turns it into a "leaf": subcategories can
-- no longer be created under it. This holds at every depth, so the rule is the
-- same whether you're one level down or five.
--
-- Enforced by two triggers rather than a check constraint, because the rule spans
-- two tables (a categories row is only invalid relative to what products point at
-- it, and vice versa).

alter table categories
  add column if not exists parent_id uuid references categories(id) on delete cascade;

-- Children of a parent, in display order. Also the lookup both triggers use.
create index if not exists categories_parent_idx
  on categories (parent_id, sort_order, created_at desc);

-- Slugs stay globally unique (the public route is a flat /products/[slug]), which
-- the existing unique constraint on slug already gives us.

-- Guard 1: refuse a product whose category already has subcategories.
create or replace function assert_category_is_leaf()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is null then
    return new;
  end if;

  if exists (select 1 from categories where parent_id = new.category_id) then
    raise exception 'category_has_subcategories'
      using hint = 'Products belong in the deepest subcategory, not a category that holds other categories.';
  end if;

  return new;
end;
$$;

drop trigger if exists products_category_is_leaf on products;
create trigger products_category_is_leaf
before insert or update of category_id on products
for each row execute function assert_category_is_leaf();

-- Guard 2: refuse a subcategory whose parent already holds products, and refuse
-- a parent chain that would cycle.
create or replace function assert_parent_is_branch()
returns trigger
language plpgsql
as $$
declare
  cursor_id uuid;
  hops integer := 0;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'category_cycle' using hint = 'A category cannot be its own parent.';
  end if;

  if exists (select 1 from products where category_id = new.parent_id) then
    raise exception 'parent_has_products'
      using hint = 'Move or remove the products in that category before adding subcategories to it.';
  end if;

  -- Walk up the chain; if we meet this row again the move would orphan a loop.
  cursor_id := new.parent_id;
  while cursor_id is not null and hops < 100 loop
    if cursor_id = new.id then
      raise exception 'category_cycle'
        using hint = 'That would put the category inside one of its own subcategories.';
    end if;
    select parent_id into cursor_id from categories where id = cursor_id;
    hops := hops + 1;
  end loop;

  return new;
end;
$$;

drop trigger if exists categories_parent_is_branch on categories;
create trigger categories_parent_is_branch
before insert or update of parent_id on categories
for each row execute function assert_parent_is_branch();
