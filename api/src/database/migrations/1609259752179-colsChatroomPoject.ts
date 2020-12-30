import {MigrationInterface, QueryRunner} from "typeorm";

export class colsChatroomPoject1609259752179 implements MigrationInterface {
    name = 'colsChatroomPoject1609259752179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatroom" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "chatroom"."description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "parentProject" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "project"."parentProject" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "project"."parentProject" IS NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "parentProject" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "chatroom"."description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "chatroom" ALTER COLUMN "description" SET NOT NULL`);
    }

}
