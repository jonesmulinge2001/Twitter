
// create interfaces for Users, Posts, Comments

interface User{
    id:number;
    name:string;
    username:string
    email:string;
    address:{
        street:string;
        city:string;
        zipcode:string;
        geo:{
            lat:string;
            lng:string;
        }
    }
    phone:string;
    website:string;
    company:{
        name:string;
        catchPhrase:string;
        bs:string;
    }
}

interface Post{
    userId:number;
    id:number;
    title:string;
    body:string;
}

interface Comment{
    postId:number;
    id:number;
    name:string;
    email:string;
    body:string;
}

// selecting DOM Elements 
const selectUser = document.getElementById("SelectUser") as HTMLSelectElement;
const userPosts = document.getElementById("userPosts") as HTMLUListElement;
const userComments = document.getElementById("userComments") as HTMLUListElement;
const userDetails = document.getElementById("userdetails") as HTMLUListElement;

// function a to fetch all users
let userData:User[];
const fetchAllUsers = async () =>{
    const myResponse = await fetch("https://jsonplaceholder.typicode.com/users");
    if(myResponse.ok){
        userData = await myResponse.json();
        // iterating through userData
        userData.forEach((user) =>{
            // creating option element
            const optionElement = document.createElement("option");
            optionElement.value = user.id.toString();
            optionElement.textContent = user.name;
            selectUser.appendChild(optionElement);
        });

        // call the function b to fetch user posts and comments
        selectUser.value = '1';
        fetchUserPosts(1);
        displayUseDetails(1);
    }

};

// async function to fetch user posts
let myData:Post[];
const fetchUserPosts = async (userId:number) =>{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if(response.ok){
        myData = await response.json();
        userPosts.innerHTML = '';
        userComments.innerHTML = '';

        // iterating through posts array
        myData.forEach((post) =>{
            const liPostElement = document.createElement("li");
            liPostElement.textContent = `${post.title} - ${post.body}`;
            userPosts.appendChild(liPostElement);

            // when you click a post then load comments of that post
            liPostElement.addEventListener('click', () =>{
                fetchUserComments(post.id);
            })
        });
    }
}

// asynch function to fetch comments
let comments: Comment[];
const fetchUserComments = async (postId:number) =>{
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if(response.ok){
        comments = await response.json();
        userComments.innerHTML = '';

        // iterating through comments array
        comments.forEach((comment) =>{
            const liCommentElement = document.createElement("li");
            liCommentElement.textContent = `${comment.email} ${comment.body}`;
            userComments.appendChild(liCommentElement);
        });
    }
};


// function to display user details
const displayUseDetails = (userId:number) =>{
    // loop through users array to find user with matching id
    const user = userData.find(user => user.id === userId);
    if(user){
        userDetails.innerHTML = '';
        const details = [
            `${user.name}`,
            `${user.username}`,
            `${user.email}`,
            `${user.company.name}`,
        ]
        
        // iterate through details array
        details.forEach((detail) =>{
            const userLiElement = document.createElement("li");
            userLiElement.textContent = detail;
            userDetails.appendChild(userLiElement);
        });
    }
};

// add eventListener for select dropdown (change)
selectUser.addEventListener('change', () =>{
    const selectedUserId  = parseInt(selectUser.value);
    fetchUserPosts(selectedUserId);
    displayUseDetails(selectedUserId);
});

// load the fetchAllUsers() function
fetchAllUsers();