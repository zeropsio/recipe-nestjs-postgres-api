import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EntityManager, Connection } from 'typeorm';
import { Todo } from './todos/todos.entity';
import * as winston from 'winston';
import * as Syslog from 'winston-syslog';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger: winston.Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly connection: Connection,
  ) {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console()
        // new Syslog.Syslog({
        //   host: 'localhost',
        //   port: 514,
        //   protocol: 'udp4',
        //   app_name: 'my-nest-app',
        // }),
      ],
    });
  }

  onApplicationBootstrap() {
    const logTemplates = [
      // Previous templates...
      (userId: any) => `User ${userId} logged in successfully.`,
      (userId: any) => `User ${userId} attempted to access restricted area.`,
      (userId: any) => `Error fetching user details for user ${userId}.`,

      // Multiline error message
      (userId: any) =>
        `Error encountered for user ${userId}:\nStack Trace:\nError: Invalid operation\n    at moduleA (moduleA.js:10:20)\n    at moduleB (moduleB.js:5:15)`,

      // JSON output
      (userId: any) =>
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            userId: userId,
            action: 'Data processed',
            status: 'Success',
            metadata: { ip: '192.168.1.10', sessionId: 'abc123' },
          },
          null,
          2,
        ),

      // More complex multi-line JSON
      (userId: any) =>
        `Processing details for user ${userId}:\n` +
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            processId: Math.floor(Math.random() * 10000),
            userId: userId,
            steps: [
              { step: 'validate', status: 'complete' },
              { step: 'transform', status: 'in_progress' },
              { step: 'load', status: 'pending' },
            ],
          },
          null,
          2,
        ),
      // ... additional templates as needed
    ];

    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * logTemplates.length);
      const randomUserId = Math.floor(Math.random() * 1000) + 1; // simulate user IDs
      const logMessage = logTemplates[randomIndex](randomUserId);

      // Randomly log either info or error messages
      if (Math.random() < 0.1) {
        this.logger.info(logMessage);
      } else {
        this.logger.error(logMessage);
      }
    }, 200);
  }

  async seed(data: string[]) {
    const seeded = await this.entityManager.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'todo');`,
    );

    if (seeded?.[0]?.exists === false && !!data?.length) {
      console.log('Seeding data for Zerops recipe ⏳');
      await this.connection.synchronize();
      await this.entityManager.save(
        Todo,
        data.map((text) => ({ text })),
      );
      console.log('Done ✅');
    }
  }
}
