import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonaSchema } from './entities/persona.entity';
@Module({
  controllers: [PersonasController],
  providers: [PersonasService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Persona', schema: PersonaSchema }]),
  ],
})
export class PersonasModule {}
