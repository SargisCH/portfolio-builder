import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    tools: string;

    @Column({ nullable: true })
    date: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    area: string;

    @Column('text', { array: true })
    renders: string[];

    @Column('text', { array: true })
    thumbs: string[];

    @Column('int', { nullable: true })
    sortIndex?: number;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
