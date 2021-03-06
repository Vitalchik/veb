var useLocalStorage = false;

 function switchUseLS(){
   useLocalStorage = !useLocalStorage;
 }

 class News{
   constructor(title, body, picture){
     this.title = title;
     this.body = body;
     this.picture = picture;
   }
 }

 window.isOnline = () => this.navigator.onLine;
 const getById = (id) => document.getElementById(id);

 const newsContainer = getById('all_news');

 function newsTemplate(news) {
 var title = news.title;
 var body = news.body;
 var picture = news.picture;
 var button = document.createElement('input');

 button.type  = 'button';
 button.addEventListener('click', function() {
     alert(add);
 }, false);
 return `
 <a href="#">
   <div class="col-lg-4" style="display: inline-block;">
     <div class="card">
     <img src="img/8.png">
     <h4>alt="${title}"</h4>
     <p>${body}</p>
     <a >[+1]</a>
     </div>
   </div>
 </a>
`
 }

 function myFunction() {
   if(useLocalStorage){
     localStorage.clear();
     alert("Вашу новину видалено успішно!");
     location.reload();
     show();
   }
   else {
       window.indexedDB.deleteDatabase("news_data");
       location.reload();
       show();
   }
 }

 function show(){
   if(useLocalStorage){
   const data = localStorage.getItem('news_data');

   if (!isOnline()) return;

   if (!data) {
     console.log('No available local data found');
   } else {
     JSON.parse(data).forEach(({ title, body, picture }) => {
         console.log(title, body);
         var tempNews = new News(title, body, picture);

         $('#call_news').append(
           newsTemplate(tempNews),
         );

     });
   }
   }
   else if (!isOnline()) return;

   else {
     var openDB = indexedDB.open("news_data");
     openDB.onupgradeneeded = function() {
         var db = openDB.result;
         var store = db.createObjectStore("news", {keyPath: "title"});
         store.createIndex("title", "title", { unique: false });
         store.createIndex("body", "body", { unique: false });
         store.createIndex("picture", "picture", { unique: false });
     }
     openDB.onsuccess = function(event) {
       var db = openDB.result;
       var tx = db.transaction("news", "readwrite");
         var store = tx.objectStore("news");
         store.openCursor().onsuccess = function(event) {
         var cursor = event.target.result;

         if (cursor) {
           var tempNews = new News(cursor.value.title, cursor.value.body, cursor.value.picture);

           if(navigator.onLine){
           $('#all_news').append(
             newsTemplate(tempNews),
           );
         }

           cursor.continue();
         }
       };
         tx.oncomplete = function(){
           db.close();
         }
     }
   }
 }

 const onOnline = () => {
   show();
   console.log('Network status: online');
 }

 const onOffline = () => {
   console.log('Connection lost');
 }

 window.addEventListener('online', onOnline);
 window.addEventListener('offline', onOffline);
 window.addEventListener('DOMContentLoaded', show);
