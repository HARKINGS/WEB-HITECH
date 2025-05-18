# WEB
* Toàn bộ thông tin, quá trình lập trình, thiết kế, làm việc sẽ được lưu tại đây

# Trương Minh Ngọc
## 16/03/2025
### Đã làm được
* Chỉnh sửa phần User Controller
* Hoàn thiện thêm code của File service, với Permission, Role
* Code các chức năng cho Permission, Role (thêm, xoá, xem toàn bộ)
* Xử lý các exception thông qua code file exception
* Thêm repository (RoleRepository, PermissionRepository)
* Hoàn thiện DTO (Data transfer Object)
* Thêm Validator cho xử lý exception về độ tuổi (Thuận tiện hoá thay đổi độ tuổi xử lý)
### Chưa làm được
* Chức năng login, logout do chưa đủ thời gian
### Dự kiến tương lai
* Thực hiện chức năng login/logout và tiếp tục code tiếp backend, sau đó sẽ code frontend


## 23/03/2025
### Đã làm được
* Merge code, xử lý xung đột code 2 người back end
* Bước đầu code login, logout

### Chưa làm được
* Chưa xong login logout (Do chưa có thời gian, làm muộn)

### Dự kiến tương lai
* Hoàn thiện login, logout trong tuần tới

## 30/03/2025
### Đã làm được
* Code xong phần ConFigure cho code
  * Điều chỉnh việc thêm tài khoản admin khi chưa có
  * Xử lý các request chưa được xác thực
  * Hoàn thiện phần login/logout
* Hoàn thiện phần controller, phần code đã ổn định với việc quản lý tài khoản

### Chưa làm được
* Trong quá trình chạy lại để kiểm tra, lại phát sinh lỗi
  * Mặc dù run được, nhưng các request đều bị lỗi Unauthorized!
* Nguyên nhân vẫn đang tìm kiếm, nhưng đây có thể là lỗi về mặt phân quyền

### Dự kiến tương lai
* Sửa lỗi đang mắc phải
* Phát triển tiếp phần Front End
* Tìm hiểu RAG

## 06/04/2025
### Đã làm được
* Chỉnh sửa lỗi 1 số truy vấn như login, create account, get info, get account,...
* Tạo thêm, cập nhập báo cáo ở file README.md
* (1 thành viên khác) Code them phần goodsReview, infoBuy, OrderItem, ...

## 12/04/2025
### Đã làm được
* Code phân quyền cho các vai trò
* Các vai trò user, staff, admin đều có quyền thực hiện 1 số chức năng chung, admin sẽ sở hữu nhiều quyền nhất, rồi tới staff, cuối cùng là user
* Chạy thử đã ổn định các chức năng, API chính liên quan đến quản lý tài khoản, vai trò, quyền
### Chưa làm được
* Hiểu sâu về RAG
* Code front end
### Dự kiến tương lai
* Tìm hiểu và áp dụng RAG vào code
* Code front end

## 20/04/2025
### Đã làm được
* Thực hiện up database lên cloud (= railway, tuy nhiên cloud của railway lại chỉ chấp nhận version java-17)
* Hoan thiện, chỉnh sửa, đổi tên Review thành GoodsReview, cùng các class liên quan
* Đã tìm hiểu về RAG, LLM (Language Model và Large Language Model), transformers
* Bắt đầu tiến hành làm báo cáo
### Chưa làm được
* Hoàn thiện báo cáo
* Code xong RAG
### Dự kiến
* Tiếp tục code hoàn thiện Backend, code Frontend

## 27/04/2025
### Đã làm được
* Thực hiện thêm thuộc tính cho Voucher như hạn sử dụng, ...
* Tạo mapper, service, controller cho service
### Chưa làm được
* Lỗi trong quá trình chạy code (do cài lại win, giờ lại gặp vấn đề về code)
* Code chưa xong backend, có lẽ cần phai chỉnh sửa code toàn diện về Voucher
### Dự tính tương lai
* Khắc phục lỗi code 
* Làm tiếp báo cáo

# Tên ai thì điền vào
## 01/04/2025
- Đã làm: Tạo Header và logic đổi Theme Light/Dark
- Chưa làm: Tạo Category (danh mục sản phẩm) và Footer