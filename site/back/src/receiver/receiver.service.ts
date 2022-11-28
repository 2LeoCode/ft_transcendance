import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Receiver from "./receiver.entity";

@Injectable()
export default class ReceiverService {
	constructor(
		@InjectRepository(Receiver) private receiverRepository: Repository<Receiver>,
	) {}

	async insert(type: 'User' | 'Channel'): Promise<Receiver> {
		return this.receiverRepository.save({
			type: type
		});
	}

	async find(opts: {
		id?: string;
		type?: 'User' | 'Channel';
	}): Promise<Receiver[]> {
		return this.receiverRepository.findBy(opts);
	}

	async remove(id: string): Promise<Receiver[]> {
		return this.receiverRepository.remove(await this.find({ id: id }));
	}
}