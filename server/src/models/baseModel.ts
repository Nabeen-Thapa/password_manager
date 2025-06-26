import { Column, PrimaryGeneratedColumn } from "typeorm";

export class baseModel{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}