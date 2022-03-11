import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Todo } from './todos/todos.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly entityManager: EntityManager) {}
  onApplicationBootstrap() {
    this.seed(JSON.parse(process.env.ZEROPS_RECIPE_DATA_SEED || '[]'));
  }

  async seed(data: string[]) {
    const seeded = await this.entityManager.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'todo');`,
    );

    if (!seeded && data?.length) {
      await this.entityManager.save(
        Todo,
        data.map((text) => ({ text })),
      );
    }
  }
}
