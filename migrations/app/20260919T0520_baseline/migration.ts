#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/be274cdee58ba629d31aeb09f4e5e038ad41f92a85bb21119389fb44366570e9/contract';
import endContract from '../../snapshots/be274cdee58ba629d31aeb09f4e5e038ad41f92a85bb21119389fb44366570e9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('CreatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('PublicRepos', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('UpdatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('followers', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('following', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('githubId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_githubId_key',
        columns: ['githubId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_username_key',
        columns: ['username'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
