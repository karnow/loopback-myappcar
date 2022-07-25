import {Entity, model, property} from '@loopback/repository';

@model()
export class Event extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  useremail: string;

  @property({
    type: 'string',
  })
  start?: string;

  @property({
    type: 'string',
  })
  stop?: string;


  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
