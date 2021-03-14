import { Container } from 'inversify';

import { CustomerRepository, CustomerService, TYPES } from './interface';
import { CustomerRepositoryImpl, CustomerServiceImpl } from './implementation';

var container = new Container();
container.bind<CustomerService>(TYPES.CustomerService).to(CustomerServiceImpl);
container.bind<CustomerRepository>(TYPES.CustomerRepository).to(CustomerRepositoryImpl);

export default container;
