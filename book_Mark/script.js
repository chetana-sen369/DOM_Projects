function generateBookmarkId() {
  return Math.floor(1000 + Math.random() * 9000)
}
const form=document.getElementById('add-bookmark');
const bookmarkList=document.querySelector('.bookmarks-list');
let currentFilter='All';
const buttons=document.querySelectorAll('.filter-btn');
let filterArr=[];
let bookmarks=[];
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    //console.log("hello");
    const title=document.getElementById('websiteTitle').value;
const url=document.getElementById('websiteUrl').value;
const category=document.getElementById('category').value;
    const bookObj={
         id: generateBookmarkId(),
         title:title,
         url:url,
         cat:category
}
bookmarks.push(bookObj);
saveBookmarks();
applyFilter()
 form.reset();

});

function renderBookmarks(){
  //handle empty List Gracefully 
    if(filterArr.length===0){
      bookmarkList.innerHTML="<p>No Bookmarks found.</p>";
      return;
    }
    bookmarkList.innerHTML = '';
    filterArr.forEach((b)=>{
  let bookmarkItem=document.createElement('div');
  bookmarkItem.classList.add('bookmark-item')
  bookmarkItem.innerHTML=`<div class="bookmark-info">
                    <h3>${b.title}</h3>
                    <a class="bookmark-link" href="${b.url}">${b.url}</a>
                    <div class="bookmark-category">${b.cat}</div>
                </div>
                <button class="delete-btn">Delete</button>`;
                bookmarkList.append(bookmarkItem);
                //console.log(bookmarkList);
                //delete button
    let deleteBtn = bookmarkItem.querySelector('.delete-btn');
    deleteBtn.addEventListener("click", ()=>{
        handleDelete(b.id);
    });
    });      
}

//delete button functionality
function handleDelete(id){
  bookmarks=bookmarks.filter(bookmark => bookmark.id != id);
  applyFilter();
  saveBookmarks();
}

document.addEventListener("DOMContentLoaded",() =>{
  //applyFilter();
  loadBookmarks();
});

//adding eventListener to all filter buttons
buttons.forEach((button)=>{
button.addEventListener('click',()=>{
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  currentFilter=button.getAttribute('data-category');
applyFilter();
}) 
})
//applyFilter function
function applyFilter(){
  if(currentFilter==='All'){
     filterArr= bookmarks;
  }else if(currentFilter==='Work'){
    filterArr=bookmarks.filter(b =>b.cat==='Work');
  }else if(currentFilter==='Study'){
    filterArr=bookmarks.filter(b =>b.cat==='Study');
  }else{
    filterArr=bookmarks.filter(b =>b.cat==='Entertainment');
  }
 // console.log("hello");
  renderBookmarks();
}
//function for localStorage
function saveBookmarks(){
  localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
}

//loading bookmarks back
function loadBookmarks(){
  const stored=localStorage.getItem('bookmarks');
  if(stored){
    bookmarks=JSON.parse(stored)
  }
  applyFilter();
}