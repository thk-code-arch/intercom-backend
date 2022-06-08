import {MigrationInterface, QueryRunner} from "typeorm";

export class viewModule1654586558073 implements MigrationInterface {
    name = 'viewModule1654586558073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "view" ("id" SERIAL NOT NULL, "selectedSubprojects" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "projectId" integer, CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_c6af9853ff6a60d2e80dd8b3af9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_8f983d46598fc9a581e69882585" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_8f983d46598fc9a581e69882585"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_c6af9853ff6a60d2e80dd8b3af9"`);
        await queryRunner.query(`DROP TABLE "view"`);
    }

}
