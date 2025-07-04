import db from '../db/knex.js';

export const createUser = async (userData) => {
  return await db('users').insert(userData).returning(['id', 'email', 'company_name']);
};

export const findUserByEmail = async (email) => {
  return await db('users').where({ email }).first();
};