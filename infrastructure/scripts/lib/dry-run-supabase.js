import { randomUUID } from "node:crypto";

const TABLE_NAMES = [
  "citations",
  "findings",
  "knowledge_events",
  "quality_reviews",
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getValue(row, column) {
  if (column.includes("->>")) {
    const [jsonColumn, key] = column.split("->>");
    return row[jsonColumn]?.[key];
  }
  return row[column];
}

function applyProjection(row, columns) {
  if (!columns || columns.trim() === "*") return clone(row);

  return Object.fromEntries(
    columns
      .split(",")
      .map((column) => column.trim())
      .filter(Boolean)
      .map((column) => [column, clone(row[column])])
  );
}

function matchesFilter(row, filter) {
  const value = getValue(row, filter.column);

  switch (filter.operator) {
    case "eq":
      return value === filter.value;
    case "neq":
      return value !== filter.value;
    case "in":
      return filter.values.includes(value);
    case "overlaps":
      return Array.isArray(value) && value.some((item) => filter.values.includes(item));
    case "ilike": {
      const escapedPattern = filter.pattern
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replaceAll("%", ".*");
      return new RegExp(`^${escapedPattern}$`, "i").test(String(value ?? ""));
    }
    default:
      return true;
  }
}

class DryRunQuery {
  constructor(database, table) {
    this.database = database;
    this.table = table;
    this.operation = "select";
    this.filters = [];
    this.projection = "*";
    this.payload = null;
    this.patch = null;
    this.orderSpec = null;
    this.limitCount = null;
    this.singleResult = false;
  }

  insert(payload) {
    this.operation = "insert";
    this.payload = Array.isArray(payload) ? payload : [payload];
    return this;
  }

  select(columns = "*") {
    this.projection = columns;
    return this;
  }

  update(patch) {
    this.operation = "update";
    this.patch = patch;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  eq(column, value) {
    this.filters.push({ operator: "eq", column, value });
    return this;
  }

  neq(column, value) {
    this.filters.push({ operator: "neq", column, value });
    return this;
  }

  in(column, values) {
    this.filters.push({ operator: "in", column, values });
    return this;
  }

  overlaps(column, values) {
    this.filters.push({ operator: "overlaps", column, values });
    return this;
  }

  ilike(column, pattern) {
    this.filters.push({ operator: "ilike", column, pattern });
    return this;
  }

  order(column, options = {}) {
    this.orderSpec = { column, ascending: options.ascending ?? true };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  _rows() {
    return this.database[this.table];
  }

  _matchingRows() {
    let rows = this._rows().filter((row) => this.filters.every((filter) => matchesFilter(row, filter)));

    if (this.orderSpec) {
      const { column, ascending } = this.orderSpec;
      rows = [...rows].sort((a, b) => {
        const aValue = getValue(a, column);
        const bValue = getValue(b, column);
        if (aValue === bValue) return 0;
        return (aValue > bValue ? 1 : -1) * (ascending ? 1 : -1);
      });
    }

    if (this.limitCount !== null) rows = rows.slice(0, this.limitCount);
    return rows;
  }

  _formatRows(rows) {
    const data = rows.map((row) => applyProjection(row, this.projection));
    if (!this.singleResult) return { data, error: null };
    if (data.length === 0) return { data: null, error: { message: "No rows returned" } };
    return { data: data[0], error: null };
  }

  async execute() {
    switch (this.operation) {
      case "insert":
        return this._insert();
      case "update":
        return this._update();
      case "delete":
        return this._delete();
      case "select":
      default:
        return this._formatRows(this._matchingRows());
    }
  }

  _insert() {
    const now = new Date().toISOString();
    const inserted = this.payload.map((row) => {
      const next = {
        id: row.id ?? randomUUID(),
        created_at: row.created_at ?? now,
        ...clone(row),
      };

      if (this.table === "knowledge_events") {
        next.processed = next.processed ?? false;
      }

      this._rows().push(next);
      return next;
    });

    return this._formatRows(inserted);
  }

  _update() {
    const now = new Date().toISOString();
    for (const row of this._matchingRows()) {
      Object.assign(row, clone(this.patch));
      row.updated_at = row.updated_at ?? now;
    }
    return { data: null, error: null };
  }

  _delete() {
    const rows = this._rows();
    for (let index = rows.length - 1; index >= 0; index -= 1) {
      if (this.filters.every((filter) => matchesFilter(rows[index], filter))) {
        rows.splice(index, 1);
      }
    }
    return { data: null, error: null };
  }
}

export function createDryRunSupabase() {
  const database = Object.fromEntries(TABLE_NAMES.map((table) => [table, []]));

  return {
    __dryRun: true,
    __database: database,
    from(table) {
      if (!database[table]) database[table] = [];
      return new DryRunQuery(database, table);
    },
  };
}
