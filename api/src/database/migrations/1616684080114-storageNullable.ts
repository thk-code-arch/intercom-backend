// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {MigrationInterface, QueryRunner} from "typeorm";

export class storageNullable1616684080114 implements MigrationInterface {
    name = 'storageNullable1616684080114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "thumbnail" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "storage"."thumbnail" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "storage"."thumbnail" IS NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "thumbnail" SET NOT NULL`);
    }

}
