// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {MigrationInterface, QueryRunner} from "typeorm";

export class mar231616484671444 implements MigrationInterface {
    name = 'mar231616484671444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "filename"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "filepath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "thumbnail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "thumbnail"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "filepath"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "path" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ADD "filename" character varying(255) NOT NULL`);
    }

}
