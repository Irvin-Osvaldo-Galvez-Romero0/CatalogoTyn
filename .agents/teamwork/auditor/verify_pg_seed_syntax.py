import re
import json

with open('.agents/teamwork/worker_deliverables/supabase_seed.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

# 1. Check BEGIN and COMMIT
assert 'BEGIN;' in sql, "Missing BEGIN;"
assert 'COMMIT;' in sql, "Missing COMMIT;"

# 2. Extract Category insert
cat_section = re.search(r'INSERT INTO public\.categories.*?;', sql, re.DOTALL)
assert cat_section, "Categories INSERT not found"
cat_tuples = re.findall(r"\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*\)", cat_section.group(0))
print(f"Postgres Categories parsed: {len(cat_tuples)}/10")
assert len(cat_tuples) == 10, f"Expected 10 categories, got {len(cat_tuples)}"

# 3. Extract Products insert
prod_section = re.search(r'INSERT INTO public\.products\s*\((.*?)\)\s*VALUES\s*(.*?)\nON CONFLICT', sql, re.DOTALL)
assert prod_section, "Products INSERT not found"

cols = [c.strip() for c in prod_section.group(1).split(',')]
print(f"Products column count: {len(cols)}")
assert len(cols) == 21, f"Expected 21 columns, got {len(cols)}"

# Split tuples
# In sql, each tuple is on its own line:   ('code', ...),
lines = [l.strip() for l in prod_section.group(2).strip().split('\n') if l.strip().startswith('(')]
print(f"Products row lines: {len(lines)}")
assert len(lines) == 180, f"Expected 180 product lines, got {len(lines)}"

# Let's inspect JSON validity for jsonb fields
# Sizes, colors, uses, features have pattern '...'::jsonb
json_fields_validated = 0
for i, line in enumerate(lines):
    # Match jsonb literals: '(...)'::jsonb
    jsonb_matches = re.findall(r"'((?:[^']|'')*)'::jsonb", line)
    if len(jsonb_matches) != 4:
        print(f"Row {i} unexpected jsonb matches ({len(jsonb_matches)}): {line[:80]}")
    assert len(jsonb_matches) == 4, f"Row {i} does not have 4 jsonb fields"
    for j_str in jsonb_matches:
        raw_json = j_str.replace("''", "'")
        try:
            parsed = json.loads(raw_json)
            assert isinstance(parsed, list), "JSON field should be an array"
            json_fields_validated += 1
        except Exception as e:
            print(f"Invalid JSON in row {i}: {raw_json[:100]} Error: {e}")
            raise e

print(f"Successfully validated all {json_fields_validated} JSONB attributes (4 per product * 180 = 720)!")
print("Postgres Seed SQL validation: 100% PASS!")
