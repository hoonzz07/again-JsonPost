
// const main = 

const main = async () => {
  const [pData, uData, cData] = await Promise.all([
    fetch('./json/posts.json').then(res => res.json()),
    fetch('./json/members.json').then(res => res.json()),
    fetch('./json/categorys.json').then(res => res.json())
  ]);

  const sPData = pData.sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log(sPData);

  const cont = document.querySelector('.cont');
  const modal = document.getElementById('myModal');
  const mTitle = document.getElementById('modalTitle');
  const mContents = document.getElementById('modalContents');

  const displayItems = (items) => {
    cont.innerHTML = '';
    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-cont');

      let uName = '';
      uData.forEach(data => {
        if (data.index == item.memberIndex) {
          uName = data.name;
        }
      });

      itemDiv.innerHTML = `
        <div class="img-cont"></div>
        <div class="item">
          <ul class="head-cont">
            <h4 class="item-head">${item.title}</h4>
            <li class="small">${item.contents}</li>
          </ul>
          <ul class="user-cont">
            <li class="user-name">사용자 인덱스: ${uName}</li>
            <li class="date">${item.date}</li>
          </ul>
        </div>
      `;

      itemDiv.addEventListener('click', () => {
        mTitle.textContent = item.title;
        mContents.textContent = item.contents;

        const matchingCategories = item.categorys
          .filter(index => cData.some(cat => cat.index === index));
        
        const categoryElements = matchingCategories.map(index => {
          const category = cData.find(cat => cat.index === index);
          return `<span class="category" style="display: inline-block; background-color: ${category.color}; color: white; padding: 5px; margin: 2px; border-radius: 3px;">${category.name}</span>`;
        }).join('');

        mContents.innerHTML += `<div>${categoryElements}</div>`;
        modal.style.display = 'flex';
      });

      cont.appendChild(itemDiv);
    });
  };

  displayItems(sPData);

  const searchModal = document.getElementById('searchModal');
  const nSearchInput = document.getElementById('nameSearchInput');
  const cSearchInput = document.getElementById('categorySearchInput');
  const sBtn = document.getElementById('searchBtn');
  const closeBtn = document.getElementById('closeSearchBtn');
  const addBtn = document.getElementById('addCategoryBtn');
  const cTags = document.getElementById('categoryTags');

  document.querySelector('.searchBtn').addEventListener('click', () => {
    searchModal.style.display = 'flex';
  });

  addBtn.addEventListener('click', () => {
    const cInput = cSearchInput.value.trim();
    if (cInput) {
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('category-tag');
      tagDiv.textContent = cInput;

      tagDiv.addEventListener('click', () => {
        cTags.removeChild(tagDiv);
      });

      cTags.appendChild(tagDiv);
      cSearchInput.value = '';
    }
  });

  sBtn.addEventListener('click', () => {
    const nQuery = nSearchInput.value.toLowerCase();
    const aCategories = Array.from(cTags.children).map(tag => tag.textContent.toLowerCase());
    
    const fPosts = sPData.filter(item => {
      const uName = uData.find(data => data.index === item.memberIndex).name.toLowerCase();
      const hasMatchingCategories = aCategories.every(aCategory => 
        item.categorys.some(index => {
          const category = cData.find(cat => cat.index === index);
          return category.name.toLowerCase() === aCategory;
        })
      );

      return uName.includes(nQuery) && hasMatchingCategories;
    });

    displayItems(fPosts);
  });

  closeBtn.addEventListener('click', () => {
    searchModal.style.display = 'none';
    nSearchInput.value = '';
    cTags.innerHTML = '';
    displayItems(sPData);
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      mContents.innerHTML = '';
    }
    if (event.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });
};

main();

// last commit 

//last ssearchModal === searchModal windown

// 2024-11-05 commit


//git push remote