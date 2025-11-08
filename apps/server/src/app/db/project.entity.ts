import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    tools: string;

    @Column()
    date: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true, array: true })
    images: string[];

    @Column({ nullable: true })
    thumbs: string[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
