// migrations/[timestamp]_create_smes_table.js
exports.up = function(knex) {
    return knex.schema.createTable('smes', (table) => {
        table.increments('id').primary();
        table.string('smeName').notNullable();
        table.string('industry');
        table.string('address');
        table.string('contactPerson').notNullable();
        table.string('contactEmail').unique().notNullable();
        table.string('contactPhone');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('smes');
};
