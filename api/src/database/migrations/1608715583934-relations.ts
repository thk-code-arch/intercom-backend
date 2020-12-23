import {MigrationInterface, QueryRunner} from "typeorm";

export class relations1608715583934 implements MigrationInterface {
    name = 'relations1608715583934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projectfile" ("id" SERIAL NOT NULL, "filename" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "userId" integer, "projectIdId" integer, CONSTRAINT "REL_141ee681a9b758ec579e184cb6" UNIQUE ("projectIdId"), CONSTRAINT "PK_0f194aedcad15bb5902aa5023c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatlog" ("id" SERIAL NOT NULL, "message" text NOT NULL, "time" TIMESTAMP NOT NULL DEFAULT now(), "useridId" integer, "roomidId" integer, CONSTRAINT "REL_800b0edcecbe631c5f549badeb" UNIQUE ("useridId"), CONSTRAINT "PK_83e72bbacff1320c8d2c4fc09e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chatrooms_chatroom" ("userId" integer NOT NULL, "chatroomId" integer NOT NULL, CONSTRAINT "PK_d2d57416c2f5143547ff4c1b182" PRIMARY KEY ("userId", "chatroomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_637cf8bcc6af8179fe2255c95d" ON "user_chatrooms_chatroom" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1f1f6767309ee31c5550745f3" ON "user_chatrooms_chatroom" ("chatroomId") `);
        await queryRunner.query(`ALTER TABLE "project" ADD "chatroomId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_c48bcbfb26cc7c118f39a6f2052" UNIQUE ("chatroomId")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c48bcbfb26cc7c118f39a6f2052" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_6dc0c9d14e71daf56ced0704bd3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_141ee681a9b758ec579e184cb60" FOREIGN KEY ("projectIdId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_800b0edcecbe631c5f549badeb5" FOREIGN KEY ("useridId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_107937a75b4d80f9dfcc09972c7" FOREIGN KEY ("roomidId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" ADD CONSTRAINT "FK_637cf8bcc6af8179fe2255c95d7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" ADD CONSTRAINT "FK_c1f1f6767309ee31c5550745f31" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" DROP CONSTRAINT "FK_c1f1f6767309ee31c5550745f31"`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" DROP CONSTRAINT "FK_637cf8bcc6af8179fe2255c95d7"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_107937a75b4d80f9dfcc09972c7"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_800b0edcecbe631c5f549badeb5"`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_141ee681a9b758ec579e184cb60"`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_6dc0c9d14e71daf56ced0704bd3"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c48bcbfb26cc7c118f39a6f2052"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_c48bcbfb26cc7c118f39a6f2052"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "chatroomId"`);
        await queryRunner.query(`DROP INDEX "IDX_c1f1f6767309ee31c5550745f3"`);
        await queryRunner.query(`DROP INDEX "IDX_637cf8bcc6af8179fe2255c95d"`);
        await queryRunner.query(`DROP TABLE "user_chatrooms_chatroom"`);
        await queryRunner.query(`DROP TABLE "chatlog"`);
        await queryRunner.query(`DROP TABLE "projectfile"`);
    }

}
