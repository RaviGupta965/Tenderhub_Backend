export async function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('company_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('contact_person').notNullable();
    table.string('industry').notNullable();
    table.text('description');
    table.string('location');
    table.string('website');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('users');
}
