export async function up(knex) {
  await knex.schema.createTable('tenders', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE'); // who created the tender

    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('category');
    table.integer('budget').notNullable();
    table.timestamp('deadline').notNullable();
    table.string('location');
    table.string('status').defaultTo('open'); // open, closed, awarded
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('tenders');
}
