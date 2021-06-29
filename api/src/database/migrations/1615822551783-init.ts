// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {MigrationInterface, QueryRunner} from "typeorm";

export class init1615822551783 implements MigrationInterface {
    name = 'init1615822551783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning" DROP COLUMN "projectid"`);
        await queryRunner.query(`ALTER TABLE "learning" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "learning" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "learning" ADD CONSTRAINT "FK_9e6bcfb277670d934d555dd0a2b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "learning" ADD CONSTRAINT "FK_969b0a2a9ff915a5100a208f8ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning" DROP CONSTRAINT "FK_969b0a2a9ff915a5100a208f8ba"`);
        await queryRunner.query(`ALTER TABLE "learning" DROP CONSTRAINT "FK_9e6bcfb277670d934d555dd0a2b"`);
        await queryRunner.query(`ALTER TABLE "learning" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "learning" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "learning" ADD "projectid" integer NOT NULL`);
    }

}
