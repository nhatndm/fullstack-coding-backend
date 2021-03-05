import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
} from 'typeorm';

import * as firbaseAdmin from 'firebase-admin';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @AfterInsert()
  saveNewDataToFireStore(): void {
    const entityName = this.constructor.name
      .replace('Entity', '')
      .toLowerCase();

    const cloneData = Object.assign({}, this);

    delete cloneData.id;

    firbaseAdmin
      .firestore()
      .collection(entityName)
      .doc()
      .set({ ...cloneData, pid: this.id });
  }

  @AfterUpdate()
  updateDataToFireStore(): void {
    const entityName = this.constructor.name
      .replace('Entity', '')
      .toLowerCase();

    const cloneData = Object.assign({}, this);

    delete cloneData.id;

    firbaseAdmin
      .firestore()
      .collection(entityName)
      .where('pid', '==', this.id)
      .get()
      .then(v => {
        const item = v.docs[0];

        item.ref.update({ ...cloneData });
      });
  }

  @BeforeRemove()
  deleteDataOnFirebase(): void {
    const entityName = this.constructor.name
      .replace('Entity', '')
      .toLowerCase();

    firbaseAdmin
      .firestore()
      .collection(entityName)
      .where('pid', '==', this.id)
      .get()
      .then(v => {
        const item = v.docs[0];

        item.ref.delete();
      });
  }
}
