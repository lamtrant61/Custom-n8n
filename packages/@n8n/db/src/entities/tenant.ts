import {
	Column,
	Entity,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
} from '@n8n/typeorm';

// eslint-disable-next-line import-x/no-cycle
import { User } from './user';

@Entity()
export class Tenant {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column()
	subdomain: string;

	@Column()
	logo: string;

	@Column()
	status: boolean;

	@Column()
	isDeleted: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(
		() => User,
		(user) => user.tenant,
	)
	users: User[];
}
