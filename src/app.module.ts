import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { Syslog } from 'winston-syslog';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

// Create a separate instance of the Syslog transport
const syslogTransport = new Syslog({
  host: 'logger.core',
  port: 514,
  protocol: 'udp4',
  facility: 'local1',
  format: format.combine(format.timestamp(), format.json()),
});

// Attach an error event listener to the Syslog transport
syslogTransport.on('error', (error) => {
  console.error('There was an error with the Syslog transport:', error);
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    WinstonModule.forRoot({
      transports: [
        // Uncomment the Console transport if needed
        // new transports.Console({
        //   format: format.combine(
        //     format.timestamp(),
        //     format.ms(),
        //     nestWinstonModuleUtilities.format.nestLike('MyApp', {
        //       colors: true,
        //       prettyPrint: true,
        //     }),
        //   ),
        // }),
        syslogTransport, // Use the separate Syslog transport instance
      ],
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
