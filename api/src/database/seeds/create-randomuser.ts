import { User } from "../entities/user.entity"
import { Factory, Seeder } from "typeorm-seeding"


export default class CreateRandomUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(User)().createMany(10)
  }
}
