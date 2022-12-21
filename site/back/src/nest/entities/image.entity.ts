import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class ImageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

	@Column({ type: 'bytea' })
	buffer: Buffer;
}