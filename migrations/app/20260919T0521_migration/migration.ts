#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/be274cdee58ba629d31aeb09f4e5e038ad41f92a85bb21119389fb44366570e9/contract';
import startContract from '../../snapshots/be274cdee58ba629d31aeb09f4e5e038ad41f92a85bb21119389fb44366570e9/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fe554a95fb4b808b77c81cc25fa33c27e2b89dca986659c59257f0ba4ded0402/contract';
import endContract from '../../snapshots/fe554a95fb4b808b77c81cc25fa33c27e2b89dca986659c59257f0ba4ded0402/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'user', column: 'PublicRepos' }),
      this.dropConstraint({ schema: 'public', table: 'user', constraint: 'user_githubId_key' }),
      this.dropColumn({ schema: 'public', table: 'user', column: 'githubId' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-bio', {
        check: () => placeholder('backfill-user-bio:check'),
        run: () => placeholder('backfill-user-bio:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'bio' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('created_at', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.dataTransform(endContract, 'backfill-user-created_at', {
        check: () => placeholder('backfill-user-created_at:check'),
        run: () => placeholder('backfill-user-created_at:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'created_at' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-email', {
        check: () => placeholder('backfill-user-email:check'),
        run: () => placeholder('backfill-user-email:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'email' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('public_repos', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-public_repos', {
        check: () => placeholder('backfill-user-public_repos:check'),
        run: () => placeholder('backfill-user-public_repos:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'public_repos' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
