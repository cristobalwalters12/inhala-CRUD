import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Persona extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  edad: number;

  @Prop({ required: true })
  email: string;
}

export const PersonaSchema = SchemaFactory.createForClass(Persona);
