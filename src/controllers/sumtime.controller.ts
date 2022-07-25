var moment = require('moment'); // require
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Event} from '../models';
import {EventRepository} from '../repositories';

export class SumtimeController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
  ) {}

  @get('/allusersworkingtime/')
  @response(200, {
    description: 'Array of Event model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Event, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Event) filter?: Filter<Event>): Promise<Event[]> {
    const allWorkingTime = await this.eventRepository.find({
      order: ['start ASC'],
    });
    console.log(allWorkingTime);

    function convertMsToHM(milliseconds: number): string {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = seconds >= 30 ? minutes + 1 : minutes;
      minutes = minutes % 60;
      hours = hours % 24;
      return `${hours} godzin:${minutes} minut`;
    }

    function sumAllUsersWorkingTime() {
      return new Promise(resolve => {
        let userEvent: any[] = [];
        let currentDate: string = '';
        currentDate = moment(allWorkingTime[0].start)
          .utc()
          .format('YYYY-MM-DD');
        let timeEventInmilisecound = 0;
        let obj: {
          [key: string]: any;
        };
        obj = {};

        allWorkingTime.forEach((el, index, array) => {
          const nextstart = moment(array[index + 1]?.start)
            .utc()
            .format('YYYY-MM-DD');

          currentDate = moment(el.start).utc().format('YYYY-MM-DD');
          const startEventInMilisecound = moment(el.start).valueOf();
          const stopEventInMilisecound = moment(el.stop).valueOf();
          timeEventInmilisecound +=
            stopEventInMilisecound - startEventInMilisecound;

          obj = {
            date: currentDate,
            sum: timeEventInmilisecound,
          };
          if (
            allWorkingTime.length === index + 1 ||
            currentDate !== nextstart
          ) {
            const sumOfUserWork = convertMsToHM(timeEventInmilisecound);
            obj = {
              date: currentDate,
              sumAllUsersWorkingTime: sumOfUserWork,
            };
            userEvent.push(obj);
            timeEventInmilisecound = 0;
          }
        });

        resolve(userEvent);
      });
    }

    return sumAllUsersWorkingTime().then();
  }

  @get('/userworkingtime/{useremail}')
  @response(200, {
    description: 'Event model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Event, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('useremail') useremail: string,
    @param.filter(Event, {exclude: 'where'})
    filter?: FilterExcludingWhere<Event>,
  ): Promise<Event[]> {
    const res = await this.eventRepository.find({
      where: {useremail: useremail},
    });

    function convertMsToHM(milliseconds: number): string {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = seconds >= 30 ? minutes + 1 : minutes;
      minutes = minutes % 60;
      hours = hours % 24;
      return `${hours} godzin:${minutes} minut`;
    }

    function sumOfWorkingUserTime() {
      return new Promise(resolve => {
        let userEvent: any[] = [];
        let currentDate: string = '';
        currentDate = moment(res[0].start).utc().format('YYYY-MM-DD');
        let timeEventInmilisecound = 0;
        let obj: {
          [key: string]: any;
        };
        obj = {};

        res.forEach((el, index, array) => {
          const nextstart = moment(array[index + 1]?.start)
            .utc()
            .format('YYYY-MM-DD');

          currentDate = moment(el.start).utc().format('YYYY-MM-DD');
          const startEventInMilisecound = moment(el.start).valueOf();
          const stopEventInMilisecound = moment(el.stop).valueOf();
          timeEventInmilisecound +=
            stopEventInMilisecound - startEventInMilisecound;

          obj = {
            date: currentDate,
            sum: timeEventInmilisecound,
          };
          if (res.length === index + 1 || currentDate !== nextstart) {
            const sumOfUserWork = convertMsToHM(timeEventInmilisecound);
            obj = {
              date: currentDate,
              sumOfWorkingTime: sumOfUserWork,
            };
            userEvent.push(obj);
            timeEventInmilisecound = 0;
          }
        });

        resolve(userEvent);
      });
    }

    return sumOfWorkingUserTime().then();
  }
}
