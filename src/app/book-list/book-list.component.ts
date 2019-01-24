import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook, BookService, IBookID } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  
  
  addButtonDisabled = false;
  books: Observable<IBook[]>;
  readingNow: IBook;
  syncedReadingNow: Observable<IBookID>;
  
  constructor(private bookService:BookService) {
    this.books = this.bookService.books;
  }
  
  add(bookTitle: HTMLInputElement) {
    if(bookTitle.value){
      const book: IBook = {
        name:bookTitle.value,
        isRead: false
      };
      this.addButtonDisabled = true;
      
      this.bookService.add(book)
      .then(()=> {
        bookTitle.value = '';
        this.addButtonDisabled = false;
      }
      );
    }
  }

  delete(book: IBookID){
    this.bookService.delete(book)
  }

  update(book: IBookID){
    this.bookService.update(book);
  }

  get(id: string){
   this.bookService.get(id).toPromise().then((data) => {
    this.readingNow = data;
   });
  }

  sync(id: string ){
      this.syncedReadingNow = this.bookService.sync(id);
}
  
  ngOnInit() {
  }
  
}
