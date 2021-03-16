import { Container } from 'inversify';

import { CartRepository, CartService, TYPES } from './interface';
import { CartRepositoryImpl, CartServiceImpl } from './implementation';

var container = new Container();
container.bind<CartService>(TYPES.CartService).to(CartServiceImpl);
container.bind<CartRepository>(TYPES.CartRepository).to(CartRepositoryImpl);

export default container;
