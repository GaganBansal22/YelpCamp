let i=10;
const loadCampgrounds=()=>{
    for(j=0;j<10;j++){
        let campground=camps[i+j];
        const containerdiv=document.createElement("div");
        containerdiv.classList.add("card");
        containerdiv.classList.add("mb-3");
        let row=document.createElement("div");
        row.classList.add("row");
        let imgdiv=document.createElement("div");
        imgdiv.classList.add("col-md-4");
        let img=document.createElement("img");
        img.classList.add("img-fluid");
        img.src=campground.images[0].url;
        imgdiv.appendChild(img);
        row.appendChild(imgdiv);
        let newElement=document.createElement("div");
        newElement.classList.add("col-md-8");
        let innerdiv=document.createElement("div");
        innerdiv.classList.add("card-body");
        let h5=document.createElement("h5");
        h5.classList.add("card-title");
        h5.innerText=campground.title;
        innerdiv.appendChild(h5);
        let p1=document.createElement("p");
        p1.classList.add("card-text");
        p1.innerText=campground.description;
        innerdiv.appendChild(p1);
        let p2=document.createElement("p");
        let small=document.createElement("small");
        small.classList.add("text-muted");
        small.innerText=campground.loaction;
        p2.appendChild(small);
        innerdiv.appendChild(p2);
        let a=document.createElement("a");
        a.classList.add("btn");
        a.classList.add("btn-primary");
        a.href=`/campgrounds/${campground._id}`;
        a.innerText=`View ${campground.title}`;
        innerdiv.appendChild(a);
        newElement.appendChild(innerdiv);
        row.appendChild(newElement);
        containerdiv.appendChild(row);
        document.querySelector(".campgrounds").appendChild(containerdiv);
    }
    i+=10;
}
window.addEventListener("scroll",()=>{
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        loadCampgrounds();
    }
})