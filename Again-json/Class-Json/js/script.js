import { $ , $$ } from "./lib.js";

class DataFetcher {
    constructor() {
        this.category = null;
        this.member = null;
        this.posts = null;
    }

    async fetchData() {
        try {
            [this.category, this.member, this.posts] = await Promise.all([
                fetch('./json/categorys.json').then(res => res.json(
                    
                )),
                fetch('./json/members.json').then(res => res.json()),
                fetch('./json/posts.json').then(res => res.json())
            ]);
            this.renderData();
        } catch (error) {
            console.error("Data fetching error:", error);
        }
    }

    getUserName(memberIndex) {
        const member = this.member.find(data => data.index === memberIndex);
        return member ? member.name : 'Unknown User';
    }

    createPostElement(post) {
        const newItem = document.createElement('div');
        newItem.classList.add('jsonValueCont');

        const userName = this.getUserName(post.memberIndex);

        newItem.innerHTML = `
            <div class="img"><img src="" alt=""></div>
            <div class="description">
                <h4 class="title">${post.title}</h4>
                <h6 class="contents">${post.contents}</h6>
                <ul class="memberCont">
                    <li class="memberIndex">${userName}</li>
                    <li class="date">${post.date}</li> 
                </ul>
            </div>
        `;
        
        newItem.addEventListener('click', () => {
            this.showModal(post, userName);
        });

        return newItem;
    }

    showModal(post, userName) {
        const $modalBk = $('.modalBk');
        const $modalJsonValueCont = $('.modalJsonValueCont');


        $modalJsonValueCont.innerHTML = `
            <div class="modalImg"><img src="" alt=""></div>
            <div class="modalDescription">
                <h3 class="modalTitle">${post.title}</h3>
                <h5 class="modalContents">${post.contents}</h5>
            </div>
            <ul class="memberCont">
                <li class="modalMemberIndex">${userName}</li>
                <li class="modalDate">${post.date}</li>
            </ul>
        `;

        $modalBk.style.display = 'block';
        $modalJsonValueCont.style.display = 'block';
    }

    renderData() {
        const container = $('.container');
        this.posts.forEach(post => {
            const newItem = this.createPostElement(post);
            container.appendChild(newItem);
        });
    }
}

const dataFetcher = new DataFetcher();
dataFetcher.fetchData();
