import { $, $$ } from "./lib.js";

class DataFetcher {
    constructor() {
        this.category = null;
        this.member = null;
        this.posts = null;
        this.filteredPosts = []; // 수정: 필터링된 데이터를 저장하는 전역 배열 추가
        this.fetchData();
        this.addKeydownEvent();
    }

    async fetchData() {
        try {
            [this.category, this.member, this.posts] = await Promise.all([
                fetch('./json/categorys.json').then(res => res.json()),
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

    getCategoryInfo(categoryIndex) {
        const category = this.category.find(data => data.index === categoryIndex);
        return category ? { name: category.name, color: category.color } : { name: 'Unknown Category', color: '#000' };
    }

    getCategoriesHtml(categoryIndices) {
        return categoryIndices.map(index => {
            const { name, color } = this.getCategoryInfo(index);
            return `<li class="categoryValue" style="color: ${color}; background-color: ${color}; color: white; border-radius: 10px; padding: .3rem;">${name}</li>`;
        }).join('');
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
        
        // 이벤트 바인딩: 요소 클릭 시 모달 표시
        newItem.addEventListener('click', () => {
            this.showModal(post, userName);
        });
        
        return newItem;
    }

    
    closeModal($modalBk, $modalJsonValueCont) {
        $modalBk.style.display = 'none';
        $modalJsonValueCont.style.display = 'none';
    }

    

    showModal(post, userName) {
        const $modalBk = $('.modalBk');
        const $modalJsonValueCont = $('.modalJsonValueCont');
    
        // 모달 요소가 null인지 확인
        if (!$modalBk || !$modalJsonValueCont) {
            console.error("Modal elements not found");
            return; // 요소가 없으면 함수를 종료
        }
    
        // 모달 닫기 이벤트 설정
        $modalBk.addEventListener('click', () => {
            this.closeModal($modalBk, $modalJsonValueCont);
        });
        
        $modalJsonValueCont.addEventListener('click', (event) => {
            event.stopPropagation(); // 모달 내부 클릭 시 전파 방지
        });
    
        // 모달 내용 업데이트
        $modalJsonValueCont.innerHTML = `
            <div class="modalImg"><img src="" alt=""></div>
            <div class="modalDescription">
                <h3 class="modalTitle">${post.title}</h3>
                <h5 class="modalContents">${post.contents}</h5>
                <ul class="category" style="display:flex; gap:5px;">
                    ${this.getCategoriesHtml(post.categorys)}
                </ul>
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

    addKeydownEvent() {
        document.addEventListener('keydown', (event) => {
            if (event.shiftKey && event.key === 'Enter') {
                this.showSearchModal();
            }
        });
    }


    showSearchModal() {
        const $modalBk = $('.modalBk');
        const $modalJsonValueCont = $('.modalJsonValueCont');

        $modalBk.style.display = 'block';
        $modalJsonValueCont.style.display = 'block';

        $modalJsonValueCont.innerHTML = `
            <h2 class="searchH2">SEARCH</h2>
            <div class="searchValueCont">
                <h4 class="searchUserName">유저 이름</h4>
                <input class="searchInput" type="text" placeholder="유저 이름을 입력하세요" id="userNameInput">
                <h4 class="searchUserCategory">카테고리</h4>
                <input class="searchInput" type="text" placeholder="#" id="categoryInput">
                <ul class="srcCateCont" id="categoryList"></ul>
                <div class="submitBtn">
                    <button class="cancelBtn">Cancel</button>
                    <button class="searchBtn">Search</button>
                </div>
            </div>
        `;

        const searchBtn = $modalJsonValueCont.querySelector('.searchBtn');
        searchBtn.addEventListener('click', () => {
            this.filterPosts();
        });

        $modalBk.addEventListener('click', () => {
            this.closeModal($modalBk, $modalJsonValueCont);
        });

        $modalJsonValueCont.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    filterPosts() {
        const userNameInput = $('#userNameInput').value.toLowerCase();
        const categoryInput = $('#categoryInput').value.toLowerCase();
    
        this.filteredPosts = this.posts.filter(post => {
            const userName = this.getUserName(post.memberIndex).toLowerCase();
            const categories = post.categorys.map(catIndex => this.getCategoryInfo(catIndex).name.toLowerCase());
            const matchesUserName = userName.includes(userNameInput); 
            const matchesCategory = categoryInput ? categories.some(cat => cat.includes(categoryInput)) : true;
            return matchesUserName && matchesCategory;
        });
    
        this.displayFilteredPosts(this.filteredPosts);
    }
    
    displayFilteredPosts(filteredPosts) {
        const container = $('.container');
        container.innerHTML = ''; 
    
        filteredPosts.forEach(post => {
            const newItem = this.createPostElement(post);
            container.appendChild(newItem);
    
            const userName = this.getUserName(post.memberIndex);
            newItem.addEventListener('click', () => {
                this.showModal(post, userName);
            });
        });
    }
    
    
    showModal(post, userName) {
        const $modalBk = $('.modalBk');
        const $modalJsonValueCont = $('.modalJsonValueCont');
        
    
        // 모달 닫기 이벤트 설정
        $modalBk.addEventListener('click', () => {
            this.closeModal($modalBk, $modalJsonValueCont);
        }); 

        $modalJsonValueCont.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    
        $modalJsonValueCont.innerHTML = `
            <div class="modalImg"><img src="" alt=""></div>
            <div class="modalDescription">
                <h3 class="modalTitle">${post.title}</h3>
                <h5 class="modalContents">${post.contents}</h5>
                <ul class="category" style="display:flex; gap:5px;">
                    ${this.getCategoriesHtml(post.categorys)}
                </ul>
            </div>
            <ul class="memberCont">
                <li class="modalMemberIndex">${userName}</li>
                <li class="modalDate">${post.date}</li>
            </ul>
        `;
    
        $modalBk.style.display = 'block';
        $modalJsonValueCont.style.display = 'block';
    }
    
}

new DataFetcher();