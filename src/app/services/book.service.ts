import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ITimeStamp {
  seconds: number;
}

export interface IBook { name:string; isRead:boolean; }
export interface IBookID extends IBook { id: string; }
export interface IBookUpload extends IBook { date }

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookCollection: AngularFirestoreCollection<IBook>;
  books: Observable<IBook[]>;
  
  constructor(private afs:AngularFirestore) {
    this.bookCollection = afs.collection('books', (reference)=>{
      return reference.orderBy('date', 'desc').where('isRead', '==', false).limit(1)
    });
    this.books = this.bookCollection.snapshotChanges()
    .pipe(map(this.includeCollectionID));
  }
  
  includeCollectionID(docChangeAction){
    return docChangeAction.map((a) => {
       const data = a.payload.doc.data();
       const id = a.payload.doc.id;
       return { id, ...data};
    });
  }

  handleError(error: Error) {
    console.log(error);
  }
  
  add(book: IBook){
    const payload: IBookUpload = {date: new Date(), ...book}; 
    return this.bookCollection.add(payload)
    .catch(this.handleError);
  }

  delete(book: IBookID){
    console.log(book);
    this.bookCollection.doc(book.id).delete();
  }

  update(book: IBookID){
    this.bookCollection.doc(book.id).update({
      isRead: book.isRead
    });
  }

  get(id: string){
    return this.bookCollection.doc(id).get()
    .pipe(map(
      (payLoad) => {
        return{id: id, ...payLoad.data()} as IBookID;
    }));
  }

  sync(id: string){
    return this.bookCollection.doc(id)
    .valueChanges() as Observable<IBookID>;
  }









}
