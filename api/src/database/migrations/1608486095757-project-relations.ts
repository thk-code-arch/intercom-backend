import {MigrationInterface, QueryRunner} from "typeorm";

export class projectRelations1608486095757 implements MigrationInterface {
    name = 'projectRelations1608486095757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chatroom" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "projectid" integer NOT NULL, "roomtype" character varying NOT NULL, CONSTRAINT "PK_1e5ce0a999152e29952194d01ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "learning" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "url" character varying(4000) NOT NULL, "thumbnail" character varying NOT NULL, "title" character varying(400) NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "projectid" integer NOT NULL, "views" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_54998af12de15ed2831c8648ca2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_projects_project" ("userId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_26a180af1ec7a8550f5c374fcd8" PRIMARY KEY ("userId", "projectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79daf0d2be103f4c30c77ddd6b" ON "user_projects_project" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_936561888bfd63d01c79fe415c" ON "user_projects_project" ("projectId") `);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_936561888bfd63d01c79fe415c3" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_936561888bfd63d01c79fe415c3"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be"`);
        await queryRunner.query(`DROP INDEX "IDX_936561888bfd63d01c79fe415c"`);
        await queryRunner.query(`DROP INDEX "IDX_79daf0d2be103f4c30c77ddd6b"`);
        await queryRunner.query(`DROP TABLE "user_projects_project"`);
        await queryRunner.query(`DROP TABLE "learning"`);
        await queryRunner.query(`DROP TABLE "chatroom"`);
    }

}
