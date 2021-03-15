import { Container } from 'inversify';

import { AdRepository, AdService, TYPES } from './interface';
import { AdRepositoryImpl, AdServiceImpl } from './implementation';

var container = new Container();
container.bind<AdService>(TYPES.AdService).to(AdServiceImpl);
container.bind<AdRepository>(TYPES.AdRepository).to(AdRepositoryImpl);

export default container;
