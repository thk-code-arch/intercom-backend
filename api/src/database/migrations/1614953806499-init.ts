// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {MigrationInterface, QueryRunner} from "typeorm";

export class init1614953806499 implements MigrationInterface {
    name = 'init1614953806499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chatlog" ("id" SERIAL NOT NULL, "message" text NOT NULL, "time" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "roomId" integer, CONSTRAINT "PK_83e72bbacff1320c8d2c4fc09e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(320) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying NOT NULL, "profile_image" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "owner" integer NOT NULL, "parentProject" integer, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatroom" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "roomtype" character varying NOT NULL, "projectId" integer, CONSTRAINT "REL_fab63286645b8337cdba691b8d" UNIQUE ("projectId"), CONSTRAINT "PK_1e5ce0a999152e29952194d01ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "learning" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "url" character varying(4000) NOT NULL, "thumbnail" character varying NOT NULL, "title" character varying(400) NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "projectid" integer NOT NULL, "views" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_54998af12de15ed2831c8648ca2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projectfile" ("id" SERIAL NOT NULL, "filename" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "projectId" integer, CONSTRAINT "PK_0f194aedcad15bb5902aa5023c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying(10) NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storage" ("id" SERIAL NOT NULL, "filename" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "projectId" integer, "learningId" integer, CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "user_projects_project" ("userId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_26a180af1ec7a8550f5c374fcd8" PRIMARY KEY ("userId", "projectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79daf0d2be103f4c30c77ddd6b" ON "user_projects_project" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_936561888bfd63d01c79fe415c" ON "user_projects_project" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "user_chatrooms_chatroom" ("userId" integer NOT NULL, "chatroomId" integer NOT NULL, CONSTRAINT "PK_d2d57416c2f5143547ff4c1b182" PRIMARY KEY ("userId", "chatroomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_637cf8bcc6af8179fe2255c95d" ON "user_chatrooms_chatroom" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1f1f6767309ee31c5550745f3" ON "user_chatrooms_chatroom" ("chatroomId") `);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatlog" ADD CONSTRAINT "FK_478ef394684bb7b0002a43ea0a0" FOREIGN KEY ("roomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatroom" ADD CONSTRAINT "FK_fab63286645b8337cdba691b8da" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_6dc0c9d14e71daf56ced0704bd3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projectfile" ADD CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_1b6226fd0003dbe26f809118849" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_cb670e55b9d06955d4b33863978" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_585112c8b172314e664a063bba2" FOREIGN KEY ("learningId") REFERENCES "learning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_936561888bfd63d01c79fe415c3" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" ADD CONSTRAINT "FK_637cf8bcc6af8179fe2255c95d7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" ADD CONSTRAINT "FK_c1f1f6767309ee31c5550745f31" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" DROP CONSTRAINT "FK_c1f1f6767309ee31c5550745f31"`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms_chatroom" DROP CONSTRAINT "FK_637cf8bcc6af8179fe2255c95d7"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_936561888bfd63d01c79fe415c3"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_585112c8b172314e664a063bba2"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_cb670e55b9d06955d4b33863978"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_1b6226fd0003dbe26f809118849"`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_560c538cb4e3993c0e762aeeee0"`);
        await queryRunner.query(`ALTER TABLE "projectfile" DROP CONSTRAINT "FK_6dc0c9d14e71daf56ced0704bd3"`);
        await queryRunner.query(`ALTER TABLE "chatroom" DROP CONSTRAINT "FK_fab63286645b8337cdba691b8da"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_478ef394684bb7b0002a43ea0a0"`);
        await queryRunner.query(`ALTER TABLE "chatlog" DROP CONSTRAINT "FK_a4cc32fa4045fff3da4aa1d24e1"`);
        await queryRunner.query(`DROP INDEX "IDX_c1f1f6767309ee31c5550745f3"`);
        await queryRunner.query(`DROP INDEX "IDX_637cf8bcc6af8179fe2255c95d"`);
        await queryRunner.query(`DROP TABLE "user_chatrooms_chatroom"`);
        await queryRunner.query(`DROP INDEX "IDX_936561888bfd63d01c79fe415c"`);
        await queryRunner.query(`DROP INDEX "IDX_79daf0d2be103f4c30c77ddd6b"`);
        await queryRunner.query(`DROP TABLE "user_projects_project"`);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "storage"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "projectfile"`);
        await queryRunner.query(`DROP TABLE "learning"`);
        await queryRunner.query(`DROP TABLE "chatroom"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "chatlog"`);
    }

}
