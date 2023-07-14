# [Documentinator](https://github.com/idkhow2type/steamhack2023-round1/tree/master)

## Description
[no](views/dashboard.ejs)

## Usage
1. Đi đến [chat.chatgptdemo.net](https://chat.chatgptdemo.net/)
2. Mở Dev Tools > Application > Cookies > https://chat.chatgptdemo.net
    - Nếu tồn tại mục `cf_clearence`
        - Tạo file `.env`
        - Nhập
            ```bash
            cf_clearence=
            user_agent=
        - Copy giá trị của mục `cf_clearence` và cho vào `.env`
        - Mở Console, nhập `navigator.userAgent`, copy giá trị nhận được vào `.env`
1. Tải NodeJS, khuyến nghị phiên bản mới nhất (v19.6.0+)
2. Mở terminal trong folder chứa file này
3. Chạy
    ```bash
    npm i
    npm run build
    npm run start
    ```
3. Vào [localhost:3000](http://localhost:3000) và trải nghiệm sản phẩm

## Credits
- [chat.chatgptdemo.net](https://chat.chatgptdemo.net/): LLM API
- [chatgptdemo-api](https://github.com/idkhow2type/chatgptdemo-api): NodeJS API wrapper
- [unsplash.com](https://unsplash.com/): Assets