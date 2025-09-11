const addBooksection=document.querySelector('.add-book-section');
const toggleFormBtn=document.querySelector('.toggle-btn');
const typeSelect=document.getElementById('type');
const ebookDetails=document.getElementById('ebook-details');
const bookForm=document.getElementById('book-form');
const bookList=document.getElementById('book-list');
const fileSize=document.getElementById('fileSize');
const eBook=document.getElementById('e-book');
let book=[];

toggleFormBtn.addEventListener("click",()=>{
   if(addBooksection.style.display === 'none'){
     addBooksection.style.display = 'block';
    toggleFormBtn.textContent = 'Hide Form';
   }else{
    addBooksection.style.display = 'none';
    toggleFormBtn.textContent = 'Add New Book';
   }
});
//ebook
typeSelect.addEventListener("change",()=>{
    if(typeSelect.value === 'ebook'){
    ebookDetails.style.display = 'block';
   }else{
    ebookDetails.style.display = 'none';
} 
});
bookForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const title=document.getElementById('title').value;
  const author=document.getElementById('author').value;
  let bookType;
  if(typeSelect.value==="ebook"){
     bookType=new Ebook(title,author,fileSize.value);
  }else{
     bookType=new Book(title,author);
  }
book.push(bookType);
saveBooks();
displayBooks();
bookForm.reset();
ebookDetails.style.display='none';
})
class Book{
         constructor(title,author){
        this.title=title;
        this.author=author;
        this.type='Physical';
        this.id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
        this.available=true;
        this.borrower=null;
    }
    borrow(borrowerName){
          this.borrower=borrowerName;
          this.available=false;
        }
        markReturn(){
          this.borrower=null;
          this.available=true;
        }

getHTML(){
return `<div class="book-card" draggable="true" data-id="${this.id}">
                <h3 class="book-title">${this.title}</h3>
                    <div class="book-meta">Author : ${this.author}</div>
                    <div class="book-meta">Status: ${this.borrower ? `Borrowed by ${this.borrower}`: `Available`}</div>
                     <div class="book-actions">
                     ${this.available? ' <button class="btn btn-borrow">Borrow</button>': 
                      ' <button class="btn btn-return">Return</button>'}
                    <button class="btn btn-remove" >Remove</button>
                    </div>`
}

}
class Ebook extends Book{
  constructor(title,author,fileSize){
  super(title,author)
  this.type='ebook';
  this.fileSize=fileSize;
  }
   borrow(borrowerName){
          this.borrower=borrowerName;
        }
   markReturn(){
          this.borrower=null;
        }
  getHTML(){
return `<div class="book-card ebook" draggable="true" data-id="${this.id}">
                <h3 class="book-title">${this.title}</h3>
                    <div class="book-meta">Author : ${this.author}</div>
                    <div class="book-meta">File Size: ${this.fileSize} MB</div>
                    <div class="book-meta">Status: ${this.borrower ? `Downloaded by ${this.borrower}`: `Available`}</div>
                     <div class="book-actions">
                     ${this.borrower? ' <button class="btn btn-return">Return</button>': 
                      ' <button class="btn btn-borrow">Download</button>'}
                    <button class="btn btn-remove" >Remove</button>
                    </div>`
}

}

function displayBooks(){
    bookList.innerHTML = "";
    if(book.length === 0){
        bookList.innerHTML = "No Books Found";
    }
    book.forEach(bookItem => {
        bookList.innerHTML += bookItem.getHTML();
    });

    // Existing button listeners (borrow, return, remove)
    document.querySelectorAll('.btn-borrow').forEach(b => {
        b.addEventListener("click", (e) => {
            const bookId = e.target.closest('.book-card').getAttribute("data-id");
            const bookBorrower = prompt('Enter Your Name');
            if(bookBorrower){
                borrowBooks(bookId, bookBorrower);
            }
        });
    });

    document.querySelectorAll('.btn-return').forEach(b => {
        b.addEventListener("click", (e) => {
            const bookId = e.target.closest('.book-card').getAttribute("data-id");
            returnBooks(bookId);
        });
    });

    document.querySelectorAll('.btn-remove').forEach(b => {
        b.addEventListener("click", (e) => {
            const confirmRemove = confirm('Are you sure you want to remove?');
            if(confirmRemove){
                const bookId = e.target.closest('.book-card').getAttribute("data-id");
                removeBooks(bookId);
            }
        });
    });

    // --- Drag-and-Drop Functionality ---
    const bookCards = bookList.querySelectorAll('.book-card');
    let draggedBook = null;

    bookCards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedBook = card;
            setTimeout(() => card.classList.add('dragging'), 0);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            bookCards.forEach(c => c.classList.remove('over'));
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            const targetCard = e.target.closest('.book-card');
            if (targetCard && targetCard !== draggedBook) {
                targetCard.classList.add('over');
            }
        });
        
        card.addEventListener('dragleave', (e) => {
            if (!card.contains(e.relatedTarget)) {
                card.classList.remove('over');
            }
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetCard = e.target.closest('.book-card');
            
            if (targetCard && targetCard !== draggedBook) {
                const bookCardsArray = Array.from(bookList.children);
                const draggedIndex = bookCardsArray.indexOf(draggedBook);
                const targetIndex = bookCardsArray.indexOf(targetCard);

                const bookToMove = book.splice(draggedIndex, 1)[0];
                book.splice(targetIndex, 0, bookToMove);
                
                saveBooks();
                displayBooks();
            }
            bookCards.forEach(c => c.classList.remove('over'));
        });
    });
}

function borrowBooks(bookId,bookBorrower){
book.forEach(b=>{
  if(b.id==bookId){
   b.borrow(bookBorrower);
  }
});


saveBooks();
displayBooks();
}

function returnBooks(bookId){
book.forEach(b=>{
  if(b.id==bookId){
    b.markReturn()
  }
})
saveBooks();
 displayBooks();
}

function removeBooks(bookId){
  book=book.filter(book => book.id != bookId);
   saveBooks();
   displayBooks();
}

function saveBooks(){
    localStorage.setItem('booksArray',JSON.stringify(book))
}

function loadBooks() {
    const stored = localStorage.getItem('booksArray');
    if (stored) {
        const bookObjects = stored ?  JSON.parse(stored) : [] ;
       // clear current books array
        book=bookObjects.map(obj => {
             if(obj.type==='ebook'){
              const newBook= new Ebook(obj.title, obj.author, obj.fileSize);
                newBook.id = obj.id;
                newBook.available = obj.available;
                newBook.borrower = obj.borrower;
                return newBook;
             }else{
              const newBook=new Book(obj.title, obj.author);
                newBook.id = obj.id;
                newBook.available = obj.available;
                newBook.borrower = obj.borrower;
                return newBook;
             }
        });
        
    }
  }
function addDefaultBooks(){
   const defaultBooks = [
      new Book("To Kill a Mockingbird", "Harper Lee"),
      new Book("1984", "George Orwell"),
      new Book("The Great Gatsby", "F. Scott Fitzgerald"),
      new Book("Pride and Prejudice", "Jane Austen")
    ];

  const defaultEbooks = [
      new Ebook("The Digital Age", "Mark Stevenson", 3.5),
      new Ebook("Programming Basics", "John Smith", 8.2),
      new Ebook("Artificial Intelligence", "Alan Turing", 5.7)
    ];

[...defaultBooks,...defaultEbooks].forEach(b=>{
  book.push(b);
});
saveBooks();
}
document.addEventListener('DOMContentLoaded',()=>{
  loadBooks();
  if(book.length===0){
  addDefaultBooks();
}
  displayBooks();
});













