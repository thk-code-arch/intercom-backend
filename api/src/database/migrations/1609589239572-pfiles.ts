import {MigrationInterface, QueryRunner} from "typeorm";

export class pfiles1609589239572 implements MigrationInterface {
    name = 'pfiles1609589239572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`COMMENT ON COLUMN "projectfile"."projectId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "UQ_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "UQ_560c538cb4e3993c0e762aeeee0" UNIQUE ("projectId")`);
        await queryRunner.query(`COMMENT ON COLUMN "projectfile"."projectId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
