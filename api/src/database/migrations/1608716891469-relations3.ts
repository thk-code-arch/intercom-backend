import {MigrationInterface, QueryRunner} from "typeorm";

export class relations31608716891469 implements MigrationInterface {
    name = 'relations31608716891469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_141ee681a9b758ec579e184cb60"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_800b0edcecbe631c5f549badeb5"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_107937a75b4d80f9dfcc09972c7"`);
        await queryRunner.query(`ALTER TABLE "chatroom" RENAME COLUMN "projectid" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "projectfile" RENAME COLUMN "projectIdId" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "projectfile" RENAME CONSTRAINT "REL_141ee681a9b758ec579e184cb6" TO "UQ_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "REL_800b0edcecbe631c5f549badeb"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP COLUMN "useridId"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP COLUMN "roomidId"`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "UQ_a4cc32fa4045fff3da4aa1d24e1" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD "roomId" integer`);
        await queryRunner.query(`ALTER TABLE "chatroom" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "chatroom"."projectId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "chatroom" ADD CONSTRAINT "UQ_fab63286645b8337cdba691b8da" UNIQUE ("projectId")`);
        await queryRunner.query(`ALTER TABLE "chatroom" ADD CONSTRAINT "FK_fab63286645b8337cdba691b8da" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_478ef394684bb7b0002a43ea0a0" FOREIGN KEY ("roomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_478ef394684bb7b0002a43ea0a0"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`ALTER TABLE "chatroom" DROP CONSTRAINT "FK_fab63286645b8337cdba691b8da"`);
        await queryRunner.query(`ALTER TABLE "chatroom" DROP CONSTRAINT "UQ_fab63286645b8337cdba691b8da"`);
        await queryRunner.query(`COMMENT ON COLUMN "chatroom"."projectId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "chatroom" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "UQ_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD "roomidId" integer`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD "useridId" integer`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "REL_800b0edcecbe631c5f549badeb" UNIQUE ("useridId")`);
        await queryRunner.query(`ALTER TABLE "projectfile" RENAME CONSTRAINT "UQ_560c538cb4e3993c0e762aeeee0" TO "REL_141ee681a9b758ec579e184cb6"`);
        await queryRunner.query(`ALTER TABLE "projectfile" RENAME COLUMN "projectId" TO "projectIdId"`);
        await queryRunner.query(`ALTER TABLE "chatroom" RENAME COLUMN "projectId" TO "projectid"`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_107937a75b4d80f9dfcc09972c7" FOREIGN KEY ("roomidId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_800b0edcecbe631c5f549badeb5" FOREIGN KEY ("useridId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_141ee681a9b758ec579e184cb60" FOREIGN KEY ("projectIdId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
