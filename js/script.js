// 导航栏滚动效果 - 监听页面滚动，根据滚动位置改变导航栏样式
window.addEventListener('scroll', function() {
    // 获取导航栏元素
    const nav = document.getElementById('main-nav');
    
    // 判断滚动距离，当超过50px时应用滚动效果
    if (window.scrollY > 50) {
        // 添加半透明背景和更深的阴影
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    } else {
        // 恢复默认样式
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// 移动端菜单切换功能
// 获取菜单按钮和导航链接元素
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// 为菜单按钮添加点击事件监听
menuToggle.addEventListener('click', function() {
    // 切换按钮的active类，实现图标动画
    this.classList.toggle('active');
    // 切换导航链接容器的active类，实现菜单显示/隐藏
    navLinks.classList.toggle('active');
    
    // 切换body滚动锁定
    document.body.style.overflow = this.classList.contains('active') ? 'hidden' : 'auto';
});

// 平滑滚动功能 - 为所有锚点链接添加平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // 为每个锚点链接添加点击事件监听
    anchor.addEventListener('click', function(e) {
        // 阻止默认的跳转行为
        e.preventDefault();
        
        // 点击导航链接后关闭移动端菜单
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // 获取目标锚点ID
        const targetId = this.getAttribute('href');
        // 如果是页面顶部(#)，则不执行滚动
        if (targetId === '#') return;
        
        // 获取目标元素
        const targetElement = document.querySelector(targetId);
        // 确保目标元素存在
        if (targetElement) {
            // 计算目标位置，考虑导航栏高度进行偏移
            const navHeight = document.getElementById('main-nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            // 执行平滑滚动到目标位置
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth' // 使用平滑动画
            });
        }
    });
});

// 图片懒加载功能 - 优化页面加载性能
// 检查浏览器是否支持原生懒加载
if ('loading' in HTMLImageElement.prototype) {
    // 如果支持，获取所有标记为lazy的图片
    const images = document.querySelectorAll('img[loading="lazy"]');
    // 遍历并设置图片源
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // 如果不支持原生懒加载，使用自定义懒加载实现
    const lazyImages = document.querySelectorAll('img');
    
    // 创建Intersection Observer用于监测图片是否进入视口
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // 如果图片有data-src属性，将其赋值给src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                // 停止观察该图片
                observer.unobserve(img);
            }
        });
    });
    
    // 对所有图片应用观察器
    lazyImages.forEach(img => imageObserver.observe(img));
}

// 图片淡入效果 - 当图片进入视口时显示淡入动画
// 获取所有图片元素
const allImages = document.querySelectorAll('.story-img, .interview-img');

// 检查图片是否在视口中的函数
function checkImageVisibility() {
    allImages.forEach(img => {
        // 获取图片相对于视口的位置
        const imgTop = img.getBoundingClientRect().top;
        const imgBottom = img.getBoundingClientRect().bottom;
        
        // 如果图片部分或完全在视口中
        if (imgTop < window.innerHeight && imgBottom > 0) {
            // 设置透明度为1，显示图片（触发淡入效果）
            img.style.opacity = '1';
        }
    });
}

// 初始化所有图片的样式
allImages.forEach(img => {
    // 初始设置透明度为0，隐藏图片
    img.style.opacity = '0';
    // 设置过渡效果，使透明度变化平滑
    img.style.transition = 'opacity 0.8s ease, transform 0.5s ease';
});

// 添加图片加载完成后的淡入效果
allImages.forEach(img => {
    // 图片加载完成后检查可见性
    img.addEventListener('load', checkImageVisibility);
    // 对于已经加载完成的图片，直接检查可见性
    if (img.complete) {
        checkImageVisibility();
    }
});

// 页面加载完成后检查一次图片可见性
window.addEventListener('load', checkImageVisibility);
// 页面滚动时持续检查图片可见性
window.addEventListener('scroll', checkImageVisibility);
// 页面调整大小时检查图片可见性
window.addEventListener('resize', checkImageVisibility);

// 为故事区块添加滚动动画效果
const storyBlocks = document.querySelectorAll('.story-block');

// 故事区块滚动动画观察器
const storyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const storyBlock = entry.target;
            // 添加进入视口的动画类
            storyBlock.style.opacity = '1';
            storyBlock.style.transform = 'translateY(0)';
            // 停止观察该元素
            observer.unobserve(storyBlock);
        }
    });
}, { threshold: 0.1 });

// 初始化故事区块样式并应用观察器
storyBlocks.forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(30px)';
    block.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    storyObserver.observe(block);
});

// 为访谈卡片添加滚动动画效果
const interviewCards = document.querySelectorAll('.interview-card');

// 访谈卡片滚动动画观察器
const interviewObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            // 添加进入视口的动画类
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            // 停止观察该元素
            observer.unobserve(card);
        }
    });
}, { threshold: 0.1 });

// 初始化访谈卡片样式并应用观察器
interviewCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    // 为不同卡片设置不同的延迟，创建错开的动画效果
    card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    interviewObserver.observe(card);
});