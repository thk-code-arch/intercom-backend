// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {MigrationInterface, QueryRunner} from "typeorm";

export class init1615551114978 implements MigrationInterface {
    name = 'init1615551114978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avatarfile" ("id" SERIAL NOT NULL, "filename" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed102e664329462e0e90fa42434" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarfileId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_46297718138973836fe06d218a3" FOREIGN KEY ("avatarfileId") REFERENCES "avatarfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_46297718138973836fe06d218a3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarfileId"`);
        await queryRunner.query(`DROP TABLE "avatarfile"`);
    }

}
