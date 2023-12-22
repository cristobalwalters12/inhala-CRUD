import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Persona } from './entities/persona.entity';
@Injectable()
export class PersonasService {
  constructor(
    @InjectModel('Persona') private readonly personaModel: Model<Persona>,
  ) {}
  async create(createPersonaDto: CreatePersonaDto) {
    try {
      const createdPersona = new this.personaModel(createPersonaDto);
      return await createdPersona.save();
    } catch (error) {
      throw new BadRequestException('error al crear la persona');
    }
  }

  findAll() {
    try {
      const Personas = this.personaModel.find();
      return Personas;
    } catch (error) {
      throw new BadRequestException('error al listar las personas');
    }
  }

  async findOne(term: string) {
    let persona: Persona;
    if (isValidObjectId(term)) {
      persona = await this.personaModel.findById(term);
    }
    if (!persona) {
      persona = await this.personaModel.findOne({
        nombre: term.toLowerCase(),
      });
    }
    if (!persona) {
      throw new BadRequestException('Persona no encontrada');
    }
    return persona;
  }

  async update(id: string, updatePersonaDto: UpdatePersonaDto) {
    try {
      const persona = await this.findOne(id);
      if (updatePersonaDto.nombre) {
        updatePersonaDto.nombre = updatePersonaDto.nombre;
      }
      await persona.updateOne(updatePersonaDto);
      return { ...persona.toJSON(), ...updatePersonaDto };
    } catch (error) {
      throw new BadRequestException('No se pudo actualizar la persona');
    }
  }

  async remove(id: string) {
    const result = await this.personaModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new BadRequestException('Persona no encontrada');
    }
    return result;
  }
}
