import {MigrationInterface, QueryRunner} from "typeorm";

export class chatlogrelations1609320600906 implements MigrationInterface {
    name = 'chatlogrelations1609320600906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`COMMENT ON COLUMN "chatlog"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "UQ_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "UQ_a4cc32fa4045fff3da4aa1d24e1" UNIQUE ("userId")`);
        await queryRunner.query(`COMMENT ON COLUMN "chatlog"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
