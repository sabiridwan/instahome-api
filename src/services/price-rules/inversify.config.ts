import { Container } from 'inversify';

import { PriceRuleRepository, PriceRuleService, TYPES } from './interface';
import { PriceRuleRepositoryImpl, PriceRuleServiceImpl } from './implementation';

var container = new Container();
container.bind<PriceRuleService>(TYPES.PriceRuleService).to(PriceRuleServiceImpl);
container.bind<PriceRuleRepository>(TYPES.PriceRuleRepository).to(PriceRuleRepositoryImpl);

export default container;
