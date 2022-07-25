import {repository} from '@loopback/repository';
import {
  getModelSchemaRef, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {Event} from '../models';
import {EventRepository} from '../repositories';

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository : EventRepository,
  ) {}

  @post('/startevent')
  @response(200, {
    description: 'Event model instance',
    content: {'application/json': {schema: getModelSchemaRef(Event)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewEvent',
            exclude: ['id'],
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    return this.eventRepository.create({...event,
      start: (new Date).toISOString()});
  }


  @patch('/stopevent/{id}')
  @response(204, {
    description: 'Event PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Event,
  ): Promise<void> {
   const result= await this.eventRepository.findById(id);
   await this.eventRepository.updateById(id, {...event,...result, stop: (new Date).toISOString()});
  }



}
