import {MigrationInterface, QueryRunner} from "typeorm";

export class chatlogrela21609345751627 implements MigrationInterface {
    name = 'chatlogrela21609345751627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c48bcbfb26cc7c118f39a6f2052"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_c48bcbfb26cc7c118f39a6f2052"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "chatroomId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "chatroomId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_c48bcbfb26cc7c118f39a6f2052" UNIQUE ("chatroomId")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c48bcbfb26cc7c118f39a6f2052" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
