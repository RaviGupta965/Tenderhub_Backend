export async function up(knex) {
  return knex.schema.createTable("tender_applications", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("tender_id").unsigned().notNullable()
      .references("id").inTable("tenders").onDelete("CASCADE");
    table.text("proposal").notNullable();
    table.string("quote").notNullable();
    table.date("application_deadline").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("tender_applications");
}