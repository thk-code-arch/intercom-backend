import {MigrationInterface, QueryRunner} from "typeorm";

export class pfile21609598266764 implements MigrationInterface {
    name = 'pfile21609598266764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectfile" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectfile" DROP COLUMN "createdAt"`);
    }

}
