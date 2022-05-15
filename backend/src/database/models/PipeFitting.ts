import { Entity } from '@mikro-orm/core';
import PipeItem from './PipeItem';

@Entity({ discriminatorValue: 'pipeFitting' })
export default class PipeFitting extends PipeItem {

}
